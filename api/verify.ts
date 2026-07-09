import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendThankYouEmail } from "./thank-you-email.js";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  cachedClient = client;
  return client;
}

function buildSiteUrl(req: VercelRequest) {
  const protocol =
    typeof req.headers["x-forwarded-proto"] === "string"
      ? req.headers["x-forwarded-proto"]
      : "https";
  const host = typeof req.headers.host === "string" ? req.headers.host : "";
  const publicSiteUrl = process.env.PUBLIC_SITE_URL || "";
  const usablePublicSiteUrl =
    publicSiteUrl && !publicSiteUrl.includes("your-domain.com") ? publicSiteUrl : "";

  return (
    usablePublicSiteUrl ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (host ? `${protocol}://${host}` : "")
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ verified: false, message: "Method Not Allowed" });
  }

  const paymentId =
    typeof req.query.razorpay_payment_id === "string"
      ? req.query.razorpay_payment_id
      : "";
  const linkId =
    typeof req.query.razorpay_payment_link_id === "string"
      ? req.query.razorpay_payment_link_id
      : "";
  const linkStatus =
    typeof req.query.razorpay_payment_link_status === "string"
      ? req.query.razorpay_payment_link_status
      : "";

  if (!paymentId.startsWith("pay_") || linkStatus !== "paid") {
    return res.status(400).json({ verified: false, message: "Invalid payment params" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");
    const payments = db.collection("payments");

    const existingRecord = await payments.findOne({
      paymentId,
      status: { $in: ["verified", "redirect_paid"] },
    });

    if (existingRecord) {
      return res.status(200).json({ verified: true });
    }

    const pendingRecord = await payments.findOne(
      {
        status: "pending",
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      { sort: { updatedAt: -1, createdAt: -1 } },
    );

    await payments.updateOne(
      pendingRecord?._id ? { _id: pendingRecord._id } : { paymentId },
      {
        $set: {
          paymentId,
          paymentLinkId: linkId,
          status: "redirect_paid",
          paymentStatus: "paid",
          source: pendingRecord?.source || "razorpay_redirect",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    const paidRecord = await payments.findOne({ paymentId });
    const email = typeof paidRecord?.email === "string" ? paidRecord.email : "";

    if (email && !paidRecord?.thankYouEmailSentAt) {
      try {
        await sendThankYouEmail({
          email,
          paymentId,
          siteUrl: buildSiteUrl(req),
        });

        await payments.updateOne(
          { paymentId },
          {
            $set: {
              thankYouEmailSentAt: new Date(),
              thankYouEmailStatus: "sent",
            },
            $unset: {
              thankYouEmailError: "",
            },
          },
        );
      } catch (emailError) {
        console.error("Redirect thank-you email failed:", emailError);
        await payments.updateOne(
          { paymentId },
          {
            $set: {
              thankYouEmailStatus: "failed",
              thankYouEmailError:
                emailError instanceof Error ? emailError.message : "Unknown email error",
            },
          },
        );
      }
    }

    return res.status(200).json({ verified: true, source: "redirect_fallback" });
  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ verified: false, message: "Server error" });
  }
}

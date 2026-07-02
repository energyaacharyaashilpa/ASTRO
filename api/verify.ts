import crypto from "crypto";
import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const paymentId = req.query.payment_id;
  const paymentLinkId = req.query.payment_link_id;
  const paymentLinkReferenceId = req.query.payment_link_reference_id;
  const paymentLinkStatus = req.query.payment_link_status;
  const signature = req.query.signature;
  const isValidPaymentId =
    typeof paymentId === "string" && /^pay_[A-Za-z0-9]+$/.test(paymentId);
  const isValidPaymentLinkId =
    typeof paymentLinkId === "string" && /^plink_[A-Za-z0-9]+$/.test(paymentLinkId);
  const hasValidCallbackFields =
    isValidPaymentId &&
    isValidPaymentLinkId &&
    typeof paymentLinkReferenceId === "string" &&
    /^astro-[A-Za-z0-9]+$/.test(paymentLinkReferenceId) &&
    paymentLinkStatus === "paid" &&
    typeof signature === "string" &&
    /^[a-f0-9]{64}$/i.test(signature);

  if (!hasValidCallbackFields) {
    return res.status(400).json({ verified: false, message: "Invalid payment callback" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("RAZORPAY_KEY_SECRET is missing");
    return res.status(500).json({ message: "Payment verification is not configured" });
  }

  const signaturePayload = [
    paymentLinkId,
    paymentLinkReferenceId,
    paymentLinkStatus,
    paymentId,
  ].join("|");
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(signaturePayload)
    .digest("hex");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return res.status(403).json({ verified: false, message: "Invalid payment signature" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");
    const paymentsCollection = db.collection("payments");

    const claimResult = await paymentsCollection.updateOne(
      {
        paymentId,
        paymentLinkId,
        status: "verified",
        thankYouClaimedAt: { $exists: false },
      },
      {
        $set: {
          thankYouClaimedAt: new Date(),
          paymentLinkReferenceId,
        },
      },
    );

    if (claimResult.modifiedCount === 1) {
      return res.status(200).json({ verified: true });
    }

    return res.status(200).json({ verified: false });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

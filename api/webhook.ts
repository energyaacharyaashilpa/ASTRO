import crypto from "crypto";
import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendThankYouEmail } from "./thank-you-email.js";

// We MUST disable the body parser to get the exact raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

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
  if (req.method === "GET") {
    if (req.query.check === "mongo") {
      try {
        const client = await connectToDatabase();
        const db = client.db(process.env.MONGODB_DB_NAME || "astro");
        await db.command({ ping: 1 });
        const paymentsCount = await db.collection("payments").countDocuments();
        const webhookEventsCount = await db.collection("webhook_events").countDocuments();

        return res.status(200).json({
          status: "mongo connected",
          dbName: db.databaseName,
          paymentsCount,
          webhookEventsCount,
        });
      } catch (error) {
        console.error("Mongo diagnostic failed:", error);
        return res.status(500).json({
          status: "mongo connection failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return res.status(200).json({
      status: "webhook endpoint is live",
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasWebhookSecret: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
      hasBrevoApiKey: Boolean(process.env.BREVO_API_KEY),
      dbName: process.env.MONGODB_DB_NAME || "astro",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is missing");
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const signature = req.headers["x-razorpay-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ message: "Missing Razorpay Signature" });
  }

  try {
    // Read the raw body stream
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks).toString("utf8");

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay signature!");
      return res.status(403).json({ message: "Invalid Signature" });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`Received Razorpay webhook event: ${event}`);

    if (event === "payment.captured" || event === "payment_link.paid") {
      const payment = payload.payload?.payment?.entity || payload.payload?.payment_link?.entity;
      const paymentId = payment?.id || payment?.payment_id;

      if (!paymentId) {
        console.warn("Verified Razorpay webhook did not include a payment id");
        return res.status(200).json({ status: "ok" });
      }

      const client = await connectToDatabase();
      const db = client.db(process.env.MONGODB_DB_NAME || "astro");
      const paymentsCollection = db.collection("payments");
      const webhookEventsCollection = db.collection("webhook_events");

      await webhookEventsCollection.insertOne({
        event,
        paymentId,
        orderId: payment?.order_id,
        invoiceId: payment?.invoice_id,
        paymentStatus: payment?.status,
        receivedAt: new Date(),
      });

      const rawEmail = payment?.email || payment?.customer?.email;
      const email =
        typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
      const contact =
        typeof (payment?.contact || payment?.customer?.contact) === "string"
          ? (payment.contact || payment.customer.contact).replace(/\D/g, "").slice(-10)
          : "";
      const existingPayment = await paymentsCollection.findOne({ paymentId });
      let paymentFilter: Record<string, unknown> = { paymentId };

      if (existingPayment?._id) {
        paymentFilter = { _id: existingPayment._id };
      } else if (email || contact) {
        const identityFilter =
          email && contact
            ? { email, contact }
            : email
              ? { email }
              : { contact };
        const pendingPayment = await paymentsCollection.findOne(
          {
            ...identityFilter,
            status: "pending",
            createdAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          },
          { sort: { createdAt: -1 } },
        );

        if (pendingPayment?._id) {
          paymentFilter = { _id: pendingPayment._id };
        }
      }

      await paymentsCollection.updateOne(
        paymentFilter,
        { 
          $set: { 
            paymentId,
            orderId: payment?.order_id,
            invoiceId: payment?.invoice_id,
            method: payment?.method,
            paymentStatus: payment?.status,
            razorpayEvent: event,
            status: "verified",
            amount: payment?.amount,
            currency: payment?.currency,
            email,
            contact,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      const verifiedPayment = await paymentsCollection.findOne({ paymentId });
      if (email && !verifiedPayment?.thankYouEmailSentAt) {
        const protocol =
          typeof req.headers["x-forwarded-proto"] === "string"
            ? req.headers["x-forwarded-proto"]
            : "https";
        const host =
          typeof req.headers.host === "string" ? req.headers.host : "";
        const publicSiteUrl = process.env.PUBLIC_SITE_URL || "";
        const usablePublicSiteUrl =
          publicSiteUrl && !publicSiteUrl.includes("your-domain.com") ? publicSiteUrl : "";
        const siteUrl =
          usablePublicSiteUrl ||
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
          (host ? `${protocol}://${host}` : "");

        try {
          await sendThankYouEmail({
            email,
            paymentId,
            amount: payment?.amount,
            currency: payment?.currency,
            siteUrl,
          });

          await paymentsCollection.updateOne(
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
          console.error("Thank-you email failed:", emailError);
          await paymentsCollection.updateOne(
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

      console.log(`Successfully verified Razorpay ${event}: ${paymentId}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import crypto from "crypto";
import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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
      const payment = payload.payload?.payment?.entity;
      const paymentLink = payload.payload?.payment_link?.entity;
      const paymentId = payment?.id;
      const paymentLinkId = paymentLink?.id;

      if (!paymentId && !paymentLinkId) {
        console.warn("Verified Razorpay webhook did not include a payment or payment link id");
        return res.status(200).json({ status: "ok" });
      }

      const client = await connectToDatabase();
      const db = client.db(process.env.MONGODB_DB_NAME || "astro");
      const paymentsCollection = db.collection("payments");
      const webhookEventsCollection = db.collection("webhook_events");

      await webhookEventsCollection.insertOne({
        event,
        paymentId,
        paymentLinkId,
        orderId: payment?.order_id,
        invoiceId: payment?.invoice_id,
        paymentStatus: payment?.status,
        paymentLinkStatus: paymentLink?.status,
        receivedAt: new Date(),
      });

      await paymentsCollection.updateOne(
        paymentId ? { paymentId } : { paymentLinkId },
        { 
          $set: { 
            paymentId,
            paymentLinkId,
            orderId: payment?.order_id,
            invoiceId: payment?.invoice_id,
            method: payment?.method,
            paymentStatus: payment?.status,
            paymentLinkStatus: paymentLink?.status,
            razorpayEvent: event,
            status: "verified",
            amount: payment?.amount ?? paymentLink?.amount,
            currency: payment?.currency ?? paymentLink?.currency,
            email: payment?.email ?? paymentLink?.customer?.email,
            contact: payment?.contact ?? paymentLink?.customer?.contact,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      console.log(`Successfully verified Razorpay ${event}: ${paymentId || paymentLinkId}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

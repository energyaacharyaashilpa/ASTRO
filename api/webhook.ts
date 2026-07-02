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

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      const db = client.db(); // uses default db from URI
      const paymentsCollection = db.collection("payments");

      await paymentsCollection.updateOne(
        paymentId ? { paymentId } : { paymentLinkId },
        { 
          $set: { 
            paymentId,
            paymentLinkId,
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

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
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(403).json({ message: "Invalid Signature" });
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    
    // We only care about payment.captured for now
    if (payload.event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const paymentId = payment.id;
      
      const client = await connectToDatabase();
      const db = client.db(); // uses default db from URI
      const paymentsCollection = db.collection("payments");

      await paymentsCollection.updateOne(
        { paymentId },
        { 
          $set: { 
            paymentId, 
            status: "verified",
            amount: payment.amount,
            currency: payment.currency,
            email: payment.email,
            contact: payment.contact,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      console.log(`Successfully verified and stored payment ${paymentId}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

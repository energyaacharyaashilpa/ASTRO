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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const paymentId = req.query.payment_id;
  const paymentLinkId = req.query.payment_link_id;

  if (
    (!paymentId || typeof paymentId !== "string") &&
    (!paymentLinkId || typeof paymentLinkId !== "string")
  ) {
    return res.status(400).json({ message: "Missing payment_id or payment_link_id" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const paymentsCollection = db.collection("payments");

    const payment = await paymentsCollection.findOne({
      $or: [
        ...(typeof paymentId === "string" ? [{ paymentId }] : []),
        ...(typeof paymentLinkId === "string" ? [{ paymentLinkId }] : []),
      ],
    });

    if (payment && payment.status === "verified") {
      return res.status(200).json({ verified: true });
    } else {
      return res.status(200).json({ verified: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

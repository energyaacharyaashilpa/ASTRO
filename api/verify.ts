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
  const isValidPaymentId =
    typeof paymentId === "string" && /^pay_[A-Za-z0-9]+$/.test(paymentId);
  const isValidPaymentLinkId =
    typeof paymentLinkId === "string" && /^plink_[A-Za-z0-9]+$/.test(paymentLinkId);

  if (!isValidPaymentId && !isValidPaymentLinkId) {
    return res.status(400).json({ verified: false, message: "Invalid payment identifier" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");
    const paymentsCollection = db.collection("payments");

    const payment = await paymentsCollection.findOne({
      $or: [
        ...(isValidPaymentId ? [{ paymentId }] : []),
        ...(isValidPaymentLinkId ? [{ paymentLinkId }] : []),
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

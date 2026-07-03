import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

// GET /api/verify?razorpay_payment_id=pay_xxx&razorpay_payment_link_id=plink_xxx&razorpay_payment_link_status=paid
// Called by the ThankYou page to confirm the payment exists in MongoDB.
// The webhook must have already written status:"verified" before this runs.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for same-origin Vercel calls
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ verified: false, message: "Method Not Allowed" });
  }

  const paymentId = typeof req.query.razorpay_payment_id === "string"
    ? req.query.razorpay_payment_id : "";
  const linkStatus = typeof req.query.razorpay_payment_link_status === "string"
    ? req.query.razorpay_payment_link_status : "";

  // Basic format guard
  if (!paymentId.startsWith("pay_") || linkStatus !== "paid") {
    return res.status(400).json({ verified: false, message: "Invalid payment params" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");

    const record = await db.collection("payments").findOne({
      paymentId,
      status: "verified",
    });

    if (record) {
      return res.status(200).json({ verified: true });
    }

    // Not yet — webhook may be slightly delayed, tell client to retry
    return res.status(202).json({ verified: false, message: "Payment not yet confirmed. Retry shortly." });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ verified: false, message: "Server error" });
  }
}

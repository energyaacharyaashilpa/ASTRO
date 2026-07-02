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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const contact =
    typeof req.body?.phone === "string" ? req.body.phone.replace(/\D/g, "").slice(-10) : "";
  const verificationToken =
    typeof req.body?.verificationToken === "string" ? req.body.verificationToken : "";

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^\d{10}$/.test(contact) ||
    !/^[a-f0-9]{64}$/.test(verificationToken)
  ) {
    return res.status(400).json({ verified: false, message: "Invalid verification session" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");
    const paymentsCollection = db.collection("payments");

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const payment = await paymentsCollection.findOne({
      email,
      contact,
      verificationTokenHash,
    });

    return res.status(200).json({
      verified: payment?.status === "verified",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

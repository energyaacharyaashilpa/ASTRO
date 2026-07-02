import crypto from "crypto";
import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  cachedClient = client;
  return client;
}

function normalizeContact(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const contact =
    typeof req.body?.phone === "string" ? normalizeContact(req.body.phone) : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Enter a valid email and 10-digit phone number" });
  }

  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || "astro");

    await db.collection("payments").insertOne({
      email,
      contact,
      verificationTokenHash,
      status: "pending",
      source: "hosted_payment_page",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({ email, phone: contact, verificationToken });
  } catch (error) {
    console.error("Payment session creation error:", error);
    return res.status(500).json({ message: "Could not start payment" });
  }
}

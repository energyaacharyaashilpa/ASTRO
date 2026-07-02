import { randomUUID } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const RAZORPAY_PAYMENT_LINKS_URL = "https://api.razorpay.com/v1/payment_links";
const DEFAULT_CALLBACK_URL = "https://easvastuengineering.com/thank-you";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("Razorpay API credentials are missing");
    return res.status(500).json({ message: "Payment service is not configured" });
  }

  try {
    const callbackUrl = process.env.PAYMENT_CALLBACK_URL || DEFAULT_CALLBACK_URL;
    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayResponse = await fetch(RAZORPAY_PAYMENT_LINKS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 99900,
        currency: "INR",
        accept_partial: false,
        reference_id: `astro-${randomUUID().replaceAll("-", "").slice(0, 24)}`,
        description: "Astro Vastu Consultation",
        callback_url: callbackUrl,
        callback_method: "get",
        reminder_enable: true,
      }),
    });

    const data = await razorpayResponse.json();

    if (!razorpayResponse.ok || typeof data.short_url !== "string") {
      console.error("Razorpay payment link creation failed", {
        status: razorpayResponse.status,
        error: data.error || data,
      });
      return res.status(502).json({ message: "Could not start payment" });
    }

    return res.status(200).json({ paymentUrl: data.short_url });
  } catch (error) {
    console.error("Payment link creation error:", error);
    return res.status(500).json({ message: "Could not start payment" });
  }
}

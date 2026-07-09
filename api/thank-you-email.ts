import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

type PaymentEmailDetails = {
  email: string;
  paymentId: string;
  amount?: number;
  currency?: string;
  siteUrl: string;
};

const supportEmail = "energyaacharyaashilpa@gmail.com";
const formUrl =
  "https://docs.google.com/forms/d/1aGIs97cCdXON5-ihwaVQjZBlLLn9P7Li_odu6FFKge0/edit";

function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "";
  const major = amount / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(major);
  } catch {
    return `${currency || "INR"} ${major.toFixed(2)}`;
  }
}

function buildHtml(details: PaymentEmailDetails) {
  const amount = formatAmount(details.amount, details.currency);
  const logoUrl = `${details.siteUrl.replace(/\/$/, "")}/astro.png`;

  return `<!doctype html>
<html>
<body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#222222;">
<table width="100%" cellspacing="0" cellpadding="0" style="background:#f4f9f6;padding:24px 12px;">
  <tr><td align="center">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #d0e8da;border-radius:12px;overflow:hidden;">
      <tr>
        <td align="center" style="background:#0D2E23;padding:24px;">
          <img src="${logoUrl}" alt="Energy Aacharyaa Shilpa" width="160" style="display:block;height:auto;max-width:80%;" />
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 8px;">
          <h1 style="margin:0 0 12px;color:#0D2E23;font-size:22px;">Payment Confirmed ✅</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#333;">Thank you for booking your Astro Vastu consultation with <strong>Energy Aacharyaa Shilpa</strong>.</p>
          <table style="background:#f4f9f6;border:1px solid #c8ddd3;border-radius:8px;padding:16px;width:100%;margin-bottom:16px;">
            <tr><td style="font-size:13px;color:#555;padding:4px 0;">Payment ID</td><td style="font-size:13px;font-family:monospace;color:#0D2E23;font-weight:bold;">${details.paymentId}</td></tr>
            ${amount ? `<tr><td style="font-size:13px;color:#555;padding:4px 0;">Amount</td><td style="font-size:13px;color:#0D2E23;font-weight:bold;">${amount}</td></tr>` : ""}
          </table>
          <h2 style="margin:16px 0 10px;color:#0D2E23;font-size:17px;">Here's what to do next:</h2>
          <ol style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:2;color:#333;">
            <li><a href="${formUrl}" style="color:#2D6B55;font-weight:bold;">Click here to fill out the short application form</a> — be honest with your answers.</li>
            <li>Check your email for the application form. If it went to spam, move it to Primary.</li>
            <li>Our team will review and respond within <strong>48 business hours</strong>.</li>
          </ol>
          <p style="font-size:13px;color:#666;margin:0 0 20px;">If we are unable to take your case, a full refund will be issued within 7 days.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#0D2E23;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#9DC2B2;font-size:12px;">Questions? <a href="mailto:${supportEmail}" style="color:#C9A968;">${supportEmail}</a></p>
          <p style="margin:6px 0 0;color:#4A8870;font-size:11px;">– Energy Aacharyaa Shilpa</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildText(details: PaymentEmailDetails) {
  const amount = formatAmount(details.amount, details.currency);
  return [
    "Payment Confirmed ✅",
    "",
    "Thank you for booking your Astro Vastu consultation with Energy Aacharyaa Shilpa.",
    "",
    `Payment ID : ${details.paymentId}`,
    amount ? `Amount     : ${amount}` : "",
    "",
    "Here's what to do next:",
    `1) Fill out the short application: ${formUrl}`,
    "2) Check your email. If it went to spam, move it to Primary.",
    "3) Our team will review and respond within 48 business hours.",
    "",
    "If we are unable to take your case, a refund will be issued within 7 days.",
    "",
    `Questions? ${supportEmail}`,
    "",
    "– Energy Aacharyaa Shilpa",
  ].filter(l => l !== undefined).join("\n");
}

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendThankYouEmail(details: PaymentEmailDetails) {
  const transporter = createTransporter();
  const from = `"Energy Aacharyaa Shilpa" <${process.env.GMAIL_USER}>`;

  await transporter.sendMail({
    from,
    to: details.email,
    replyTo: supportEmail,
    subject: "Payment Confirmed — Energy Aacharyaa Shilpa",
    html: buildHtml(details),
    text: buildText(details),
  });
}

// Diagnostic endpoint: GET /api/thank-you-email
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  return res.status(200).json({
    status: "thank-you email helper is live (Gmail SMTP)",
    hasGmailUser: Boolean(process.env.GMAIL_USER),
    hasGmailAppPassword: Boolean(process.env.GMAIL_APP_PASSWORD),
    gmailUser: process.env.GMAIL_USER || "not set",
  });
}

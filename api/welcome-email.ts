import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

type WelcomeEmailDetails = {
  name: string;
  email: string;
  phone: string;
  siteUrl: string;
};

const supportEmail = "energyaacharyaashilpa@gmail.com";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  cachedClient = client;
  return client;
}

function normalizeContact(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildSiteUrl(req: VercelRequest) {
  const protocol =
    typeof req.headers["x-forwarded-proto"] === "string"
      ? req.headers["x-forwarded-proto"]
      : "https";
  const host = typeof req.headers.host === "string" ? req.headers.host : "";

  const publicSiteUrl = process.env.PUBLIC_SITE_URL || "";
  const usablePublicSiteUrl =
    publicSiteUrl && !publicSiteUrl.includes("your-domain.com") ? publicSiteUrl : "";

  return (
    usablePublicSiteUrl ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (host ? `${protocol}://${host}` : "")
  );
}

function buildHtmlEmail(details: WelcomeEmailDetails) {
  const name = escapeHtml(details.name || "there");
  const logoUrl = `${details.siteUrl.replace(/\/$/, "")}/astro2.png`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#222222;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #eeeeee;">
            <tr>
              <td align="center" style="padding:24px 24px 8px;">
                <img src="${logoUrl}" alt="Energy Aacharyaa Shilpa" width="170" style="display:block;width:170px;max-width:80%;height:auto;margin:0 auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 8px;">
                <h1 style="margin:0 0 16px;color:#166534;font-size:24px;line-height:1.3;">Welcome, ${name}</h1>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Thank you for sharing your details for Astro Vastu guidance.</p>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Our team has received your request and will connect with you shortly.</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#333333;">Regards,<br>Energy Aacharyaa Shilpa</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 26px;">
                <p style="margin:0;color:#777777;font-size:13px;line-height:1.6;">Questions? Email <a href="mailto:${supportEmail}" style="color:#166534;">${supportEmail}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildTextEmail(details: WelcomeEmailDetails) {
  return [
    `Welcome, ${details.name || "there"}!`,
    "",
    "Thank you for sharing your details for Astro Vastu guidance.",
    "We have received your request and our team will connect with you shortly.",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    "",
    `Questions? Email ${supportEmail}`,
    "",
    "- Energy Aacharyaa Shilpa",
  ].join("\n");
}

async function sendWelcomeEmail(details: WelcomeEmailDetails) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

  await transporter.sendMail({
    from: `"Energy Aacharyaa Shilpa" <${user}>`,
    to: details.email,
    replyTo: supportEmail,
    subject: "Welcome to Energy Aacharyaa Shilpa",
    html: buildHtmlEmail(details),
    text: buildTextEmail(details),
  });
}

async function saveLead(details: WelcomeEmailDetails) {
  const client = await connectToDatabase();
  const db = client.db(process.env.MONGODB_DB_NAME || "astro");
  const contact = normalizeContact(details.phone);
  const now = new Date();

  await db.collection("leads").updateOne(
    { email: details.email },
    {
      $set: {
        name: details.name,
        email: details.email,
        phone: details.phone,
        contact,
        source: "home_form",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await db.collection("payments").updateOne(
    {
      email: details.email,
      contact,
      status: "pending",
    },
    {
      $set: {
        name: details.name,
        phone: details.phone,
        source: "home_form",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "welcome email endpoint is live (Gmail SMTP)",
      hasGmailUser: Boolean(process.env.GMAIL_USER),
      hasGmailAppPassword: Boolean(process.env.GMAIL_APP_PASSWORD),
      siteUrl: buildSiteUrl(req),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const contact = normalizeContact(phone);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Enter a valid name, email and 10-digit phone number" });
  }

  try {
    const details = {
      name,
      email,
      phone,
      siteUrl: buildSiteUrl(req),
    };

    await saveLead(details);

    try {
      await sendWelcomeEmail(details);

      return res.status(200).json({
        status: "saved",
        databaseStatus: "saved",
        emailStatus: "sent",
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);

      return res.status(200).json({
        status: "saved",
        databaseStatus: "saved",
        emailStatus: "failed",
        emailError: emailError instanceof Error ? emailError.message : "Unknown email error",
      });
    }
  } catch (error) {
    console.error("Lead save failed:", error);
    return res.status(500).json({
      message: "Could not save lead",
      detail: error instanceof Error ? error.message : "Unknown database error",
    });
  }
}

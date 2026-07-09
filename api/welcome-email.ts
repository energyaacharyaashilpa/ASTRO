import type { VercelRequest, VercelResponse } from "@vercel/node";

type WelcomeEmailDetails = {
  name: string;
  email: string;
  phone: string;
  siteUrl: string;
};

const supportEmail = "energyaacharyaashilpa@gmail.com";

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

  return (
    process.env.PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (host ? `${protocol}://${host}` : "")
  );
}

function buildHtmlEmail(details: WelcomeEmailDetails) {
  const name = escapeHtml(details.name || "there");
  const phone = escapeHtml(details.phone);
  const logoUrl = `${details.siteUrl.replace(/\/$/, "")}/astro2.png`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8f3e7;font-family:Arial,Helvetica,sans-serif;color:#3b2a12;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f3e7;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fffdf8;border:1px solid #d9bd75;border-radius:18px;overflow:hidden;box-shadow:0 12px 34px rgba(80,58,20,0.12);">
            <tr>
              <td align="center" style="padding:34px 28px 18px;background:#166534;">
                <img src="${logoUrl}" alt="Energy Aacharyaa Shilpa" width="190" style="display:block;width:190px;max-width:82%;height:auto;margin:0 auto;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:30px 28px 18px;">
                <h1 style="margin:0;color:#a57924;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.18;">Welcome, ${name}!</h1>
                <p style="margin:16px 0 0;color:#6c5429;font-size:17px;line-height:1.6;">Thank you for sharing your details for Astro Vastu guidance. We have received your request and our team will connect with you shortly.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <div style="background:#fbf6e8;border:1px solid #ead49b;border-radius:14px;padding:20px;text-align:left;">
                  <p style="margin:0 0 12px;color:#7f5d16;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;">Your details are with us</p>
                  <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#5f4a25;">Name: ${name}</p>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#5f4a25;">Phone: ${phone}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 28px 34px;">
                <p style="margin:0;color:#7a683f;font-size:14px;line-height:1.65;">Questions? Email <a href="mailto:${supportEmail}" style="color:#b98723;">${supportEmail}</a><br><br>- Energy Aacharyaa Shilpa</p>
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
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || supportEmail;
  const senderName = process.env.BREVO_SENDER_NAME || "Energy Aacharyaa Shilpa";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: details.email, name: details.name }],
      replyTo: { email: supportEmail, name: senderName },
      subject: "Welcome to Energy Aacharyaa Shilpa",
      htmlContent: buildHtmlEmail(details),
      textContent: buildTextEmail(details),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo email failed with ${response.status}: ${errorBody}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
    return res.status(400).json({ message: "Enter a valid name, email and phone number" });
  }

  try {
    await sendWelcomeEmail({
      name,
      email,
      phone,
      siteUrl: buildSiteUrl(req),
    });

    return res.status(200).json({ status: "sent" });
  } catch (error) {
    console.error("Welcome email failed:", error);
    return res.status(500).json({ message: "Could not send welcome email" });
  }
}

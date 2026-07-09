import type { VercelRequest, VercelResponse } from "@vercel/node";

type PaymentEmailDetails = {
  email: string;
  paymentId: string;
  amount?: number;
  currency?: string;
  siteUrl: string;
};

const formUrl =
  "https://docs.google.com/forms/d/1aGIs97cCdXON5-ihwaVQjZBlLLn9P7Li_odu6FFKge0/edit";
const supportEmail = "energyaacharyaashilpa@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAmount(amount?: number, currency?: string) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "";

  const majorAmount = amount / 100;
  const safeCurrency = currency || "INR";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(majorAmount);
  } catch {
    return `${safeCurrency} ${majorAmount.toFixed(2)}`;
  }
}

function buildHtmlEmail(details: PaymentEmailDetails) {
  const paymentId = escapeHtml(details.paymentId);
  const amount = formatAmount(details.amount, details.currency);
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
                <h1 style="margin:0 0 16px;color:#166534;font-size:24px;line-height:1.3;">Payment received</h1>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Thank you for booking your Astro Vastu consultation.</p>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Payment ID: <strong>${paymentId}</strong></p>
                ${amount ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Amount: <strong>${escapeHtml(amount)}</strong></p>` : ""}
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#333333;">Next step: <a href="${formUrl}" style="color:#166534;font-weight:bold;">fill this application form</a>.</p>
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

function buildTextEmail(details: PaymentEmailDetails) {
  const amount = formatAmount(details.amount, details.currency);

  return [
    "One more step to go!",
    "",
    "Thank you for showing your interest in the Astro Vastu Analysis!",
    "",
    `Payment Verified: ${details.paymentId}`,
    amount ? `Amount: ${amount}` : "",
    "",
    "Here's what to do next:",
    `1) Fill out the short application: ${formUrl}`,
    "2) Check your email. If it went to spam, move it to Primary.",
    "3) Our team will review your answers and get back to you within 48 business hours.",
    "",
    "If we are unable to take your case, a refund will be issued within 7 days of the review result.",
    "",
    `Questions? Email ${supportEmail}`,
    "",
    "- Energy Aacharyaa Shilpa",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendThankYouEmail(details: PaymentEmailDetails) {
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
      to: [{ email: details.email }],
      replyTo: { email: supportEmail, name: senderName },
      subject: "Payment verified - Astro Vastu Analysis",
      htmlContent: buildHtmlEmail(details),
      textContent: buildTextEmail(details),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo email failed with ${response.status}: ${errorBody}`);
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  return res.status(200).json({
    status: "thank-you email helper is live",
    hasBrevoApiKey: Boolean(process.env.BREVO_API_KEY),
    senderEmail: process.env.BREVO_SENDER_EMAIL || supportEmail,
    senderName: process.env.BREVO_SENDER_NAME || "Energy Aacharyaa Shilpa",
  });
}

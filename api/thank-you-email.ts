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
  const logoUrl = `${details.siteUrl.replace(/\/$/, "")}/astro.png`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8f3e7;font-family:Arial,Helvetica,sans-serif;color:#3b2a12;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f3e7;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fffdf8;border:1px solid #d9bd75;border-radius:18px;overflow:hidden;box-shadow:0 12px 34px rgba(80,58,20,0.12);">
            <tr>
              <td align="center" style="padding:34px 28px 18px;">
                <img src="${logoUrl}" alt="Energy Aacharyaa Shilpa" width="150" style="display:block;width:150px;max-width:70%;height:auto;margin:0 auto 20px;" />
                <h1 style="margin:0;color:#a57924;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.18;">One more step to go!</h1>
                <p style="margin:16px 0 0;color:#6c5429;font-size:18px;line-height:1.55;">Thank you for showing your interest in the Astro Vastu Analysis!</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 20px;">
                <div style="background:#ecf9ee;border:1px solid #bfe7c8;border-radius:14px;padding:14px 16px;color:#176b31;">
                  <div style="font-weight:700;font-size:15px;">Payment Verified</div>
                  <div style="font-family:Consolas,Monaco,monospace;font-size:13px;margin-top:4px;">${paymentId}</div>
                  ${amount ? `<div style="font-size:13px;margin-top:4px;">Amount: ${escapeHtml(amount)}</div>` : ""}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 22px;">
                <div style="background:#fbf6e8;border:1px solid #ead49b;border-radius:14px;padding:22px;text-align:left;">
                  <p style="margin:0 0 16px;color:#7f5d16;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;">Here's what to do next:</p>
                  <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#5f4a25;">1) <a href="${formUrl}" style="color:#b98723;font-weight:700;">Click here</a> to fill out the short application. Be honest with your answers as per your current situation.</p>
                  <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#5f4a25;">2) Check your email. We have sent you the application form. If it went to spam, move it to Primary.</p>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#5f4a25;">3) Our team will review your answers and get back to you within 48 business hours.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 28px 34px;">
                <p style="margin:0 0 18px;color:#7a683f;font-size:14px;line-height:1.65;">If we are unable to take your case, a refund will be issued within 7 days of the review result.</p>
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

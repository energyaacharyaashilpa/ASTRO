# Google Sheets Setup Guide

## Column Layout (15 columns — A to O)

Set up Row 1 with these exact headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Session Key | Name | Mobile | Profession | Email | City | DOB | Birth Time | Birth Place | Issue 1 | Issue 2 | Issue 3 | Payment Status | Transaction ID |

---

## Apps Script Code

1. Open your Google Sheet → **Extensions → Apps Script**
2. Delete all existing code and paste the following:

```javascript
// ============================================================
//  Energy Acharya Shilpa — Google Apps Script Webhook
//  - Receives leads via GET params (CORS-safe)
//  - Sends Gmail notification on new lead
//  - Updates payment status by sessionKey
// ============================================================

// ── CONFIG — update these two values ──────────────────────
const SHEET_NAME        = "Sheet1";           // Tab name at the bottom of your sheet
const NOTIFICATION_EMAIL = "your@gmail.com";  // Gmail address to receive lead alerts
const RAZORPAY_WEBHOOK_TOKEN = "change-this-secret-token"; // Same token used in Razorpay webhook URL
// ──────────────────────────────────────────────────────────

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "createLead")    return createLead(e.parameter);
    if (action === "updatePayment") return updatePayment(e.parameter);
    return response("error", "Unknown action: " + action);
  } catch (err) {
    return response("error", err.toString());
  }
}

// Accept Razorpay webhook POST requests
function doPost(e) {
  try {
    if (e.parameter.token !== RAZORPAY_WEBHOOK_TOKEN) {
      return response("error", "Invalid webhook token");
    }

    const payload = JSON.parse(e.postData.contents || "{}");
    if (payload.event === "payment_link.paid") {
      return processRazorpayPaymentLinkPaid(payload);
    }

    return response("ok", "Webhook ignored: " + (payload.event || "unknown event"));
  } catch (err) {
    return response("error", err.toString());
  }
}

// Safe sheet getter — falls back to first tab if name doesn't match
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// ── Create Lead ──────────────────────────────────────────
function createLead(p) {
  const sheet = getSheet();
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  sheet.appendRow([
    timestamp,           // A: Timestamp
    p.sessionKey  || "", // B: Session Key
    p.name        || "", // C: Name
    p.mobile      || "", // D: Mobile
    p.profession  || "", // E: Profession
    p.email       || "", // F: Email
    p.city        || "", // G: City
    p.dob         || "", // H: DOB
    p.birthTime   || "", // I: Birth Time (e.g. "14:30 (Exact)" or "Not Known")
    p.birthPlace  || "", // J: Birth Place
    p.issue1      || "", // K: Issue 1
    p.issue2      || "", // L: Issue 2
    p.issue3      || "", // M: Issue 3
    "Pending",           // N: Payment Status
    "",                  // O: Transaction ID
  ]);

  // Send Gmail notification
  sendLeadNotification(p, timestamp);

  return response("ok", "Lead saved: " + (p.sessionKey || "no-key"));
}

// ── Update Payment ───────────────────────────────────────
function updatePayment(p) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === p.sessionKey) {              // column B = Session Key
      sheet.getRange(i + 1, 14).setValue(p.status        || "Unknown"); // col N
      sheet.getRange(i + 1, 15).setValue(p.transactionId || "");        // col O

      // Send payment status notification
      sendPaymentNotification(p, data[i]);

      return response("ok", "Payment updated: " + p.sessionKey);
    }
  }
  return response("error", "Session key not found: " + p.sessionKey);
}

// Razorpay Payment Link webhook: payment_link.paid
function processRazorpayPaymentLinkPaid(payload) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  const payment = payload.payload.payment.entity;
  const paymentLink = payload.payload.payment_link.entity;

  const paymentId = payment.id || "";
  const email = String(payment.email || (paymentLink.customer && paymentLink.customer.email) || "").toLowerCase();
  const mobile = normalizePhone(payment.contact || (paymentLink.customer && paymentLink.customer.contact) || "");

  for (let i = data.length - 1; i >= 1; i--) {
    const rowMobile = normalizePhone(data[i][3]);       // col D = Mobile
    const rowEmail = String(data[i][5] || "").toLowerCase(); // col F = Email

    if ((email && rowEmail === email) || (mobile && rowMobile === mobile)) {
      sheet.getRange(i + 1, 14).setValue("Paid");       // col N
      sheet.getRange(i + 1, 15).setValue(paymentId);    // col O

      sendPaymentNotification({
        sessionKey: data[i][1],
        status: "Paid",
        transactionId: paymentId,
      }, data[i]);

      return response("ok", "Razorpay payment updated: " + paymentId);
    }
  }

  return response("error", "No matching lead found for Razorpay payment: " + paymentId);
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

// ── Gmail: New Lead Notification ────────────────────────
function sendLeadNotification(p, timestamp) {
  if (!NOTIFICATION_EMAIL) return;

  const subject = "🌟 New Lead: " + (p.name || "Unknown") + " — Energy Acharya Shilpa";

  const body = `
New consultation enquiry received on ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━
  PERSONAL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Name        : ${p.name       || "—"}
Mobile      : ${p.mobile     || "—"}
Email       : ${p.email      || "—"}
Profession  : ${p.profession || "—"}
City        : ${p.city       || "—"}

━━━━━━━━━━━━━━━━━━━━━━━━
  BIRTH DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Date of Birth : ${p.dob        || "—"}
Birth Time    : ${p.birthTime  || "—"}
Birth Place   : ${p.birthPlace || "—"}

━━━━━━━━━━━━━━━━━━━━━━━━
  CHALLENGES
━━━━━━━━━━━━━━━━━━━━━━━━
Issue 1 : ${p.issue1 || "—"}
Issue 2 : ${p.issue2 || "—"}
Issue 3 : ${p.issue3 || "—"}

━━━━━━━━━━━━━━━━━━━━━━━━
Session Key    : ${p.sessionKey || "—"}
Payment Status : Pending
━━━━━━━━━━━━━━━━━━━━━━━━

View in Google Sheet:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `.trim();

  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });
  } catch (err) {
    Logger.log("Failed to send lead email: " + err.toString());
  }
}

// ── Gmail: Payment Status Notification ──────────────────
function sendPaymentNotification(p, rowData) {
  if (!NOTIFICATION_EMAIL) return;

  const name   = rowData[2] || p.sessionKey;   // col C = Name
  const mobile = rowData[3] || "—";            // col D = Mobile
  const email  = rowData[5] || "—";            // col F = Email
  const status = p.status || "Unknown";

  const emoji  = status === "Paid" ? "✅" : "❌";
  const subject = emoji + " Payment " + status + ": " + name + " — Energy Acharya Shilpa";

  const body = `
Payment status updated for ${name}

━━━━━━━━━━━━━━━━━━━━━━━━
Status         : ${status}
Transaction ID : ${p.transactionId || "N/A"}
Client Name    : ${name}
Mobile         : ${mobile}
Email          : ${email}
Session Key    : ${p.sessionKey}
━━━━━━━━━━━━━━━━━━━━━━━━

View in Google Sheet:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `.trim();

  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });
  } catch (err) {
    Logger.log("Failed to send payment email: " + err.toString());
  }
}

// ── Helper ───────────────────────────────────────────────
function response(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, message }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S). Name the project e.g. `AstroVastuWebhook`.

---

## Step 2 — Configure the Email Address

In the script, find this line near the top and replace with your actual Gmail:

```javascript
const NOTIFICATION_EMAIL = "your@gmail.com";
```

For example:
```javascript
const NOTIFICATION_EMAIL = "energyacharyashilpa@gmail.com";
```

You can also send to multiple addresses by separating with commas:
```javascript
const NOTIFICATION_EMAIL = "energyacharyashilpa@gmail.com, assistant@gmail.com";
```

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the ⚙ gear → **Web App**
3. Set:
   - **Execute as**: Me
   - **Who has access**: **Anyone** ← must be this exactly
4. Click **Deploy** → authorize all permissions when prompted (the script needs Gmail + Sheets access)
5. Copy the **Web App URL**

> ⚠️ Every time you change the script code, create a **New Deployment** — editing and saving alone does NOT update the live URL.

---

## Step 4 — Update .env

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_ID/exec
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

Restart `npm run dev` after saving.

---

## Step 5 — Test

Run this in your terminal (replace the URL):

```bash
curl "YOUR_SCRIPT_URL?action=createLead&sessionKey=TEST-001&name=Test+User&mobile=9999999999&profession=Tester&email=test@test.com&city=Mumbai&dob=2000-01-01&birthTime=14:30+(Exact)&birthPlace=Pune&issue1=Business+stagnation&issue2=Family+conflict&issue3=Lack+of+focus"
```

Expected response: `{"status":"ok","message":"Lead saved: TEST-001"}`

Check your:
1. **Google Sheet** — new row with all 15 columns filled, Payment Status = `Pending`
2. **Gmail inbox** — email with subject `🌟 New Lead: Test User — Energy Acharya Shilpa`

---

## Email Examples

### New Lead Email
```
Subject: 🌟 New Lead: Rahul Sharma — Energy Acharya Shilpa

New consultation enquiry received on 23/6/2026, 3:45:00 pm

━━━━━━━━━━━━━━━━━━━━━━━━
  PERSONAL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Name        : Rahul Sharma
Mobile      : 9876543210
Email       : rahul@example.com
Profession  : Business Owner
City        : Mumbai

━━━━━━━━━━━━━━━━━━━━━━━━
  BIRTH DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Date of Birth : 1985-04-15
Birth Time    : 06:30 (Exact)
Birth Place   : Jaipur, Rajasthan

━━━━━━━━━━━━━━━━━━━━━━━━
  CHALLENGES
━━━━━━━━━━━━━━━━━━━━━━━━
Issue 1 : Business revenue stagnant for 3 years
Issue 2 : Constant family disputes
Issue 3 : Unable to focus on decisions
```

### Payment Success Email
```
Subject: ✅ Payment Paid: Rahul Sharma — Energy Acharya Shilpa

Status         : Paid
Transaction ID : pay_PxYz1234abcd
Client Name    : Rahul Sharma
Mobile         : 9876543210
```

---

## Troubleshooting

### Not receiving emails
- Make sure `NOTIFICATION_EMAIL` has your correct Gmail address
- When deploying, authorize **all** permissions including Gmail (MailApp)
- Check Apps Script → **Executions** tab for any errors
- Gmail daily sending limit is 100 emails/day (free accounts) — sufficient for consultation leads

### `Cannot read properties of null (appendRow)`
Tab name mismatch. Check the tab name at the bottom of your sheet and update `SHEET_NAME`.

### 401 Unauthorized
"Who has access" must be **Anyone** (not "Anyone with Google account"). Create a new deployment.

### Payment status not updating
Check Apps Script → **Executions** for `"Session key not found"` errors. The `sessionKey` must match column B exactly.

---

## Column Reference

| Col | Header | Source |
|-----|--------|--------|
| A | Timestamp | Auto (IST) |
| B | Session Key | Frontend ID |
| C | Name | Form |
| D | Mobile | Form |
| E | Profession | Form |
| F | Email | Form |
| G | City | Form |
| H | DOB | Form |
| I | Birth Time | e.g. `14:30 (Exact)` or `Not Known` |
| J | Birth Place | Form |
| K | Issue 1 | Form |
| L | Issue 2 | Form |
| M | Issue 3 | Form |
| N | Payment Status | `Pending` → `Paid` / `Failed` |
| O | Transaction ID | Razorpay payment ID |

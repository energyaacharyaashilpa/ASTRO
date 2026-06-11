# Google Sheets Setup Guide

## Why GET and not POST?

Google Apps Script does not support CORS preflight (OPTIONS). Any `fetch()` with
`Content-Type: application/json` triggers a preflight → Google blocks it with 401.
Solution: **send data as GET query parameters** — no preflight, always works.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **New Spreadsheet**.
2. Name the spreadsheet (e.g. `Astro Vastu Leads`).
3. In **Row 1**, add these exact headers in order:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Session Key | Name | Mobile | Profession | Email | City | DOB | Birth Time | Birth Place | Issue 1 | Issue 2 | Issue 3 | Payment Status | Transaction ID |

> ⚠️ **15 columns total.** The script writes by column position, so the order must match exactly.

---

## Step 2 — Paste this Apps Script

1. Inside the sheet: **Extensions → Apps Script**.
2. **Delete all existing code** and paste:

```javascript
// ============================================================
//  Energy Acharya Shilpa — Google Apps Script Webhook
//  Uses doGet() — no CORS preflight, works from any browser.
//  Issues are split into 3 separate fields: issue1, issue2, issue3
// ============================================================

// ⚠️ Must match the TAB NAME at the bottom of your sheet exactly.
const SHEET_NAME = "Sheet1";

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

function doPost(e) { return doGet(e); }

// Safe sheet getter — falls back to first tab if name doesn't match
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function createLead(p) {
  const sheet = getSheet();
  sheet.appendRow([
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // A: Timestamp
    p.sessionKey  || "",  // B: Session Key
    p.name        || "",  // C: Name
    p.mobile      || "",  // D: Mobile
    p.profession  || "",  // E: Profession
    p.email       || "",  // F: Email
    p.city        || "",  // G: City
    p.dob         || "",  // H: DOB
    p.birthTime   || "",  // I: Birth Time
    p.birthPlace  || "",  // J: Birth Place
    p.issue1      || "",  // K: Issue 1
    p.issue2      || "",  // L: Issue 2
    p.issue3      || "",  // M: Issue 3
    "Pending",            // N: Payment Status
    "",                   // O: Transaction ID
  ]);
  return response("ok", "Lead saved: " + (p.sessionKey || "no-key"));
}

function updatePayment(p) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === p.sessionKey) {         // column B = Session Key
      sheet.getRange(i + 1, 14).setValue(p.status        || "Unknown"); // col N
      sheet.getRange(i + 1, 15).setValue(p.transactionId || "");        // col O
      return response("ok", "Payment updated: " + p.sessionKey);
    }
  }
  return response("error", "Session key not found: " + p.sessionKey);
}

function response(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, message }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S).

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New Deployment**.
2. Click ⚙ gear → **Web App**.
3. Set:
   - **Execute as**: Me
   - **Who has access**: **Anyone** ← not "Anyone with Google account"
4. Click **Deploy** → authorize → copy the Web App URL.

> ⚠️ You must create a **New Deployment** every time you change the script code.

---

## Step 4 — Update .env

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

Restart `npm run dev` after saving.

---

## Step 5 — Test

Run in your terminal (replace the URL):

```bash
curl "YOUR_SCRIPT_URL?action=createLead&sessionKey=TEST-001&name=Test&mobile=9999999999&profession=Dev&email=t@t.com&city=Mumbai&dob=2000-01-01&birthTime=12:00&birthPlace=Pune&issue1=Business+stagnation&issue2=Marriage+conflict&issue3=Lack+of+focus"
```

Expected: `{"status":"ok","message":"Lead saved: TEST-001"}`
Then check your sheet — a new row with 3 issue columns and `Payment Status = Pending`.

---

## Column Map

| Col | Header | Source |
|-----|--------|--------|
| A | Timestamp | Auto-generated |
| B | Session Key | Frontend generated ID |
| C | Name | Form field |
| D | Mobile | Form field |
| E | Profession | Form field |
| F | Email | Form field |
| G | City | Form field |
| H | DOB | Form field |
| I | Birth Time | Form field |
| J | Birth Place | Form field |
| K | Issue 1 | Form field (issue1) |
| L | Issue 2 | Form field (issue2) |
| M | Issue 3 | Form field (issue3) |
| N | Payment Status | Updated after Razorpay |
| O | Transaction ID | Updated after Razorpay |

---

## Troubleshooting

### `Cannot read properties of null (reading 'appendRow')`
Tab name doesn't match `SHEET_NAME`. Look at the tab at the bottom of your sheet and update the constant. Create a **New Deployment** after saving.

### 401 Unauthorized
"Who has access" is "Anyone with Google account" instead of "Anyone". Create a new deployment with the correct setting.

### Payment Status not updating
Check Apps Script → **Executions** for `"Session key not found"` errors. The sessionKey must match column B exactly.

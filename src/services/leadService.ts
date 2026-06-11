/**
 * leadService.ts
 *
 * Uses GET requests with URL params — CORS-safe with Google Apps Script.
 * Issues are split into three separate fields: issue1, issue2, issue3.
 */

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

export interface LeadPayload {
  name: string;
  mobile: string;
  profession: string;
  email: string;
  city: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  issue1: string;
  issue2: string;
  issue3: string;
}

export type PaymentStatus = "Paid" | "Failed";

// ---------------------------------------------------------------------------
// saveLead
// ---------------------------------------------------------------------------
export async function saveLead(payload: LeadPayload): Promise<string> {
  const sessionKey = _generateSessionKey();

  if (!GOOGLE_SCRIPT_URL) {
    console.log("[leadService] No webhook URL set. Mock lead:", { ...payload, sessionKey });
    return sessionKey;
  }

  const params = new URLSearchParams({
    action: "createLead",
    sessionKey,
    name: payload.name,
    mobile: payload.mobile,
    profession: payload.profession,
    email: payload.email,
    city: payload.city,
    dob: payload.dob,
    birthTime: payload.birthTime,
    birthPlace: payload.birthPlace,
    issue1: payload.issue1,
    issue2: payload.issue2,
    issue3: payload.issue3,
  });

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    console.log("[leadService] Lead dispatched. Session key:", sessionKey);
  } catch (err) {
    console.error("[leadService] Failed to send lead:", err);
  }

  return sessionKey;
}

// ---------------------------------------------------------------------------
// updatePaymentStatus
// ---------------------------------------------------------------------------
export async function updatePaymentStatus(
  sessionKey: string,
  status: PaymentStatus,
  transactionId: string
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    console.log("[leadService] Mock payment update:", { sessionKey, status, transactionId });
    return;
  }

  const params = new URLSearchParams({
    action: "updatePayment",
    sessionKey,
    status,
    transactionId,
  });

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    console.log("[leadService] Payment status update sent:", status);
  } catch (err) {
    console.error("[leadService] Failed to send payment update:", err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function _generateSessionKey(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LEAD-${ts}-${rand}`;
}

// Debug helper — paste in browser console:
// import('/src/services/leadService.ts').then(m => m.testSheetConnection())
export async function testSheetConnection(): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("[leadService] VITE_GOOGLE_SCRIPT_URL is not set in .env");
    return;
  }
  const testKey = "TEST-" + Date.now();
  const params = new URLSearchParams({
    action: "createLead",
    sessionKey: testKey,
    name: "TEST ENTRY", mobile: "9999999999", profession: "Tester",
    email: "test@test.com", city: "TestCity", dob: "2000-01-01",
    birthTime: "12:00", birthPlace: "TestPlace",
    issue1: "Test issue 1", issue2: "Test issue 2", issue3: "Test issue 3",
  });
  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, { method: "GET", mode: "no-cors" });
    console.log(`[leadService] ✅ Test sent! Look for Session Key: ${testKey} in your sheet.`);
  } catch (err) {
    console.error("[leadService] ❌ Test failed:", err);
  }
}

/**
 * paymentService.ts
 * Manages the full Razorpay checkout lifecycle:
 *   - Ensures the Razorpay SDK script is loaded (dynamic injection if needed)
 *   - Opens the checkout modal with correct options
 *   - Fires onSuccess / onDismiss callbacks
 *
 * The Razorpay checkout.js script is already added to index.html via a <script> tag,
 * but this service also handles dynamic loading as a safety fallback.
 */

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckoutPrefill {
  name: string;
  email: string;
  contact: string;
}

export interface CheckoutNotes {
  dob: string;
  birthTime: string;
}

export interface CheckoutOptions {
  amountInPaise: number;          // e.g. 499900 for ₹4,999
  description: string;
  prefill: CheckoutPrefill;
  notes: CheckoutNotes;
  onSuccess: (paymentId: string) => void;
  onDismiss: () => void;
}

export interface PaymentServiceResult {
  /** true  → Razorpay modal was opened successfully  */
  /** false → SDK not available / key missing; caller should show mock UI */
  launched: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Loads the Razorpay SDK (if not already present) and opens the checkout modal.
 * Returns { launched: true } when the modal opens, { launched: false } when
 * the SDK or key is unavailable so the caller can fall back to a mock UI.
 */
export async function openRazorpayCheckout(opts: CheckoutOptions): Promise<PaymentServiceResult> {
  // 1. Validate key
  if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === "YOUR_RAZORPAY_KEY_ID") {
    console.warn("[paymentService] VITE_RAZORPAY_KEY_ID is not set. Running in mock mode.");
    return { launched: false };
  }

  // 2. Ensure SDK is loaded
  try {
    await _ensureSdkLoaded();
  } catch {
    console.error("[paymentService] Failed to load Razorpay SDK.");
    return { launched: false };
  }

  // 3. Build options and open checkout
  try {
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: opts.amountInPaise,
      currency: "INR",
      name: "Energy Aacharyaa Shilpa Astro Vastu",
      description: opts.description,
      image: "https://i.imgur.com/n3ZDPsV.png", // Public logo URL — localhost paths can't be reached by Razorpay servers
      prefill: {
        name: opts.prefill.name,
        email: opts.prefill.email,
        contact: opts.prefill.contact,
      },
      notes: {
        dob: opts.notes.dob,
        birthTime: opts.notes.birthTime,
      },
      theme: {
        color: "#C5A870",
      },
      handler(response: { razorpay_payment_id: string }) {
        opts.onSuccess(response.razorpay_payment_id);
      },
      modal: {
        ondismiss() {
          opts.onDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();
    return { launched: true };
  } catch (err) {
    console.error("[paymentService] Razorpay instance error:", err);
    return { launched: false };
  }
}

/**
 * Generates a mock transaction ID for sandbox / development use.
 */
export function generateMockTransactionId(): string {
  return "pay_mock_" + Math.random().toString(36).substring(2, 11);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Ensures the Razorpay checkout script is present in the DOM.
 * The script is already in index.html, but this acts as a safety net
 * in case it was blocked or stripped by a build step.
 */
function _ensureSdkLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (typeof window.Razorpay === "function") {
      resolve();
      return;
    }

    // Check if the script tag already exists (added via index.html)
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existing) {
      // Script tag present but not yet executed — wait for it
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed to load"))
      );
      return;
    }

    // Dynamically inject as a last resort
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script failed to load"));
    document.head.appendChild(script);
  });
}

// Extend Window type (kept here so it's co-located with usage)
declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void };
  }
}

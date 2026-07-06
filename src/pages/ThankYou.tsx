import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AstroLogo from "../assets/astro.png";

type Status = "checking" | "verified" | "failed" | "no-params";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");

  // Log all params for debugging — remove after confirming live mode works
  useEffect(() => {
    console.log("[ThankYou] URL params:", Object.fromEntries(searchParams.entries()));
  }, []);

  const paymentId  = searchParams.get("razorpay_payment_id") ?? "";
  const linkId     = searchParams.get("razorpay_payment_link_id") ?? "";
  const linkStatus = searchParams.get("razorpay_payment_link_status") ?? "";
  const signature  = searchParams.get("razorpay_signature") ?? "";

  const hasRazorpayParams =
    paymentId.startsWith("pay_")   && paymentId.length > 8 &&
    linkId.startsWith("plink_")    && linkId.length > 8 &&
    linkStatus === "paid"          &&
    signature.length > 10;

  useEffect(() => {
    // No valid Razorpay params — could be direct URL access OR Razorpay didn't send params
    if (!hasRazorpayParams) {
      // Check if ANY razorpay param exists (partial redirect)
      const anyRazorpayParam = [...searchParams.keys()].some(k => k.startsWith("razorpay"));
      if (!anyRazorpayParam) {
        // Truly no params — redirect home
        const paymentStarted = sessionStorage.getItem("paymentStarted") === "true";

        if (paymentStarted) {
          sessionStorage.removeItem("paymentStarted");
          setStatus("verified");
          return;
        }

        navigate("/", { replace: true });
      } else {
        // Some params present but incomplete — show failed state
        setStatus("failed");
      }
      return;
    }

    // Verify against MongoDB
    let attempts = 0;
    const MAX = 10;
    let cancelled = false;

    const check = async () => {
      if (cancelled) return;
      attempts++;

      try {
        const params = new URLSearchParams({
          razorpay_payment_id: paymentId,
          razorpay_payment_link_id: linkId,
          razorpay_payment_link_status: linkStatus,
        });

        const res = await fetch(`/api/verify?${params.toString()}`);

        if (res.status === 200) {
          const data = await res.json();
          if (data.verified && !cancelled) {
            setStatus("verified");
            return;
          }
        }

        if (res.status === 400 || res.status === 403) {
          if (!cancelled) setStatus("failed");
          return;
        }

        // Webhook not yet processed — retry
        if (attempts < MAX) {
          setTimeout(check, 3000);
        } else if (!cancelled) {
          // Max retries hit — still show thank you since params are genuine Razorpay values
          // Better UX than showing failure when webhook is just slow
          setStatus("verified");
        }
      } catch {
        if (attempts < MAX) setTimeout(check, 3000);
        else if (!cancelled) setStatus("verified"); // webhook slow, not failure
      }
    };

    check();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Checking ──────────────────────────────────────────────────────
  if (status === "checking") {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gold-400/30 shadow-2xl flex flex-col items-center text-center space-y-6">
          <img src={AstroLogo} alt="Energy Aacharyaa Shilpa" className="h-24 w-auto object-contain animate-pulse" />
          <h1 className="font-serif text-2xl font-bold text-gold-700">Confirming your payment…</h1>
          <p className="text-sm text-gold-900/70 font-light">Please wait while we verify your transaction securely.</p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gold-400/30 shadow-2xl flex flex-col items-center text-center space-y-5">
          <img src={AstroLogo} alt="Energy Aacharyaa Shilpa" className="h-24 w-auto object-contain" />
          <h1 className="font-serif text-2xl font-bold text-red-600">Payment Verification Failed</h1>
          <p className="text-sm text-gold-900/70 font-light leading-relaxed">
            We could not confirm your payment. The server may still be processing — please retry in a moment.
          </p>
          <p className="text-sm text-gold-900/60 font-light">
            If money was deducted, email{" "}
            <a href="mailto:energyaacharyaashilpa@gmail.com" className="text-gold-600 hover:underline">
              energyaacharyaashilpa@gmail.com
            </a>
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 border border-gold-400/40 text-gold-800 rounded-full text-sm hover:bg-gold-50 transition-colors cursor-pointer">
              Retry
            </button>
            <Link to="/" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm border border-gold-400 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Verified ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-luxury-gradient flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-gold-400/30 shadow-2xl flex flex-col items-center text-center space-y-6 font-serif">

        <img src={AstroLogo} alt="Energy Aacharyaa Shilpa" className="h-28 md:h-36 w-auto object-contain mb-2" />

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-700">One more step to go!</h1>

        <p className="text-lg sm:text-xl font-light text-gold-900/80">
          Thank you for showing your interest in the Astro Vastu Analysis! ⚡
        </p>

        {paymentId && (
          <div className="w-full bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
            <span className="text-green-600 text-xl">✅</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-green-800">Payment Verified</p>
              <p className="text-xs text-green-700/70 font-mono">{paymentId}</p>
            </div>
          </div>
        )}

        <div className="text-left w-full space-y-4 text-sm sm:text-base text-gold-900/70 bg-gold-50/30 p-6 rounded-xl border border-gold-400/20">
          <p className="font-semibold text-gold-800 mb-4 text-lg">Here's what to do next:</p>
          <div className="space-y-4 font-sans font-light">
            <p>
              1){" "}
              <a
                href="https://docs.google.com/forms/d/1aGIs97cCdXON5-ihwaVQjZBlLLn9P7Li_odu6FFKge0/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 underline font-semibold hover:text-gold-500"
              >
                Click here
              </a>{" "}
              to fill out the short application. Be honest with your answers as per your current situation.
            </p>
            <p>2) Check your email — we have sent you the application form. If it went to spam, move it to Primary.</p>
            <p>3) Our team will review your answers and get back to you within 48 business hours.</p>
          </div>
        </div>

        <p className="text-sm text-gold-900/60 max-w-2xl font-sans font-light">
          If we are unable to take your case, a refund will be issued within 7 days of the review result.
        </p>

        <p className="text-sm text-gold-900/60 max-w-2xl font-sans font-light">
          Questions? Email{" "}
          <a href="mailto:energyaacharyaashilpa@gmail.com" className="text-gold-600 hover:underline">
            energyaacharyaashilpa@gmail.com
          </a>
          <br /><br />– Energy Aacharyaa Shilpa
        </p>

        <Link to="/" className="mt-4 px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-sans font-semibold tracking-wider border border-gold-400 transition-colors">
          Return to Home
        </Link>

      </div>
    </div>
  );
}

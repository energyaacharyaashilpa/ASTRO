import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Calendar, Clock, MapPin, User,
  Mail, Phone, Briefcase, FileText,
  CheckCircle2, AlertCircle, X, ArrowRight,
  HelpCircle, Plus, Minus,
} from "lucide-react";

import { saveLead, updatePaymentStatus } from "../services/leadService";
import { openRazorpayCheckout, generateMockTransactionId } from "../services/paymentService";
import { reviews, TestimonialCard } from "../components/Testimonials";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FormData {
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

const EMPTY_FORM: FormData = {
  name: "", mobile: "", profession: "", email: "",
  city: "", dob: "", birthTime: "", birthPlace: "",
  issue1: "", issue2: "", issue3: "",
};

const faqs = [
  {
    q: "Do your remedies require structural demolition or breaking walls?",
    a: "Absolutely not. We have a strict 'Zero Demolition' policy. Our Astro Vastu remedies are non-destructive and utilize scientific elements: elemental metal strips (copper, brass, lead, iron), color spectrum therapy, precise object relocation, and planetary crystals to re-tune your home's frequency.",
  },
  {
    q: "How does Astro Vastu differ from standard Vastu Shastra?",
    a: "Standard Vastu applies generalized rules (e.g., 'North is always positive for wealth'). Astro Vastu is highly personalized. If your birth chart (Kundli) shows Mercury is in your 12th house (expenditures), activating the North (governed by Mercury) without chart alignment can actually double your losses. We match your home layout specifically to your horoscope.",
  },
  {
    q: "What birth details are required for the consultation?",
    a: "To construct your cosmic chart, we require your Full Name, Date of Birth, Time of Birth, and Place of Birth. You will also need to submit a rough sketch/layout map of your house or office, showing the directions.",
  },
  {
    q: "How soon can I expect to notice changes?",
    a: "Most clients report an immediate shift in the house's atmosphere (feelings of lightness, less stress) within 7–10 days. Physical breakthroughs in career, court cases, cash blockages, or relationship harmony typically manifest between 21 to 45 days after completing the remedies.",
  },
  {
    q: "Does Astro Vastu work for rented apartments or offices?",
    a: "Yes. Vastu energy affects whoever occupies the space, regardless of ownership. Since our remedies involve simple color adjustments, metal wires, or placing objects, they are completely portable and easy to implement in rented properties without modifying the landlord's structure.",
  },
];

// Shared input class
const inputCls = "w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light";
const labelCls = "text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Join() {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [sessionKey, setSessionKey] = useState<string>("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showMockPaymentDialog, setShowMockPaymentDialog] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({ id: "", amount: "₹4,999" });

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Capturing cosmic details...");

    const key = await saveLead(formData);
    setSessionKey(key);
    setStatusMessage("Opening Razorpay Checkout...");

    const result = await openRazorpayCheckout({
      amountInPaise: 499900,
      description: "Premium Consultation & Remedies Blueprint",
      prefill: { name: formData.name, email: formData.email, contact: formData.mobile },
      notes: { dob: formData.dob, birthTime: formData.birthTime },
      onSuccess: async (paymentId) => {
        setTransactionDetails({ id: paymentId, amount: "₹4,999" });
        await updatePaymentStatus(key, "Paid", paymentId);
        setShowSuccessModal(true);
      },
      onDismiss: async () => {
        await updatePaymentStatus(key, "Failed", "");
        setShowFailedModal(true);
      },
    });

    setLoading(false);
    setStatusMessage("");
    if (!result.launched) setShowMockPaymentDialog(true);
  };

  const handleMockPaymentResult = async (status: "Paid" | "Failed") => {
    setShowMockPaymentDialog(false);
    const mockTxId = status === "Paid" ? generateMockTransactionId() : "";
    setTransactionDetails({ id: mockTxId, amount: "₹4,999" });
    if (sessionKey) await updatePaymentStatus(sessionKey, status, mockTxId);
    if (status === "Paid") setShowSuccessModal(true);
    else setShowFailedModal(true);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="relative bg-luxury-gradient overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — VIDEO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative rings */}
        <div className="absolute top-[10%] left-[-5%] w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none animate-pulse" />

        <div className="max-w-4xl w-full mx-auto space-y-10 relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-4"
          >
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
              Claim Your Astro Vastu Consultation
            </h1>
            <p className="text-sm text-gold-900/60 max-w-xl mx-auto font-light">
              Watch how your birth chart and living space are silently working against each other —
              and how Energy Acharya Shilpa fixes it without breaking a single wall.
            </p>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-3xl overflow-hidden border border-gold-400/30 shadow-2xl glass-panel p-2 sm:p-4 bg-white"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <video
                src="/a.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="text-center pt-3 pb-1">
              <p className="text-xs text-gold-800 font-medium tracking-wide">
                WATCH: How standard Vastu remedies might conflict with your Horoscope (10 Mins)
              </p>
            </div>
          </motion.div>

          {/* CTA below video */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center space-y-3"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_10px_30px_rgba(197,145,84,0.35)] hover:shadow-[0_12px_36px_rgba(197,145,84,0.5)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group cursor-pointer"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — CONSULTATION FORM (MOVED HERE)
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={formRef}
        className="py-24 bg-white relative overflow-hidden border-t border-gold-subtle/30 scroll-mt-20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-50/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 mb-12"
          >
            
            <h2 className="font-serif text-3xl sm:text-4xl text-gold-900 leading-tight">
              Personal Birth Chart & House Coordinates
            </h2>
            <p className="text-sm text-gold-900/60 max-w-xl mx-auto font-light">
              Accuracy in birth time and place is critical for mapping planetary coordinates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 sm:p-10 rounded-3xl border border-gold-400/25 glass-card bg-white shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ── Personal Details ── */}
              <div>
                <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-5">
                  Personal Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <User className="w-3.5 h-3.5 text-gold-500" /> Full Name
                    </label>
                    <input type="text" name="name" required placeholder="e.g. Shruti Keshav"
                      value={formData.name} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <Phone className="w-3.5 h-3.5 text-gold-500" /> Mobile (WhatsApp)
                    </label>
                    <input type="tel" name="mobile" required placeholder="e.g. +91 98765 43210"
                      value={formData.mobile} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <Briefcase className="w-3.5 h-3.5 text-gold-500" /> Profession
                    </label>
                    <input type="text" name="profession" required placeholder="e.g. Business Owner"
                      value={formData.profession} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <Mail className="w-3.5 h-3.5 text-gold-500" /> Email Address
                    </label>
                    <input type="email" name="email" required placeholder="e.g. you@example.com"
                      value={formData.email} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className={labelCls}>
                      <MapPin className="w-3.5 h-3.5 text-gold-500" /> Current City of Residence
                    </label>
                    <input type="text" name="city" required placeholder="e.g. Mumbai"
                      value={formData.city} onChange={handleChange} className={inputCls} />
                  </div>

                </div>
              </div>

              <div className="gold-divider" />

              {/* ── Birth Details ── */}
              <div>
                <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-5">
                  Birth Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <Calendar className="w-3.5 h-3.5 text-gold-500" /> Date of Birth
                    </label>
                    <input type="date" name="dob" required
                      value={formData.dob} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <Clock className="w-3.5 h-3.5 text-gold-500" /> Time of Birth (Exact)
                    </label>
                    <input type="time" name="birthTime" required
                      value={formData.birthTime} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className={labelCls}>
                      <MapPin className="w-3.5 h-3.5 text-gold-500" /> Place of Birth (City, State)
                    </label>
                    <input type="text" name="birthPlace" required placeholder="e.g. Pune, Maharashtra"
                      value={formData.birthPlace} onChange={handleChange} className={inputCls} />
                  </div>

                </div>
              </div>

              <div className="gold-divider" />

              {/* ── 3 Issues ── */}
              <div>
                <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-1">
                  Your Top 3 Challenges
                </p>
                <p className="text-xs text-gold-900/50 font-light mb-5">
                  Describe each blockage in one line so Energy Acharya Shilpa can map them to your chart.
                </p>
                <div className="space-y-4">

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <FileText className="w-3.5 h-3.5 text-gold-500" />
                      Issue 1
                    </label>
                    <input type="text" name="issue1" required
                      placeholder="e.g. Stagnant business revenue for 2 years"
                      value={formData.issue1} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <FileText className="w-3.5 h-3.5 text-gold-500" />
                      Issue 2
                    </label>
                    <input type="text" name="issue2" required
                      placeholder="e.g. Chronic arguments with spouse / family"
                      value={formData.issue2} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>
                      <FileText className="w-3.5 h-3.5 text-gold-500" />
                      Issue 3
                    </label>
                    <input type="text" name="issue3" required
                      placeholder="e.g. Severe lack of clarity and focus"
                      value={formData.issue3} onChange={handleChange} className={inputCls} />
                  </div>

                </div>
              </div>

             

              {/* ── Pricing ── */}
            

              {/* ── Submit ── */}
              <div className="pt-2 space-y-3">
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-sm uppercase shadow-[0_10px_25px_rgba(197,145,84,0.3)] hover:shadow-[0_12px_30px_rgba(197,145,84,0.45)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border border-gold-400 cursor-pointer hover:scale-[1.01]">
                  {loading ? statusMessage : "Join Now"}
                </button>
                
              </div>

            </form>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gold-50/10 relative overflow-hidden border-t border-gold-subtle/30">
        <div className="absolute top-10 left-10 w-48 h-48 border border-gold-300/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-64 h-64 border border-gold-300/10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
              <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
                Proven Transformations
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
              Real Clients. Measurable Miracles.
            </h2>
            <p className="text-sm sm:text-base text-gold-900/60 font-light max-w-2xl mx-auto">
              Read how correcting directional flaws and aligning them with individual charts created immediate breakthroughs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <TestimonialCard key={idx} rev={rev} idx={idx} animate={true} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_8px_24px_rgba(197,145,84,0.3)] hover:shadow-[0_10px_30px_rgba(197,145,84,0.45)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group cursor-pointer"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gold-subtle/30">
        <div className="absolute left-[-10%] top-[30%] w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />
        <div className="absolute right-[-10%] bottom-[20%] w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
              <HelpCircle className="w-4 h-4 text-gold-500" />
              <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
                Got Questions?
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gold-900/60 font-light">
              Everything you need to know about the science of Astro Vastu and the consultation process.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-gold-400/15 rounded-2xl overflow-hidden hover:border-gold-400/35 shadow-sm transition-colors duration-300">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-serif text-base sm:text-lg font-medium text-gold-900 pr-2">{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                      {isOpen
                        ? <Minus className="w-4 h-4 text-gold-600" />
                        : <Plus className="w-4 h-4 text-gold-600" />
                      }
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed border-t border-gold-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            
          </motion.div>

        </div>
      </section>

      {/* ================================================================
          MODALS
      ================================================================ */}
      <AnimatePresence>

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/30 text-center space-y-6 shadow-2xl">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-50 border border-green-400/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-gold-900">Alignment Initiated!</h3>
                <p className="text-sm text-gold-900/70 font-light leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your payment of <strong>{transactionDetails.amount}</strong> is verified and your slot is confirmed.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gold-50/40 border border-gold-400/10 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Transaction ID:</span>
                  <span className="font-mono text-gold-900 font-semibold">{transactionDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Status:</span>
                  <span className="font-semibold text-green-700">Paid ✓</span>
                </div>
              </div>
              <p className="text-[11px] text-gold-900/50 leading-relaxed font-light">
                Our team will email a consultation confirmation and house layout request within 15 minutes.
              </p>
              <button onClick={() => { setShowSuccessModal(false); window.location.href = "/"; }}
                className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-colors border border-gold-400 cursor-pointer">
                Return to Home
              </button>
            </motion.div>
          </div>
        )}

        {showFailedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/30 text-center space-y-6 shadow-2xl relative">
              <button onClick={() => setShowFailedModal(false)} className="absolute top-4 right-4 text-gold-900/50 hover:text-gold-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div className="mx-auto w-16 h-16 rounded-full bg-red-50 border border-red-400/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-red-900">Payment Unsuccessful</h3>
                <p className="text-sm text-gold-900/70 font-light">The payment was cancelled or failed to process.</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50/10 border border-red-400/10 text-xs text-left space-y-2">
                <p className="text-red-800/80 font-medium">Your details are already saved. No need to re-enter them.</p>
                <div className="flex justify-between border-t border-red-100/30 pt-2">
                  <span className="text-gold-900/50">Status:</span>
                  <span className="font-semibold text-red-600">Pending Payment</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowFailedModal(false)}
                  className="flex-1 py-3 bg-gold-50 border border-gold-400/30 hover:bg-gold-100/40 text-gold-900 rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer">
                  Retry
                </button>
                <button onClick={() => { setShowFailedModal(false); window.location.href = "/"; }}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-xs font-bold tracking-widest uppercase border border-gold-400 cursor-pointer">
                  Home
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showMockPaymentDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/40 text-center space-y-6 shadow-2xl">
              <div className="flex justify-center items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
                <span className="font-serif text-lg font-bold uppercase tracking-wider text-gold-900">Razorpay Sandbox</span>
              </div>
              <div className="gold-divider" />
              <div className="bg-gold-50/50 p-4 rounded-xl border border-gold-400/10 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Consultant:</span>
                  <span className="font-semibold text-gold-900">Energy Acharya Shilpa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Client:</span>
                  <span className="font-semibold text-gold-900">{formData.name}</span>
                </div>
               
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleMockPaymentResult("Paid")}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-md cursor-pointer">
                  Simulate Success
                </button>
                <button onClick={() => handleMockPaymentResult("Failed")}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-md cursor-pointer">
                  Simulate Failure
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

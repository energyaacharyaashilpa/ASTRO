import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import heroImg from "../assets/heroimg.png";

export default function Hero() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert data to URL parameters so it works perfectly with Google Apps Script (no-cors mode)
    const formBody = new URLSearchParams();
    formBody.append("name", formData.name);
    formBody.append("email", formData.email);
    formBody.append("phone", formData.phone);

    // TODO: Replace this URL with your published Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwle0O4BkR0VU5ZxpXmo7T5m3-qIYYZuPHpY1cbFwL8xgNd9mOhZUX9AgrPM-__yvB76Q/exec";

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formBody
    }).then(() => {
      // Proceed to join page after sending
      navigate("/join");
    }).catch((err) => {
      console.error(err);
      navigate("/join"); // Proceed anyway even if it fails
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const renderForm = () => (
    <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gold-400/30 w-full max-w-sm shadow-xl mb-8 ml-2 sm:ml-6 md:ml-12 lg:ml-16 xl:ml-20">
      <p className="text-[11px] font-bold text-gold-600 uppercase tracking-widest mb-4 text-center">
        Book Your Session Now
      </p>
      <form onSubmit={handleHeroSubmit} className="flex flex-col gap-4">
        <input
          type="text" name="name" placeholder="Name" required
          className="w-full px-4 py-3 rounded-xl bg-gold-50/10 border border-gold-400/20 text-gold-950 focus:outline-none focus:ring-1 focus:ring-gold-400 text-sm font-light"
          value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email" name="email" placeholder="Email Address" required
          className="w-full px-4 py-3 rounded-xl bg-gold-50/10 border border-gold-400/20 text-gold-950 focus:outline-none focus:ring-1 focus:ring-gold-400 text-sm font-light"
          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel" name="phone" placeholder="Phone" required
          className="w-full px-4 py-3 rounded-xl bg-gold-50/10 border border-gold-400/20 text-gold-950 focus:outline-none focus:ring-1 focus:ring-gold-400 text-sm font-light"
          value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-4 bg-gold-500 text-white font-bold tracking-widest uppercase text-xs rounded-full shadow-[0_8px_20px_rgba(197,145,84,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-gold-400 hover:bg-gold-600 cursor-pointer disabled:opacity-70 disabled:cursor-wait flex justify-center"
        >
          {isSubmitting ? "Processing..." : "Join Now"}
        </button>
      </form>
    </div>
  );
  return (
    <section className="relative bg-luxury-gradient overflow-hidden mt-28 lg:mt-0">

      {/* ─── MOBILE layout: stacked (img on top, text below) ─── */}
      <div className="lg:hidden flex flex-col min-h-screen">

        {/* Image — top half, natural flow */}
        <div className="relative w-full" style={{ height: "55vw", minHeight: "260px", maxHeight: "420px" }}>
          <img
            src={heroImg}
            alt="Astro Vastu"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* bottom fade to blend into bg */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: "linear-gradient(to top, var(--luxury-bg, #F5F0E8), transparent)" }}
          />
        </div>

        {/* Text and Form — below image */}
        <div className="flex-1 flex flex-col justify-start px-6 pt-6 pb-16">
          <div className="flex flex-col items-center sm:items-start">
            {renderForm()}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-gold-900 leading-[1.15] tracking-wide mb-4">
            Practical and <span className="text-gold-gradient font-medium">Scientific Astrology &amp; Vastu</span> Guidance for Business, Career and Balanced Living.
          </h1>

          <p className="text-sm text-gold-900/65 font-light leading-relaxed mb-10">
            Synthesize your birth chart with your living space to invite
            Venusian wealth, stable relationships, and rapid career growth.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-gold-400/20 pt-6">
            {[
              { val: "10k+", label: "Lives Aligned" },
              { val: "15+", label: "Years Exp." },
              { val: "99.4%", label: "Success Rate" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-xl font-serif font-semibold text-gold-800">{val}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-gold-900/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP layout: side by side ─── */}
      <div className="hidden lg:flex min-h-screen mt-5">

        {/* Left text panel */}
        <div className="relative z-10 flex flex-col justify-center w-[50%] xl:w-[48%] px-12 xl:px-20 2xl:px-28 pt-36 pb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-row items-center gap-3"
          >
            {renderForm()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl xl:text-[2.8rem] text-gold-900 leading-[1.15] tracking-wide mb-6 mt-4"
          >
            Practical and <span className="text-gold-gradient font-medium">Scientific Astrology &amp; Vastu</span> Guidance for Business, Career and Balanced Living.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-gold-900/65 font-light leading-relaxed max-w-md mb-8"
          >
            Synthesize your birth chart with your living space to invite
            Venusian wealth, stable relationships, and rapid career growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-lg border-t border-gold-400/20 pt-8"
          >
            {[
              { val: "10k+", label: "Lives Aligned" },
              { val: "15+", label: "Years Experience" },
              { val: "99.4%", label: "Success Rate" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-gold-800">{val}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-900/60">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right image panel — starts below navbar (h-28 = 112px) */}
        <div className="absolute right-0 w-[52%]" style={{ top: "112px", bottom: 0 }}>
          {/* Left edge fade */}
          <div
            className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--luxury-bg, #F5F0E8), transparent)" }}
          />

          {/* Astral rings */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <svg viewBox="0 0 700 700" className="absolute w-full h-full text-gold-400/[0.07]" fill="none" stroke="currentColor" strokeWidth="0.75">
              <circle cx="350" cy="350" r="320" />
              <circle cx="350" cy="350" r="260" strokeDasharray="4,4" />
              <circle cx="350" cy="350" r="200" />
              <line x1="350" y1="30" x2="350" y2="670" />
              <line x1="30" y1="350" x2="670" y2="350" />
              <line x1="124" y1="124" x2="576" y2="576" />
              <line x1="124" y1="576" x2="576" y2="124" />
            </svg>
          </div>

          <motion.img
            src={heroImg}
            alt="Astro Vastu"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />



          <div className="absolute top-[22%] right-[15%] w-2 h-2 rounded-full bg-gold-400 opacity-50 animate-pulse z-30 pointer-events-none" />
          <div className="absolute bottom-[35%] right-[8%] w-1.5 h-1.5 rounded-full bg-gold-500 opacity-40 animate-ping z-30 pointer-events-none" />
        </div>
      </div>

    </section>
  );
}
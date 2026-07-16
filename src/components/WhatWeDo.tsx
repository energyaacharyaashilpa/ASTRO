import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="pt-12 pb-24 md:py-24 bg-white relative overflow-hidden scroll-mt-10">
      {/* Decorative Astrological Grid Art */}
      <div className="absolute right-[-10%] top-1/4 w-[500px] h-[500px] opacity-[0.03] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1">
          <circle cx="50" cy="50" r="45" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
        </svg>
      </div>
      <div className="absolute left-[-5%] bottom-10 w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column - Heading, Subtitle and Core Mechanism Statement */}
          <div className="lg:col-span-6 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 flex flex-col items-center lg:items-start w-full"
            >
              <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
                <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
                  What We Do
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gold-900 leading-tight">
                Astro Vastu Alchemy
              </h2>
              <div className="border-l-0 lg:border-l-2 border-gold-400 lg:pl-4 pl-0">
                <p className="font-serif text-xl sm:text-2xl text-gold-700 italic">
                  The Core Mechanism
                </p>
              </div>
            </motion.div>

            {/* Core Mechanism Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="p-8 rounded-3xl bg-gold-50/30 border border-gold-400/20 shadow-sm relative overflow-hidden glass-card w-full"
            >
              {/* Decorative quotation mark decoration */}
              <span className="absolute -top-6 -left-2 text-[180px] font-serif text-gold-200/20 pointer-events-none select-none">“</span>

              <blockquote className="font-serif text-xl sm:text-2xl text-gold-900 leading-relaxed relative z-10 italic">
                "Your home or Business is the 3D projection of your 2D birth chart."
              </blockquote>
            </motion.div>
          </div>

          {/* Right Column - Elaborated Mechanisms */}
          <div className="lg:col-span-6 space-y-6 flex flex-col items-center lg:items-stretch text-center lg:text-left w-full">
            {/* Mechanism 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-2xl border border-gold-400/15 bg-white/50 backdrop-blur-sm shadow-sm space-y-3 hover:border-gold-400/35 transition-colors duration-300 flex flex-col items-center lg:items-start w-full"
            >
              <h3 className="text-sm sm:text-base font-bold text-gold-700 uppercase tracking-widest">
                Scientific Alignment
              </h3>
              <p className="text-base sm:text-lg text-gold-900/85 font-normal leading-relaxed">
                This is the application of constructive interference in physics. When the spatial geometry of a building (Vastu) is synchronized with the quantitative metrics of the entrepreneur (Numerology), it removes subconscious friction. We align the <span className="font-medium text-gold-950">"hardware"</span> (your physical building) with the <span className="font-medium text-gold-950">"software"</span> (your operational mindset) to create an environment engineered for peak efficiency and measurable success.
              </p>
            </motion.div>

            {/* Mechanism 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 sm:p-8 rounded-2xl border border-gold-400/15 bg-white/50 backdrop-blur-sm shadow-sm space-y-3 hover:border-gold-400/35 transition-colors duration-300 flex flex-col items-center lg:items-start w-full"
            >
              <h3 className="text-sm sm:text-base font-bold text-gold-700 uppercase tracking-widest">
                High-Performance Environments
              </h3>
              <p className="text-base sm:text-lg text-gold-900/85 font-normal leading-relaxed">
                We engineer high-performance environments. Through Astro Vastu Alchemy, we translate your personal data markers into spatial geometry, aligning your home and workspace to eliminate environmental friction, optimize cognitive focus, and accelerate business growth.
              </p>
            </motion.div>
          </div>

        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/#lead-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_8px_24px_rgba(197,145,84,0.3)] hover:shadow-[0_10px_30px_rgba(197,145,84,0.45)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group"
          >
            <span>Enquiry Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

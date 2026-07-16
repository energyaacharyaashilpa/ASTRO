import { motion } from "framer-motion";
import { Sun, Moon, Compass, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyVastu() {
  return (
    <section id="why-vastu" className="py-24 bg-gold-50/20 relative overflow-hidden border-y border-gold-subtle/30 scroll-mt-20">
      {/* Astrological compass background line art */}
      <div className="absolute left-[-15%] top-[-10%] w-[500px] h-[500px] opacity-[0.05] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
            <Compass className="w-4 h-4 text-gold-500" />
            <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
              The Cosmic Synthesis
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            The Science: Why Astro Vastu Succeeds Where Others Fail
          </h2>
          <p className="text-sm sm:text-base text-gold-900/60 font-light max-w-2xl mx-auto">
            Traditional Vastu uses generalized rules for everyone. Astro Vastu customize adjustments specifically to your unique horoscope (Kundli).
          </p>
        </div>

        {/* Synthesis Core Diagram / Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left panel: Astrology */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-2xl border border-gold-400/10 shadow-sm space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-50/50">
                  <Sun className="w-4 h-4 text-gold-500" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-gold-900">1. Your Astrology (Kundli)</h3>
              </div>
              <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                Determines the cosmic blueprint at the exact moment of your birth. It reveals your planetary strengths, weaknesses, dasha timelines, and your individual purpose.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gold-400/10 shadow-sm space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-50/50">
                  <Moon className="w-4 h-4 text-gold-500" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-gold-900">2. Your Space (Vastu)</h3>
              </div>
              <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                Dictates the energy flow of your physical environment. Vastu channels elemental energies (Water, Air, Fire, Earth, Space) to either support or drain your body's energy grid.
              </p>
            </motion.div>
          </div>

          {/* Center: The Synthesis Connection */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-gold-400/20 shadow-xl relative order-1 lg:order-2">
            <div className="absolute -top-6 bg-gold-500 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-gold-400 shadow-md">
              The Intersection
            </div>

            {/* <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80 }}
              className="w-24 h-24 rounded-full bg-gold-50 border border-gold-400/30 flex items-center justify-center mb-6 relative"
            >
              <Sparkles className="w-10 h-10 text-gold-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-gold-400/10 animate-spin-slow scale-125" />
            </motion.div> */}

            <h3 className="font-serif text-2xl font-medium text-gold-900 mb-3">
              Astro Vastu Alchemy
            </h3>

            <p className="text-xs sm:text-sm text-gold-900/80 font-light leading-relaxed mb-4">
              Your home is the 3D projection of your 2D birth chart. If your Saturn is afflicted, its corresponding direction in your house will show physical flaws.
            </p>

            <div className="inline-block bg-gold-50/70 border border-gold-400/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold-600 uppercase tracking-widest">
              Personalized Alignment
            </div>
          </div>

          {/* Right panel: Why it works */}
          <div className="lg:col-span-4 space-y-8 order-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-2xl border border-gold-400/10 shadow-sm space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-50/50">
                  <span className="font-serif text-gold-500 text-sm font-bold">3</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gold-900">Customized Remedies</h3>
              </div>
              <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                Standard Vastu might say "put a water fountain in the North". But if your North direction contains an afflicted Mercury, water might aggravate career problems. We customize every placement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gold-400/10 shadow-sm space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-50/50">
                  <span className="font-serif text-gold-500 text-sm font-bold">4</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gold-900">No Demolitions Required</h3>
              </div>
              <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                Forget breaking walls or expensive renovations. Astro Vastu works using color therapy, elemental objects, metals, and planetary placement shifts to balance energy without structural damage.
              </p>
            </motion.div>
          </div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Ready to experience the Astro Vastu difference for yourself?
          </p>
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

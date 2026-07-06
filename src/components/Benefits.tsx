/**
 * @deprecated This component is no longer used in the application.
 * It has been replaced by the Consultation Process component (Process.tsx).
 */
import { motion } from "framer-motion";
import { TrendingUp, Award, HeartHandshake, ShieldCheck, SunDim, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Benefits() {
  const benefitsList = [
    {
      icon: <TrendingUp className="w-5 h-5 text-gold-500" />,
      title: "Wealth & Cash Flow Activation",
      description: "Remove directional obstacles in the North and Southeast zones to unlock stuck funds, generate multiple streams of passive income, and welcome financial abundance."
    },
    {
      icon: <Award className="w-5 h-5 text-gold-500" />,
      title: "Rapid Career & Leadership Growth",
      description: "Align your space with your career planet (e.g., Sun or Jupiter) to gain executive recognition, defeat toxic office politics, and secure high-paying roles."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-gold-500" />,
      title: "Deep Harmony in Relationships",
      description: "Balance the Earth element in the Southwest zone of your home to resolve marital friction, attract your ideal life partner, and restore family peace."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-500" />,
      title: "Enhanced Immunity & Vitality",
      description: "Cleanse the North-Northeast zone to boost cellular immunity, eliminate unexplained chronic lethargy, and experience vibrant physical health."
    },
    {
      icon: <SunDim className="w-5 h-5 text-gold-500" />,
      title: "Mental Peace & Clear Focus",
      description: "Correct the East zone to connect with the right social network and quieten racing thoughts, allowing you to make high-impact decisions with ease."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      {/* Decorative astrological circle background */}
      <div className="absolute right-[-10%] top-10 w-80 h-80 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute left-[-10%] bottom-10 w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
            {/* <Sparkles className="w-4 h-4 text-gold-500" /> */}
            <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
              The Transformation
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            How Astro Vastu Transforms Your Reality
          </h2>
          <p className="text-sm sm:text-base text-gold-900/60 font-light max-w-2xl mx-auto">
            By harmonizing the physical space of your home with the planetary layout of your birth chart, you unlock effortless progress in every major life quadrant.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitsList.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-2xl bg-gold-50/10 border border-gold-400/15 hover:border-gold-400/45 hover:bg-gold-50/20 transition-all duration-300 group ${idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-full border border-gold-400/20 bg-white flex items-center justify-center group-hover:bg-gold-50 transition-colors duration-300 shadow-sm">
                  {benefit.icon}
                </div>
                {/* Title */}
                <h3 className="font-serif text-lg font-semibold text-gold-900">
                  {benefit.title}
                </h3>
                {/* Description */}
                <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stat Card */}
        <div className="mt-16 bg-gradient-to-r from-gold-50/40 via-white to-gold-50/40 border border-gold-400/20 p-8 rounded-3xl text-center max-w-4xl mx-auto shadow-sm">
          <p className="font-serif text-xl sm:text-2xl text-gold-900 italic">
            "92% of clients report sensing a shift in energy flow within the first 21 days of applying remedies."
          </p>
          <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest mt-4">
            — Empirical Study of 1,200 Aligned Homes
          </p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Unlock all five life quadrants with a single personalized blueprint.
          </p>
          <Link
            to="/#lead-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_8px_24px_rgba(197,145,84,0.3)] hover:shadow-[0_10px_30px_rgba(197,145,84,0.45)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group"
          >
            <span>Join Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

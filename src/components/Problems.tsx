import { motion } from "framer-motion";
import { Briefcase, Coins, Heart, Activity, Building2, ArrowRight } from "lucide-react";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";

export default function Problems() {
  const problemsList = [
    {
      icon: <Briefcase className="w-6 h-6 text-gold-500" />,
      title: "Career Stagnation & Politics",
      description: "Despite working hard, are you repeatedly passed over for promotions? Stagnant career growth, conflicts with managers, and toxic office politics are often caused by blockage in your North and West directions, which govern opportunities and gains.",
      warning: "Blocked North Zone = Missing Career Opportunities"
    },
    {
      icon: <Coins className="w-6 h-6 text-gold-500" />,
      title: "Sudden Debts & Financial Blocks",
      description: "Do you experience cash drains, blocked payments, or sudden business losses? Financial blockages arise when your Southeast zone (governing cash flow) is burdened by negative energies, or when your birth chart's 2nd and 11th houses are afflicted.",
      warning: "Imbalanced Southeast Zone = Stagnant Cash Flow"
    },
    {
      icon: <Heart className="w-6 h-6 text-gold-500" />,
      title: "Relationship Friction & Conflicts",
      description: "Frequent arguments with your spouse, lack of love, or delay in finding the right partner? The Southwest zone controls relationship stability. A toilet or stove here ruins family harmony and leads to chronic misunderstandings.",
      warning: "Afflicted Southwest Zone = Unstable Relationships"
    },
    {
      icon: <Activity className="w-6 h-6 text-gold-500" />,
      title: "Chronic Fatigue & Health Issues",
      description: "Do family members suffer from recurring illnesses or low energy? The North-Northeast zone controls immunity. Placing trash or fire elements in this zone results in continuous physical exhaustion and unexplained health issues.",
      warning: "Contaminated North-Northeast = Weakened Immunity"
    },
    {
      icon: <Building2 className="w-6 h-6 text-gold-500" />,
      title: "Business Slowdowns & Blocked Sales",
      description: "Struggling to attract premium clients or having partnership disputes? When your business space lacks alignment in the West (gains) and East (social connections), client acquisition stalls and partnerships suffer.",
      warning: "Weak West Zone = Zero Business Growth"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

  return (
    <section id="problems" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      {/* Decorative Gold Rings */}
      <div className="absolute top-1/2 left-[-10%] w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-[-5%] w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
            {/* <AlertTriangle className="w-4 h-4 text-gold-500" /> */}
            <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
              The Root Cause of Obstacles
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            Are You Experiencing These Unexplained Life Obstacles?
          </h2>
          <p className="text-sm sm:text-base text-gold-900/60 font-light max-w-2xl mx-auto">
            Traditional methods fail when your space (Vastu) and planetary charts (Astrology) are in direct conflict. Here is how cosmic misalignments ruin your efforts.
          </p>
        </div>

        {/* Problems Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {problemsList.map((prob, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`p-8 rounded-2xl glass-card flex flex-col justify-between border border-gold-400/15 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 group ${idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl border border-gold-400/20 bg-gold-50/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {prob.icon}
                </div>
                {/* Title */}
                <h3 className="font-serif text-xl font-medium text-gold-900">
                  {prob.title}
                </h3>
                {/* Description */}
                <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                  {prob.description}
                </p>
              </div>

              {/* Action/Warning bottom badge */}
              <div className="mt-6 pt-4 border-t border-gold-subtle/40">
                <div className="flex items-center justify-between text-[11px] font-medium text-gold-600 uppercase tracking-wider">
                  <span>{prob.warning}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Stop fighting symptoms. Find out exactly which zones are blocked in your space.
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

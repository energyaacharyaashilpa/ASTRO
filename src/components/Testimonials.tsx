import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Shared data — imported by both Testimonials.tsx (home) and Join.tsx
// To use real photos: replace the `avatar` URL with e.g. "/testimonials/rajesh.jpg"
// ---------------------------------------------------------------------------
export const reviews = [
  {
    name: "Rajesh Mehta",
    role: "Real Estate Developer, Delhi",
    initials: "RM",
    avatarColor: "bg-amber-100 text-amber-700",
    avatar: "https://ui-avatars.com/api/?name=Rajesh+Mehta&background=F5EEDC&color=715528&size=128&bold=true",
    challenge: "Stuck ₹8 Cr capital & government clearance delays for 18 months.",
    remedy: "Neutralized an underground water tank in the Southeast (fire zone) and aligned Mercury placements in the chart.",
    result: "Unconditionally cleared within 21 days. Unlocked capital and closed the land purchase deal successfully.",
    stars: 5,
  },
  {
    name: "Sneha Rao",
    role: "Software Director, Bangalore",
    initials: "SR",
    avatarColor: "bg-rose-100 text-rose-700",
    avatar: "https://ui-avatars.com/api/?name=Sneha+Rao&background=FEE2E2&color=B91C1C&size=128&bold=true",
    challenge: "Constant career stagnation, severe executive friction, and chronic fatigue.",
    remedy: "Removed red color files and heater from the North (water/career zone) and balanced Saturn 10th house blockages.",
    result: "Promoted to Director of Engineering within 3 months, securing a 45% salary hike and smooth leadership transitions.",
    stars: 5,
  },
  {
    name: "Anjali & Amit Sharma",
    role: "Retail Chain Owners, Indore",
    initials: "AS",
    avatarColor: "bg-emerald-100 text-emerald-700",
    avatar: "https://ui-avatars.com/api/?name=Anjali+Sharma&background=D1FAE5&color=065F46&size=128&bold=true",
    challenge: "Severe marital discord, constant arguments, and recurring health scares in the family.",
    remedy: "Neutralized a toilet in the Southwest (marriage zone) using lead tape and activated Venus energies using colors.",
    result: "Friction stopped completely. The home environment is now peaceful, and retail sales have grown by 30%.",
    stars: 5,
  },
];

export type Review = typeof reviews[0];

// ---------------------------------------------------------------------------
// Reusable full card — used on both Home and Join pages (nothing cut)
// ---------------------------------------------------------------------------
export function TestimonialCard({
  rev,
  idx,
  animate = true,
}: {
  rev: Review;
  idx: number;
  animate?: boolean;
}) {
  const inner = (
    <div className="p-8 rounded-2xl glass-card border border-gold-400/15 flex flex-col justify-between hover:shadow-xl hover:border-gold-400/30 transition-all duration-300 relative group h-full">
      <Quote className="absolute top-6 right-8 w-10 h-10 text-gold-200/20 group-hover:text-gold-200/30 transition-colors" />

      <div className="space-y-6">
        {/* Stars */}
        <div className="flex space-x-1">
          {[...Array(rev.stars)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
          ))}
        </div>

        {/* Full case content — nothing trimmed */}
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-red-700/70 uppercase tracking-widest">Before Alignment:</p>
            <p className="text-xs sm:text-sm text-gold-900/80 leading-relaxed font-light">{rev.challenge}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">Remedy Applied:</p>
            <p className="text-xs sm:text-sm text-gold-900/70 leading-relaxed font-light italic">"{rev.remedy}"</p>
          </div>
          <div className="space-y-1 pt-2">
            <p className="text-[10px] font-bold text-green-700/80 uppercase tracking-widest">The Result:</p>
            <p className="text-sm font-serif font-medium text-gold-900 leading-relaxed">{rev.result}</p>
          </div>
        </div>
      </div>

      {/* Author — image avatar */}
      <div className="mt-8 pt-4 border-t border-gold-subtle/40 flex items-center gap-3">
        <img
          src={rev.avatar}
          alt={rev.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-gold-400/30 flex-shrink-0"
        />
        <div>
          <p className="font-serif text-base font-semibold text-gold-900">{rev.name}</p>
          <p className="text-[11px] text-gold-900/50 uppercase tracking-wider">{rev.role}</p>
        </div>
      </div>
    </div>
  );

  if (!animate) return inner;

  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.15 }}
    >
      {inner}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Default export — full section used on the Home page
// ---------------------------------------------------------------------------
export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      <div className="absolute top-10 left-10 w-48 h-48 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 border border-gold-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
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
        </div>

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
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Your breakthrough story starts with one consultation.
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

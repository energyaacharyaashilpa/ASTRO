import { Link } from "react-router-dom";
import {  ArrowRight } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="py-24 bg-luxury-gradient relative overflow-hidden border-t border-gold-subtle/30">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />

      {/* Astro rings graphic */}
      <div className="absolute left-1/2 bottom-[-150px] -translate-x-1/2 w-[600px] h-[600px] opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500 animate-spin-slow">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="44" strokeDasharray="2,2" strokeWidth="0.5" />
          <polygon points="50,10 85,70 15,70" strokeWidth="0.3" fill="none" stroke="currentColor" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Sparkle Tag */}
        <div className="inline-flex items-center space-x-2 bg-gold-50/80 border border-gold-300/30 px-4 py-1.5 rounded-full shadow-sm">
          {/* <Sparkles className="w-4 h-4 text-gold-500" /> */}
          <span className="text-[10px] font-bold tracking-widest text-gold-700 uppercase">
            Limited Availability
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight max-w-3xl mx-auto">
          Ready to Re-align Your Space & Invite Infinite Abundance?
        </h2>

        {/* Copy */}
        <p className="text-sm sm:text-base text-gold-900/70 font-light max-w-2xl mx-auto leading-relaxed">
          Stop fighting chronic career plateaus, cash flow blocks, and home conflicts. Claim your highly personalized Astro Vastu consultation today. Energy Aacharyaa Shilpa will personally analyze your birth chart and layout.
        </p>

        {/* Booking details badge */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto py-4">
          <div className="p-4 rounded-xl border border-gold-400/10 bg-white/50 backdrop-blur-sm">
            <p className="text-xs text-gold-950 font-bold uppercase tracking-wider">1-on-1 Session</p>
            <p className="text-[10px] text-gold-900/60 mt-1">Personal Zoom Analysis</p>
          </div>
          <div className="p-4 rounded-xl border border-gold-400/10 bg-white/50 backdrop-blur-sm">
            <p className="text-xs text-gold-950 font-bold uppercase tracking-wider">Zero Demolition</p>
            <p className="text-[10px] text-gold-900/60 mt-1">Portative Remedies</p>
          </div>
          <div className="p-4 rounded-xl border border-gold-400/10 bg-white/50 backdrop-blur-sm">
            <p className="text-xs text-gold-950 font-bold uppercase tracking-wider">PDF Blueprint</p>
            <p className="text-[10px] text-gold-900/60 mt-1">Detailed directional maps</p>
          </div>
          <div className="p-4 rounded-xl border border-gold-400/10 bg-white/50 backdrop-blur-sm">
            <p className="text-xs text-gold-950 font-bold uppercase tracking-wider">1 Year Support</p>
            <p className="text-[10px] text-gold-900/60 mt-1">Follow-up audits included</p>
          </div>
        </div>

        {/* Button CTA */}
        <div className="pt-4">
          <Link
            to="/join"
            className="inline-flex items-center space-x-3 px-10 py-5 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_12px_35px_rgba(197,145,84,0.35)] hover:shadow-[0_15px_40px_rgba(197,145,84,0.5)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group cursor-pointer"
          >
            <span>Join Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
        </div>

      </div>
    </section>
  );
}

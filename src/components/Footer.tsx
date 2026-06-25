import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import AstroLogo from "../assets/astro.png";

export default function Footer() {
  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-green-800 border-t border-gold-500/20 py-16 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-700/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src={AstroLogo}
                alt="Astro Vastu Logo"
                className="h-24 w-auto object-contain"
                style={{ maxWidth: "220px" }}
              />
            </Link>
            <p className="text-sm max-w-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Bridging the ancient wisdom of Vedic Astrology and Vastu Shastra to restore flow, balance, and Venusian abundance in your professional and personal life.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-widest mb-5" style={{ color: "#C9A968" }}>Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleNavClick("why-vastu")} className="text-left font-light cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.9)" }} onMouseEnter={e => (e.currentTarget.style.color="#C9A968")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}>Process</button></li>
              <li><button onClick={() => handleNavClick("why-vastu")} className="text-left font-light cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.9)" }} onMouseEnter={e => (e.currentTarget.style.color="#C9A968")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}>Scientific Approach</button></li>
              <li><button onClick={() => handleNavClick("expert")} className="text-left font-light cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.9)" }} onMouseEnter={e => (e.currentTarget.style.color="#C9A968")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}>Meet The Expert</button></li>
              <li><button onClick={() => handleNavClick("faq")} className="text-left font-light cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.9)" }} onMouseEnter={e => (e.currentTarget.style.color="#C9A968")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.9)")}>Frequently Asked Questions</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-widest mb-5" style={{ color: "#C9A968" }}>Connect</h3>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              <li className="flex items-center space-x-2"><Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A968" }} /><span className="truncate"> energyaacharyaashilpa@gmail.com</span></li>
              <li className="flex items-center space-x-2"><Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A968" }} /><span>+917302196333</span></li>
              <li className="flex items-center space-x-2"><MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A968" }} /><span>India</span></li>
            </ul>
          </div>

        </div>

        <div className="gold-divider my-10" />

        {/* Disclaimer & Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          <p className="max-w-2xl text-center md:text-left leading-relaxed font-light">
            Disclaimer: Astro Vastu consultations are spiritual guidance practices based on cosmic charts and environmental dynamics. Results may vary and are intended to supplement, not replace, professional financial, career, medical, or legal advice.
          </p>
          <p className="flex-shrink-0 font-light">
            &copy; {new Date().getFullYear()} Energy Acharya Shilpa Astro Vastu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

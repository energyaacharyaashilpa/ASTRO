import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AstroLogo from "../assets/Astro_logo.webp";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-gold-subtle/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={AstroLogo}
              alt="Astro Vastu Logo"
              className="h-14 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("problems")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              Challenges
            </button>
            <button
              onClick={() => handleNavClick("why-vastu")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              Science
            </button>
            <button
              onClick={() => handleNavClick("benefits")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              Benefits
            </button>
            <button
              onClick={() => handleNavClick("expert")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              Expert
            </button>
            <button
              onClick={() => handleNavClick("testimonials")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              Success Stories
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="text-sm tracking-wide text-gold-900/80 hover:text-gold-500 transition-colors cursor-pointer"
            >
              FAQs
            </button>
          </div>

          {/* Action CTA */}
          <div className="hidden md:flex items-center">
            <Link
              to="/join"
              className="relative px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-gold-500 hover:bg-gold-600 transition-all duration-300 shadow-[0_4px_20px_rgba(197,145,84,0.25)] hover:shadow-[0_4px_25px_rgba(197,145,84,0.4)] overflow-hidden group border border-gold-400"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-0" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-900/80 hover:text-gold-500 transition-colors p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel bg-white border-t border-gold-subtle/50 py-4 px-6 absolute top-full left-0 w-full shadow-lg transition-all duration-300">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleNavClick("problems")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              Challenges
            </button>
            <button
              onClick={() => handleNavClick("why-vastu")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              Science
            </button>
            <button
              onClick={() => handleNavClick("benefits")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => handleNavClick("expert")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              Expert
            </button>
            <button
              onClick={() => handleNavClick("testimonials")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              Success Stories
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="text-left py-2 text-sm font-medium tracking-wide text-gold-900/85 hover:text-gold-500 transition-colors"
            >
              FAQs
            </button>
            <Link
              to="/join"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-gold-500 hover:bg-gold-600 transition-colors border border-gold-400"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

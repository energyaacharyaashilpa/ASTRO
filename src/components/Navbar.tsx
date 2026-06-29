import { Link } from "react-router-dom";
import AstroLogo from "../assets/astro1.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 border-b border-gold-500/20 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28 items-center">
          {/* Logo — shifted left */}
          <Link to="/" className="flex items-center group -ml-2">
            <img
              src={AstroLogo}
              alt="Energy Aacharyaa Shilpa"
              className="h-20 md:h-24 w-auto object-contain group-hover:opacity-90 transition-opacity"
              style={{ maxWidth: "260px" }}
            />
          </Link>

          {/* Action CTA */}
          <div className="flex items-center">
            <Link to="/join" className="relative px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase text-green-900 bg-gold-500 hover:bg-gold-400 transition-all duration-300 shadow-[0_4px_20px_rgba(184,146,63,0.4)] border border-gold-400">
              <span className="relative z-10">Join Now</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

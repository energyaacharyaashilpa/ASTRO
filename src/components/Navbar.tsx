import { Link } from "react-router-dom";
import AstroLogo from "../assets/astro2.png";

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

        </div>
      </div>
    </nav>
  );
}

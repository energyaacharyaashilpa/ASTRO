import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Join from "./pages/Join";
import ThankYou from "./pages/ThankYou";

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/thank-you";

  return (
    <div className="flex flex-col min-h-screen bg-luxury-white text-gold-900 overflow-x-hidden">
      <ScrollToTop />

      {!hideHeaderFooter && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

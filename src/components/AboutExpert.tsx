import { motion } from "framer-motion";
import { Award, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AstroLogo from "../assets/img.png";

export default function AboutExpert() {
  return (
    <section id="expert" className="py-24 bg-gold-50/10 relative overflow-hidden border-b border-gold-subtle/30 scroll-mt-20">
      {/* Decorative celestial background */}
      <div className="absolute right-[-10%] bottom-0 w-80 h-80 bg-gold-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Side: Photo with Elegant Gold Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Outer Glowing Border */}
              <div className="absolute inset-0 rounded-2xl border border-gold-400/30 -m-3 animate-pulse pointer-events-none" />

              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border-[6px] border-white shadow-2xl max-w-sm sm:max-w-md">
                <img
                  src={AstroLogo}
                  alt="Energy Aacharyaa Shilpa - Astro Vastu Expert"
                  className="w-full h-auto object-cover transform hover:scale-[1.03] transition-transform duration-500"
                />
              </div>

              {/* Float Experience Badge */}
              <div className="absolute bottom-6 -right-4 bg-white border border-gold-400/30 p-4 rounded-xl shadow-lg flex items-center space-x-2.5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-lg border border-gold-400">
                  15+
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gold-500 font-bold">Years of</p>
                  <p className="text-xs font-semibold text-gold-900">Vedic Mastery</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Biography & Authority Build */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
              {/* <Star className="w-4 h-4 text-gold-500" /> */}
              <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
                Meet Your Cosmic Guide
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
              Energy Aacharyaa Shilpa
            </h2>

            <p className="text-sm font-semibold text-gold-700 uppercase tracking-wider">
              Pioneer of Personalized Astro Vastu remedies
            </p>

            <div className="space-y-4 text-sm sm:text-base text-gold-900/70 font-light leading-relaxed">
              <p>
                Energy Aacharyaa Shilpa is a globally renowned Vedic astrologer and master Vastu consultant with over 15 years of active research. She has worked with CEOs, developers, celebrities, and thousands of households to align their destiny with their surroundings.
              </p>
              <p>
                Unlike rigid Vastu consultants who demand expensive demolitions or structural breaking, Energy Aacharyaa Shilpa specializes in <strong>Non-Destructive Astro Vastu Remedies</strong>. She analyzes your personal horoscope to identify which planetary blocks are reflecting in your space, applying precise color therapy, copper/brass alignments, and planetary metal corrections.
              </p>
            </div>

            {/* Signature Quote */}
            <blockquote className="border-l-2 border-gold-400 pl-4 py-1 italic text-gold-800 text-sm sm:text-base font-serif">
              "Your living space is a living extension of your subconscious mind and your planetary chart. Align the space, correct the energy frequencies, and watch your obstacles dissolve."
            </blockquote>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gold-900">Certified Jyotish Aacharyaa</span>
              </div>

              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gold-900">10,000+ Consultations</span>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="pt-4 flex justify-center lg:justify-start"
            >
              <Link
                to="/#lead-form"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_8px_24px_rgba(197,145,84,0.3)] hover:shadow-[0_10px_30px_rgba(197,145,84,0.45)] transition-all duration-300 border border-gold-400 hover:scale-[1.03] group"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const faqs = [
    {
      q: "What birth details are required for the consultation?",
      a: "To construct your cosmic chart, we require your Full Name, Date of Birth, Time of Birth, and Place of Birth. You will also need to submit an accurate layout map of your house or office, showing the directions, including the Drainage System, Slopes and Fire Zones."
    },
    {
      q: "How soon can I expect to notice changes?",
      a: "Most clients report an immediate shift in the house's atmosphere (feelings of lightness, less stress) within 7–10 days of final implementation of Physical Changes. In certain cases, results reflect within 3 weeks of Devta Activation. Physical breakthroughs in career, court cases, cash blockages, or relationship harmony typically manifest between 21 to 45 days after completing the remedies."
    },
    {
      q: "Do you provide deep consultation on specific issues and concerns?",
      a: "Absolutely yes, we not only listen to your particular problems and concerns but also offer the most suitable solutions so that you will get quick results."
    },
    {
      q: "How can Vastu Shastra improve my life?",
      a: "Vastu Shastra operates as the architectural software for your physical environment. It is the systemic optimization of your commercial or residential space. By mathematically aligning your building's structural geometry with natural magnetic and elemental frequencies, it eliminates environmental friction. Alongside physical layout shifts, it utilizes precise micro-adjustments to neutralize structural imbalances, transforming your space into an optimized asset that actively accelerates your focus, operational efficiency, and financial growth."
    },
    {
      q: "Do your remedies require structural demolition or breaking walls?",
      a: "Absolutely not. We have a strict 'Zero Demolition' policy. Our Astro Vastu remedies are non-destructive and utilize scientific elements: elemental metal strips (copper, brass, lead, iron), color spectrum therapy, precise object relocation, and planetary crystals to re-tune your home's frequency. Minor exception: A washroom located in the Northeast (NE) or North-Northeast (NNE) zone is an exception to this policy — these directions govern health, clarity, and divine energy, and a toilet placed here cannot be fully remedied through objects alone. In such cases, relocation may be advisable."
    },
    {
      q: "How does Astro Vastu differ from standard Vastu Shastra?",
      a: "Standard Vastu applies generalized rules (e.g., 'North is always positive for wealth'). Astro Vastu is highly personalized. If your birth chart (Kundli) shows Mercury is in your 12th house (expenditures), activating the North (governed by Mercury) without chart alignment can actually double your losses. We match your home layout specifically to your horoscope."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gold-50/10 relative overflow-hidden border-t border-gold-subtle/30 scroll-mt-20">
      <div className="absolute left-[-10%] top-[30%] w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[20%] w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
            <HelpCircle className="w-4 h-4 text-gold-500" />
            <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
              Got Questions?
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gold-900/60 font-light">
            Everything you need to know about the science of Astro Vastu and the consultation process.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gold-400/15 rounded-2xl overflow-hidden transition-colors duration-300 hover:border-gold-400/35 shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-gold-900 pr-2">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-gold-600 transition-transform duration-300" />
                    ) : (
                      <Plus className="w-4 h-4 text-gold-600 transition-transform duration-300" />
                    )}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed border-t border-gold-50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Still have questions? The best answers come from a personal reading.
          </p>
          <Link
            to="/join"
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

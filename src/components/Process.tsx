import { motion } from "framer-motion";
import {
  Phone,
  Map,
  Layout,
  Wrench,
  Sparkles,
  ClipboardCheck,
  ArrowRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Process() {
  const stages = [
    {
      number: "01",
      title: "Consultation Call",
      description: "Understand client goals and determine required services (Booking: 599).",
      timeline: "Based on calendar availability",
      icon: <Phone className="w-5 h-5 text-gold-500" />
    },
    {
      number: "02",
      title: "Site & Plan Analysis",
      description: "Evaluate the physical site and architectural floor plan.",
      timeline: "1 to 3 weeks",
      icon: <Map className="w-5 h-5 text-gold-500" />
    },
    {
      number: "03",
      title: "Remedies & Layout Plan",
      description: "Develop customized remedies and structural layout adjustments.",
      timeline: "Within 1 week of site analysis",
      icon: <Layout className="w-5 h-5 text-gold-500" />
    },
    {
      number: "04",
      title: "Implementation",
      description: "Client supervises and executes the physical structural changes.",
      timeline: "Client's schedule",
      icon: <Wrench className="w-5 h-5 text-gold-500" />
    },
    {
      number: "05",
      title: "Elemental Balancing",
      description: "Micro-tune energies via Devtas, if required.",
      timeline: "3 weeks post-implementation",
      icon: <Sparkles className="w-5 h-5 text-gold-500" />
    },
    {
      number: "06",
      title: "Follow-up & Review",
      description: "Ensure remedies are functioning correctly via a check-in summary.",
      timeline: "3 Weeks Post-balancing",
      icon: <ClipboardCheck className="w-5 h-5 text-gold-500" />
    }
  ];

  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      {/* Decorative background vectors */}
      <div className="absolute right-[-10%] top-10 w-80 h-80 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute left-[-10%] bottom-10 w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-50/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 border-b border-gold-400/30 pb-2">
            <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
              The Alignment Journey
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            Our Structured Consultation Process
          </h2>
          <p className="text-sm sm:text-base text-gold-900/60 font-light max-w-2xl mx-auto">
            A precise, logical sequence to synchronize your space with your astrological blueprint, achieving permanent elemental harmony.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative mt-12">
          {/* Central Line (Desktop) / Left Line (Mobile) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold-300/10 via-gold-400/40 to-gold-300/10 transform -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {stages.map((stage, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row items-stretch w-full relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-2 border-gold-400 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(184,146,63,0.2)]">
                    <span className="font-serif text-xs font-bold text-gold-700">{stage.number}</span>
                  </div>

                  {/* Left Side Content (Desktop) */}
                  <div className="w-full md:w-1/2 flex items-center justify-end pr-0 md:pr-12 pl-12 md:pl-0 order-2 md:order-1">
                    {isEven ? (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full text-left md:text-right"
                      >
                        <div className="hidden md:block space-y-3">
                          <div className="inline-flex items-center space-x-2 bg-gold-50/60 border border-gold-400/20 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-gold-600" />
                            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{stage.timeline}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full"
                      >
                        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-400/15 hover:border-gold-400/40 hover:bg-gold-50/10 transition-all duration-300 shadow-sm flex flex-col items-start gap-4">
                          <div className="w-10 h-10 rounded-full border border-gold-400/20 bg-white flex items-center justify-center shadow-sm">
                            {stage.icon}
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-serif text-xl font-medium text-gold-900">
                              {stage.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                              {stage.description}
                            </p>
                          </div>
                          <div className="md:hidden inline-flex items-center space-x-2 bg-gold-50/60 border border-gold-400/20 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-gold-600" />
                            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{stage.timeline}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Spacer (Desktop) */}
                  <div className="hidden md:block w-0 h-auto" />

                  {/* Right Side Content (Desktop) */}
                  <div className="w-full md:w-1/2 flex items-center justify-start pl-12 pr-0 order-3">
                    {isEven ? (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full"
                      >
                        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-400/15 hover:border-gold-400/40 hover:bg-gold-50/10 transition-all duration-300 shadow-sm flex flex-col items-start gap-4">
                          <div className="w-10 h-10 rounded-full border border-gold-400/20 bg-white flex items-center justify-center shadow-sm">
                            {stage.icon}
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-serif text-xl font-medium text-gold-900">
                              {stage.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gold-900/70 font-light leading-relaxed">
                              {stage.description}
                            </p>
                          </div>
                          <div className="md:hidden inline-flex items-center space-x-2 bg-gold-50/60 border border-gold-400/20 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-gold-600" />
                            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{stage.timeline}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full"
                      >
                        <div className="hidden md:block space-y-3">
                          <div className="inline-flex items-center space-x-2 bg-gold-50/60 border border-gold-400/20 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-gold-600" />
                            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{stage.timeline}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA section under timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-gold-900/60 font-light mb-6">
            Get started today by scheduling your initial Consultation Call.
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

import Hero from "../components/Hero";
// import Problems from "../components/Problems";
import WhatWeDo from "../components/WhatWeDo";
import WhyVastu from "../components/WhyVastu";
import Process from "../components/Process";
import AboutExpert from "../components/AboutExpert";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import HomeCTA from "../components/HomeCTA";

export default function Home() {
  
  return (
    <div className="relative w-full">
      {/* Hero section */}
      <Hero />
      
      {/* What We Do section */}
      <WhatWeDo />
      
      {/* Problem awareness section (commented out) */}
      {/* <Problems /> */}
      
      {/* Why Astro Vastu works section */}
      <WhyVastu />
      
      {/* Consultation Process section */}
      <Process />
      
      {/* About expert section */}
      <AboutExpert />
      
      {/* Testimonials section */}
      <Testimonials />
      
      {/* FAQ section */}
      <FAQ />
      
      {/* Bottom CTA section */}
      <HomeCTA />
    </div>
  );
}

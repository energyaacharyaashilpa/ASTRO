import React from "react";
import AstroLogo from "../assets/astro2.png";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-luxury-gradient flex flex-col items-center justify-center p-6 sm:p-12 text-gold-900 font-serif">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-gold-400/30 shadow-2xl flex flex-col items-center text-center space-y-6">
        <img
          src={AstroLogo}
          alt="Energy Aacharyaa Shilpa"
          className="h-28 md:h-36 w-auto object-contain mb-4"
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-700">
          One more step to go:
        </h1>

        <p className="text-lg sm:text-xl font-light text-gold-900/80">
          Thank you for showing your interest in the Astro Vastu Analysis! ⚡
        </p>

        <p className="text-sm sm:text-base text-gold-900/70 font-light max-w-2xl">
          We’re so excited to see if we’re a good fit to work together to help harmonize the space and energy for exponential growth.
        </p>

        <div className="text-left w-full space-y-4 text-sm sm:text-base text-gold-900/70 mt-6 bg-gold-50/30 p-6 rounded-xl border border-gold-400/20">
          <p className="font-semibold text-gold-800 mb-4 text-lg">Here’s what to do next:</p>

          <div className="space-y-4">
            <p>
              1) <a href="https://docs.google.com/forms/d/1aGIs97cCdXON5-ihwaVQjZBlLLn9P7Li_odu6FFKge0/edit" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline font-semibold hover:text-gold-500">Click here</a> to fill out the short application. Based on your answers your application will be reviewed. So just be very honest with your answers as per your current business situation.
            </p>
            <p>
              2) Please check your email — we have already sent you the application form. If it went to spam, kindly move it to Primary. If you still don’t see it, let us know.
            </p>
            <p>
              3) Our team will review your answers and get back to you with a response within 48 business hours.
            </p>
          </div>
        </div>

        <p className="text-sm text-gold-900/60 max-w-2xl font-light">
          Rest assured that if we are not able to take your case, a refund, against the booking charges of the clarity call, will be issued within 7 days of the review result. Refunds should reflect into your account as per bank timelines.
        </p>

        <p className="text-sm text-gold-900/60 max-w-2xl font-light">
          If you have any questions related to requirements email us at <a href="mailto:energyaacharyaashilpa@gmail.com" className="text-gold-600 hover:underline">energyaacharyaashilpa@gmail.com</a>.
          <br /><br />
          – Energy Aacharyaa Shilpa
        </p>
      </div>
    </div>
  );
}

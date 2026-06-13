import React from "react";
import { STEPS } from "../data";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#00C853] bg-[#00C853]/10 font-extrabold text-xs tracking-widest uppercase px-3 py-1 rounded-full border border-[#00C853]/10">
            No Bureaucracy
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            How MYSOLUTION HUB Works
          </h2>
          <p className="mt-3 text-base text-gray-550">
            Four simple and transparent phases to verify and process your document requests without waiting in physical queues.
          </p>
        </div>

        {/* Steps Horizontal / Grid Timeline */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10" id="how-steps-grid">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-gray-150 p-6.5 rounded-2xl relative shadow-sm group hover:shadow-md transition-all flex flex-col justify-between"
              id={`how-step-card-${i}`}
            >
              <div>
                {/* Visual Step number */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#00C853]/20 font-mono text-3xl group-hover:text-[#00C853]/40 transition-colors">
                    {step.number}
                  </span>
                  {i < 3 && (
                    <ArrowRight className="hidden lg:block w-5 h-5 text-gray-300 group-hover:translate-x-1.5 transition-transform" />
                  )}
                </div>

                <h3 className="mt-4 font-bold text-gray-900 text-base tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Moniepoint active status dot aesthetic */}
              <div className="mt-6 flex items-center gap-1.5 text-[9.5px] font-mono font-bold text-[#00C853] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-ping"></span>
                Instant Access
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

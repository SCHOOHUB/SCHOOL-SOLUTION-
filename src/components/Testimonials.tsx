import React from "react";
import { TESTIMONIALS } from "../data";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" id="testimonials">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#00C853] bg-[#00C853]/10 font-extrabold text-xs tracking-widest uppercase px-3 py-1 rounded-full border border-[#00C853]/10">
            Real Reviews
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Why Thousands Trust MYSOLUTION HUB
          </h2>
          <p className="mt-3 text-base text-gray-550">
            Read transparent reviews from our active student, corporate business, and immigrant clients across Nigeria.
          </p>
        </div>

        {/* Reviews Card Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8" id="testimonials-grid">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="bg-gray-50 border border-gray-150 rounded-2xl p-6.5 hover:shadow-lg transition-all flex flex-col justify-between relative"
              id={`test-card-${test.id}`}
            >
              <Quote className="absolute right-6 top-6 w-8 h-8 text-gray-200 pointer-events-none" />

              <div>
                {/* 5 Stars indicators */}
                <div className="flex gap-0.5" id="testimonials-stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#00C853] text-[#00C853]" />
                  ))}
                </div>

                <p className="mt-4 text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{test.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${test.avatarColor} text-white flex items-center justify-center font-extrabold text-xs`}>
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">
                      {test.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {test.role}
                    </p>
                  </div>
                </div>

                {/* Target service category tag */}
                <span className="text-[9.5px] font-mono font-bold bg-[#00C853]/10 text-[#00C853] px-2.5 py-0.5 rounded-full border border-[#00C853]/10 hidden sm:inline-block">
                  {test.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { FEATURES } from "../data";
import { Zap, ShieldAlert, LockKeyhole, CircleDollarSign, Headphones } from "lucide-react";

export default function WhyChooseUs() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-6 h-6 text-[#00C853]" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-6 h-6 text-[#00C853]" />;
      case "LockKeyhole":
        return <LockKeyhole className="w-6 h-6 text-[#00C853]" />;
      case "CircleDollarSign":
        return <CircleDollarSign className="w-6 h-6 text-[#00C853]" />;
      case "Headphones":
        return <Headphones className="w-6 h-6 text-[#00C853]" />;
      default:
        return <Zap className="w-6 h-6 text-[#00C853]" />;
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100" id="why-us">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 font-extrabold text-xs tracking-widest uppercase px-3 py-1 rounded-full">
            The Hub Integrity
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Why Thousands Trust MYSOLUTION HUB
          </h2>
          <p className="mt-3 text-base text-gray-550">
            Fusing fintech security rules with rapid physical administrative dispatch systems ensures your files get filed with zero downtime.
          </p>
        </div>

        {/* Bento/Modern Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="why-features-grid">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-150 rounded-2xl p-6.5 hover:shadow-xl hover:border-[#00C853]/40 transition-all"
              id={`why-card-${i}`}
            >
              <div className="w-12 h-12 bg-[#00C853]/10 text-[#00C853] flex items-center justify-center rounded-xl border border-[#00C853]/10">
                {getIcon(feat.icon)}
              </div>
              <h3 className="mt-4.5 font-bold text-gray-900 text-lg tracking-tight">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

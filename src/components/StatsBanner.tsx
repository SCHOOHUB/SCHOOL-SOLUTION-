import React from "react";
import { ShieldCheck, Users, Clock, Award } from "lucide-react";

export default function StatsBanner() {
  const stats = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00C853]" />,
      value: "25,000+",
      label: "Verified Documents",
      sub: "Government & School Pin processing",
    },
    {
      icon: <Users className="w-6 h-6 text-[#00C853]" />,
      value: "12,500+",
      label: "Active Clients",
      sub: "Business, jobseekers & students",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00C853]" />,
      value: "99.4%",
      label: "Fast Sla Success",
      sub: "Under 12-24 hours for minor tasks",
    },
    {
      icon: <Award className="w-6 h-6 text-[#00C853]" />,
      value: "4.9/5.0",
      label: "Satisfied Reviews",
      sub: "Highly rated digital assistance hub",
    },
  ];

  return (
    <div className="bg-gray-50 border-y border-gray-100 py-10 px-4 sm:px-6 lg:px-8" id="stats-banner-container">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-150/50 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              id={`stat-card-${i}`}
            >
              <div className="p-3 bg-[#00C853]/10 rounded-xl flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="font-extrabold text-2xl text-gray-900 tracking-tight">{stat.value}</div>
                <div className="font-bold text-sm text-gray-800 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

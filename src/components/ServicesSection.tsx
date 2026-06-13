import React from "react";
import { CATEGORIES, SERVICES } from "../data";
import IconMapper from "./IconMapper";
import { Search, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const filteredServices = SERVICES.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100" id="services">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[#00C853] font-extrabold text-xs tracking-widest uppercase bg-[#00C853]/10 px-3 py-1 rounded-full border border-[#00C853]/10">
            Digital Processing Menu
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
            Select Your Requested Service Category
          </h2>
          <p className="mt-3 text-base text-gray-550">
            Browse our wide range of education registers, tax filing, immigration processing, utility systems, and document modification desks.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-10 max-w-xl mx-auto flex items-center bg-gray-50 rounded-2xl border border-gray-150 px-4 py-2.5 shadow-sm focus-within:border-[#00C853]/60 focus-within:ring-2 focus-within:ring-[#00C853]/10 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search e.g. NIN, WAEC Pin, CAC, CV writing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 border-none outline-none placeholder-gray-400"
            id="services-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-gray-400 hover:text-gray-900 font-bold px-1.5 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pill Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-5xl mx-auto" id="category-pills">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#00C853] text-white shadow-sm"
                : "bg-gray-100/80 text-gray-700 hover:bg-gray-200"
            }`}
            id="cat-pill-all"
          >
            All Services ({SERVICES.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = SERVICES.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#00C853] text-white shadow-sm"
                    : "bg-gray-100/80 text-gray-700 hover:bg-gray-200"
                }`}
                id={`cat-pill-${cat.id}`}
              >
                <IconMapper name={cat.iconName} className="w-3.5 h-3.5" />
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Group Header (if specific category is chosen) */}
        {selectedCategory !== "all" && (
          <div className="mt-12 bg-emerald-50/40 border border-emerald-100/60 p-6 rounded-2xl max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <IconMapper 
                  name={CATEGORIES.find((c) => c.id === selectedCategory)?.iconName || "HelpCircle"} 
                  className="w-5 h-5 text-[#00C853]" 
                />
                {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-xs text-gray-550 mt-1">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.description}
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-800 bg-[#00C853]/10 px-2.5 py-1 rounded-full border border-[#00C853]/10">
              Verified Channel
            </div>
          </div>
        )}

        {/* Services Listing Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-150 rounded-2xl p-6 hover:shadow-xl hover:border-[#00C853]/45 transition-all flex flex-col justify-between group relative overflow-hidden"
                id={`service-card-${service.id}`}
              >
                {/* Decorative glow hover wrapper */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00C853]/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform"></div>

                <div>
                  {/* Category Title Indicator */}
                  <span className="text-[10px] font-extrabold font-mono tracking-wider text-gray-400 uppercase">
                    {CATEGORIES.find((c) => c.id === service.category)?.name}
                  </span>

                  <h4 className="mt-1.5 font-extrabold text-base text-gray-900 tracking-tight group-hover:text-[#00C853] transition-colors leading-snug">
                    {service.name}
                  </h4>

                  <p className="mt-2 text-xs text-gray-550 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  {/* Price and Duration badge metrics */}
                  <div className="flex items-center justify-between text-[11px] text-gray-700 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <div>
                      <span className="text-gray-450 block uppercase text-[8.5px] font-extrabold tracking-wider leading-none">Est. Charges</span>
                      <span className="font-extrabold text-gray-900 block mt-0.5">{service.priceEstimate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-450 block uppercase text-[8.5px] font-extrabold tracking-wider leading-none">Turnaround</span>
                      <span className="font-bold text-[#00C853] block mt-0.5">{service.duration}</span>
                    </div>
                  </div>

                  {/* Push user to specific form in dashboard */}
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="w-full mt-3.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#00C853]/10 text-[#00C853] group-hover:bg-[#00C853] group-hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group-hover:shadow-md group-hover:shadow-[#00C853]/15"
                    id={`btn-select-service-${service.id}`}
                  >
                    Initiate Application
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-250">
              <p className="text-sm text-gray-500 font-bold">No registered services matched your search filters.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="mt-3 text-xs text-[#00C853] hover:underline font-extrabold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

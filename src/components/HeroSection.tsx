import React from "react";
import { MessageSquare, LayoutDashboard, Shield, AlertCircle, FileCheck, Search, Users, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onOpenDashboard: () => void;
  onScrollToServices: () => void;
}

export default function HeroSection({ onOpenDashboard, onScrollToServices }: HeroSectionProps) {
  // Safe WhatsApp dispatch URL
  const whatsappUrl = "https://wa.me/2349041818917?text=Hello%20MYSOLUTION%20HUB%2C%20I%20want%20to%20inquire%20about%20your%20digital%2520services.";

  return (
    <section className="relative overflow-hidden bg-white pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8" id="hero-section">
      {/* Background grids styling */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C853]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00C853]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: Headlines & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left" id="hero-content">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00C853]/10 text-[#00C853] text-[11px] font-bold tracking-widest uppercase mb-6 shadow-sm border border-[#00C853]/15">
            <Shield className="w-3.5 h-3.5 fill-current" />
            100% Secure & Vetted Processing
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Fast, Reliable & <br className="hidden sm:inline" />
            <span className="text-[#00C853]">Professional</span> Digital Services
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-650 leading-relaxed max-w-2xl">
            MYSOLUTION HUB helps students, job seekers, business owners, and individuals access registration, documentation, status processing, and online services quickly, reliably, and completely stress-free. Inspired by premium fintech simplicity.
          </p>

          {/* Core Trust checklist as listed under TRUST SECTION request */}
          <div className="mt-8 flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-800 font-semibold" id="hero-trust-list">
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
              <span className="text-[#00C853]">✓</span> Fast Processing
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
              <span className="text-[#00C853]">✓</span> Reliable Support
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
              <span className="text-[#00C853]">✓</span> Affordable Pricing
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
              <span className="text-[#00C853]">✓</span> Professional Service
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150">
              <span className="text-[#00C853]">✓</span> Nationwide Coverage
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto" id="hero-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-8 py-4 rounded-xl text-white bg-[#00C853] hover:bg-[#00E676] font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#00C853]/20 transition-all text-center"
              id="hero-primary-cta"
            >
              <MessageSquare className="w-5.5 h-5.5 fill-current" />
              Chat on WhatsApp
            </a>

            <button
              onClick={onOpenDashboard}
              className="px-8 py-4 rounded-xl text-gray-900 bg-white border-2 border-gray-200 hover:border-[#00C853] hover:text-[#00C853] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="hero-secondary-cta"
            >
              <LayoutDashboard className="w-5 h-5" />
              Document Verification Desk
            </button>
          </div>

          {/* Quick Notice */}
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-550" id="hero-notice">
            <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Need active examination PINs or CAC updates? Type or upload documents right now.</span>
          </div>
        </div>

        {/* Right Side: Interactive Mockup representing modern Moniepoint layout */}
        <div className="lg:col-span-5 relative" id="hero-interactive-mockup">
          <div className="relative mx-auto max-w-[420px] bg-white rounded-3xl p-5 border border-gray-150 shadow-2xl relative z-10 glow-green">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00C853]/20 flex items-center justify-center">
                  <Shield className="text-[#00C853] w-4.5 h-4.5" />
                </div>
                <span className="font-bold text-xs text-gray-900 uppercase tracking-wider">MYSOLUTION DESK</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 font-extrabold flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse"></span>
                ACTIVE OFFICE
              </span>
            </div>

            {/* Document Verification Process Bar Simulation */}
            <div className="space-y-4">
              {/* Box 1 */}
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">CAC Business Name filing</div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: MSH-2026-CAC42</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">Processing</span>
                </div>
                {/* Horizontal progress */}
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00C853] w-2/3 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">JAMB Result PIN Check</div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: MSH-2026-PIN01</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 text-blue-800">Delivered</span>
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-[#00C853] flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 fill-[#00C853]" />
                    Document Security Audit
                  </span>
                  <span className="text-[9px] text-[#00C853] font-mono">SCANNING...</span>
                </div>
                <div className="text-[10px] text-gray-600 leading-normal">
                  Uploaded files matching NIN requirements are checked for clarity before deployment to FGN / school databases. Safe, secure, and compliant.
                </div>
              </div>
            </div>

            {/* Simulated Live User feed */}
            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center uppercase">
                  O
                </div>
                <div className="text-[10px]">
                  <span className="font-bold text-gray-800">Ola Williams</span> just verified NPC cert!
                </div>
              </div>
              <span className="text-[9.5px] font-mono text-[#00C853] font-extrabold flex items-center gap-1">
                ✓ Approved
              </span>
            </div>

            {/* Quick action button inside mockup */}
            <button
              onClick={onOpenDashboard}
              className="w-full mt-4 bg-gray-900 text-white hover:bg-[#00C853] transition-colors font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              id="hero-mockup-action"
            >
              <LayoutDashboard className="w-4 h-4" />
              Launch Active Upload Desk
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Aesthetic decorative shield graphic */}
          <div className="absolute -bottom-6 -left-6 bg-white border border-gray-150 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-20">
            <div className="w-8 h-8 rounded-full bg-[#00C853] text-white flex items-center justify-center">
              ✓
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500">TRUST RATING</div>
              <div className="text-xs font-extrabold text-gray-900">NIGERIA STANDARD</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

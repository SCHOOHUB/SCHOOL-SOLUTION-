import React from "react";
import { Shield, ArrowUp } from "lucide-react";

interface FooterProps {
  scrollToSection: (id: string) => void;
  setActiveTab: (tab: "home" | "dashboard") => void;
}

export default function Footer({ scrollToSection, setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string) => {
    setActiveTab("home");
    setTimeout(() => {
      scrollToSection(id);
    }, 100);
  };

  return (
    <footer className="bg-gray-905 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800" id="footer-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-gray-800 pb-10">
        
        {/* Left Side Brand Info (Cols 6) */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLinkClick("hero")}>
            <div className="w-10 h-10 rounded-xl bg-[#00C853] flex items-center justify-center text-white font-extrabold shadow shadow-[#00C853]/25">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                MYSOLUTION <span className="text-[#00C853]">HUB</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#00C853] uppercase leading-none block mt-1">
                FAST • RELIABLE • PROFESSIONAL
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            MYSOLUTION HUB is Nigeria's most reliable and responsive digital support agency. Grouping years of academic registration experience, corporate CAC compliance checks, immigration, and customized printing systems into an online workspace.
          </p>
        </div>

        {/* Right Side Links Grid (Cols 6) */}
        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div>
            <h4 className="text-[#00C853] font-mono font-extrabold text-[10px] uppercase tracking-wider mb-3">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs text-gray-450 font-medium">
              <li>
                <button onClick={() => handleLinkClick("hero")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("services")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("why-us")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Why Us
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("how-it-works")} className="hover:text-white transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Special Channels */}
          <div>
            <h4 className="text-gray-400 font-mono font-bold text-[10px] uppercase tracking-wider mb-3">
              Help Channels
            </h4>
            <ul className="space-y-2 text-xs text-gray-450 font-medium">
              <li>
                <button onClick={() => handleLinkClick("testimonials")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Clients reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("contact")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Verify Office Info
                </button>
              </li>
              <li>
                <a 
                  href="https://wa.me/2349041818917?text=Hello%20MYSOLUTION%20HUB%2C%20I%20have%28questions%29" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="hover:text-[#00C853] transition-colors"
                >
                  WhatsApp Helpline
                </a>
              </li>
            </ul>
          </div>

          {/* Fast Switchers */}
          <div className="col-span-full sm:col-span-1">
            <h4 className="text-indigo-400 font-mono font-bold text-[10px] uppercase tracking-wider mb-3">
              Interactives
            </h4>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all block text-center shadow"
            >
              Verification Desk
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto py-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-[11px] text-gray-400">
        <div>
          &copy; {currentYear} MYSOLUTION HUB. All rights reserved. Registered liaison partner.
        </div>
        <div className="flex gap-4 items-center font-semibold text-gray-450">
          <span>Fast</span>
          <span>•</span>
          <span>Reliable</span>
          <span>•</span>
          <span>Professional</span>
          <span>•</span>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
            className="p-1 px-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-1 cursor-pointer"
            title="Go to Top"
          >
            Top
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { CheckCircle, Shield, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

interface NavigationProps {
  activeTab: "home" | "dashboard";
  setActiveTab: (tab: "home" | "dashboard") => void;
  scrollToSection: (id: string) => void;
}

export default function Navigation({ activeTab, setActiveTab, scrollToSection }: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Services", id: "services" },
    { label: "Why Us", id: "why-us" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Reviews", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    setActiveTab("home");
    setIsOpen(false);
    setTimeout(() => {
      scrollToSection(id);
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab("home")} 
          className="flex items-center gap-2 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00C853] flex items-center justify-center shadow-lg shadow-[#00C853]/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 block leading-none">
              MYSOLUTION <span className="text-[#00C853]">HUB</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase leading-none block mt-1">
              • FAST • RELIABLE • PROFESSIONAL •
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-sm font-semibold text-gray-650 hover:text-[#00C853] transition-colors cursor-pointer"
              id={`nav-link-${link.id}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Button: Dashboard Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === "home" ? "dashboard" : "home")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-[#00C853] text-white hover:bg-[#00E676] shadow-md shadow-[#00C853]/15"
            }`}
            id="nav-action-btn"
          >
            {activeTab === "dashboard" ? (
              <>
                <CheckCircle className="w-4.5 h-4.5" />
                Back to Website
              </>
            ) : (
              <>
                <LayoutDashboard className="w-4.5 h-4.5" />
                Verification Desk
              </>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === "home" ? "dashboard" : "home")}
            className="sm:hidden p-2 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100"
            title="Dashboard"
            id="mobile-dash-btn"
          >
            <LayoutDashboard className="w-5 h-5 text-[#00C853]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl px-4 py-6 flex flex-col gap-4"
          id="mobile-drawer"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="w-full text-left py-3 px-4 rounded-xl text-base font-bold text-gray-700 hover:bg-[#00C853]/5 hover:text-[#00C853] transition-all cursor-pointer"
              id={`mobile-nav-link-${link.id}`}
            >
              {link.label}
            </button>
          ))}
          <div className="h-[1px] bg-gray-100 my-1"></div>
          <button
            onClick={() => {
              setActiveTab(activeTab === "home" ? "dashboard" : "home");
              setIsOpen(false);
            }}
            className="w-full py-3 px-4 rounded-xl text-base font-extrabold text-white bg-[#00C853] hover:bg-[#00E676] flex items-center justify-center gap-2 shadow-md shadow-[#00C853]/15 cursor-pointer"
            id="mobile-drawer-dashboard"
          >
            {activeTab === "dashboard" ? "Back to Website" : "Open Verification Desk"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </nav>
  );
}

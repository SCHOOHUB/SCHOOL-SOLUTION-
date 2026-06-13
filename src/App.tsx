import React from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import StatsBanner from "./components/StatsBanner";
import ServicesSection from "./components/ServicesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [activeTab, setActiveTab ] = React.useState<"home" | "dashboard">("home");
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);

  // Smooth scroll handler which supports iframe structures nicely
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // When a user selects a service from the landing grid
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveTab("dashboard");
    // Scroll to dashboard top nicely
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDashboardOnly = () => {
    setSelectedServiceId(null);
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#00C853]/40 selection:text-gray-900 overflow-x-hidden">
      {/* Dynamic Header navbar */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        scrollToSection={scrollToSection} 
      />

      {activeTab === "home" ? (
        <div id="home-view-wrapper">
          {/* Main Hero block */}
          <HeroSection 
            onOpenDashboard={handleOpenDashboardOnly} 
            onScrollToServices={() => scrollToSection("services")} 
          />

          {/* Social proof banner metrics */}
          <StatsBanner />

          {/* Attractive categorised bento-grid Services */}
          <ServicesSection onSelectService={handleSelectService} />

          {/* Core values block */}
          <WhyChooseUs />

          {/* Digital client progression steps */}
          <HowItWorks />

          {/* Success review comments block */}
          <Testimonials />

          {/* Offline query filing map placeholders */}
          <ContactSection />
        </div>
      ) : (
        /* Workspace Document Verification active desk */
        <div id="dashboard-view-wrapper">
          <Dashboard 
            initialServiceId={selectedServiceId} 
            onClose={() => setActiveTab("home")} 
          />
        </div>
      )}

      {/* Global Brand Footer */}
      <Footer 
        scrollToSection={scrollToSection} 
        setActiveTab={setActiveTab} 
      />

      {/* Conversion Booster Fixed Icon */}
      <FloatingWhatsApp />
    </div>
  );
}

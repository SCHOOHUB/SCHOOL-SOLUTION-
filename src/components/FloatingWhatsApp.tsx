import React from "react";
import { MessageSquare } from "lucide-react";

export default function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/2349041818917?text=Hello%20MYSOLUTION%20HUB%2C%20I%20need%20assistance%20with%20digital%20verification.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      referrerPolicy="no-referrer"
      className="fixed bottom-6 right-6 z-40 bg-[#00C853] hover:bg-[#00E676] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border border-white/20"
      title="Chat on WhatsApp"
      id="floating-whatsapp-trigger"
    >
      <MessageSquare className="w-6 h-6 fill-current animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-36 group-hover:ml-2 font-extrabold text-sm transition-all whitespace-nowrap">
        Chat with Us
      </span>
    </a>
  );
}

import React from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, ClipboardCheck } from "lucide-react";

export default function ContactSection() {
  const whatsappUrl = "https://wa.me/2349041818917?text=Hello%20MYSOLUTION%20HUB%2C%20I%20have%20questions%20regarding%20document%20processing.";

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Block: Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between" id="contact-details-panel">
            <div>
              <span className="text-[#00C853] bg-[#00C853]/10 font-extrabold text-xs tracking-widest uppercase px-3 py-1 rounded-full border border-[#00C853]/10">
                Liaison Desk
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                MYSOLUTION HUB
              </h2>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-emerald-700 uppercase block mt-1">
                FAST • RELIABLE • PROFESSIONAL
              </span>
              <p className="mt-4 text-xs sm:text-sm text-gray-550 leading-relaxed">
                Connect with our team to resolve application errors, speed up delayed NIM/CAC files, or order custom mass printing services nationwide in Nigeria.
              </p>
            </div>

            <div className="mt-8 space-y-4" id="contact-items">
              {/* WhatsApp Item */}
              <a 
                href={whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-xl hover:border-[#00C853] hover:shadow-sm transition-all"
                id="contact-whatsapp-link"
              >
                <div className="w-10 h-10 bg-[#00C853]/10 rounded-xl flex items-center justify-center text-[#00C853] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase leading-none">WhatsApp Desk Channel</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-1 block">09041818917</span>
                </div>
              </a>

              {/* Email */}
              <div className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-xl">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase leading-none">Email Assistance</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-1 block">submit@mysolutionhub.com.ng</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-xl">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase leading-none">Administrative Calendar</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-1 block">Mon - Sat: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Instant Live Ask Card */}
          <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-6.5 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden" id="contact-form-panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C853]/5 rounded-bl-full pointer-events-none"></div>

            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-gray-950 tracking-tight">
                Submit an Instant Inquiry Memo
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Fill in what document problem you are experiencing, and we will prepare a dedicated liaison profile for you.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-800">Your Surname & Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Adebayo Daniel"
                      className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#00C853] outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-800">WhatsApp Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 08012345678"
                      className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#00C853] outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-800">Select Issue Category</label>
                  <select className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-850 focus:bg-white focus:border-[#00C853] outline-none">
                    <option>Examination PIN Failure</option>
                    <option>NIN Modify Correction WaitTime</option>
                    <option>CAC Business Name query assistance</option>
                    <option>Bulk corporate mass printing quotes</option>
                    <option>Visa profile creation guidance</option>
                    <option>Other complex digital matters</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-800">Elaborate details of the issue</label>
                  <textarea 
                    rows={3}
                    placeholder="Write clearly here..."
                    className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs text-secondary focus:bg-white focus:border-[#00C853] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-5 flex items-center justify-between flex-wrap gap-4">
              <span className="text-[10px] font-mono text-gray-400 capitalize">
                ✓ No registration cost is charged for simple inquiries.
              </span>
              <a 
                href={whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="bg-gray-905 text-white hover:bg-[#00C853] transition-all font-extrabold text-xs py-3 px-6 rounded-xl flex items-center gap-2 shadow"
                id="contact-submit-inquiry"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Dispatch via WhatsApp Desk
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

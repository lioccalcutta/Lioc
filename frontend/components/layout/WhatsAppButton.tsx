"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { getWhatsAppUrl, WhatsAppContext } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/config";

interface WhatsAppButtonProps {
  context?: WhatsAppContext;
  productName?: string;
  sku?: string;
}

export default function WhatsAppButton({
  context = "general",
  productName,
  sku,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = getWhatsAppUrl({
    context,
    productName,
    sku,
  });

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      {/* Interactive Quick Help Bubble */}
      {isOpen && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex justify-between items-start pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-slate-950 to-teal-950 flex items-center justify-center border border-slate-700 p-0.5 flex-shrink-0 shadow-sm">
                <Image
                  src="/logo-symbol.png"
                  alt="LIOC Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {SITE_CONFIG.companyName} B2B Help Desk
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>Online • Quick Response</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 my-3 leading-relaxed">
            Need urgent bulk pricing, chemical data sheets, or sample kits for your Kolkata facility? Chat with our commercial sales team directly.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all duration-200"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-white text-white" />
        <span className="text-xs font-bold tracking-wide pr-1">
          WhatsApp Sales
        </span>
      </button>
    </div>
  );
}

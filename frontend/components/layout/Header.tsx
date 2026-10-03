"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  FileText,
  Package,
  ShieldCheck,
  ChevronRight,
  Instagram,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: t("nav.home", "Home"), href: "/" },
    { name: t("nav.products", "Products"), href: "/products" },
    { name: t("nav.industries", "Industries"), href: "/industries" },
    { name: t("nav.about", "About Us"), href: "/about" },
    { name: t("nav.leadership", "Leadership"), href: "/leadership" },
    { name: t("nav.dealerships", "Dealerships"), href: "/become-distributor" },
    { name: t("nav.contact", "Contact"), href: "/contact" },
  ];



  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Bar for B2B Quick Contacts */}
      <div className="bg-lioc-navy text-slate-300 text-xs py-2 px-4 border-b border-slate-700/50 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-lioc-tealLight" />
              <span>{t("topbar.mfg_supply", `Direct Manufacturing & Supply: ${SITE_CONFIG.primaryRegion}`)}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lioc-tealLight" />
              <span>{t("topbar.commercial_grade", "Commercial & Institutional Grade Hygiene")}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-lioc-tealLight" />
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9+]/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {SITE_CONFIG.phone}
              </a>
              <span className="text-slate-500">/</span>
              <a
                href={`tel:${SITE_CONFIG.secondaryPhone.replace(/[^0-9+]/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {SITE_CONFIG.secondaryPhone}
              </a>
            </div>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-lioc-tealLight" />
              <span>{SITE_CONFIG.email}</span>
            </a>
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 border border-pink-500/30 transition-all font-medium"
            >
              <Instagram className="w-3 h-3 text-pink-400" />
              <span>{SITE_CONFIG.instagramHandle}</span>
            </a>
            <LanguageSelector variant="topbar" />
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-teal-900/60 text-slate-300 hover:text-teal-300 border border-slate-700 hover:border-teal-500/50 transition-all font-semibold"
            >
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>{t("topbar.admin_login", "Admin Login")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200"
            : "bg-white py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 sm:space-x-3.5 group flex-shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md shadow-teal-950/20 group-hover:scale-105 transition-transform bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center border-2 border-slate-800/90 ring-1 ring-teal-500/20 p-1 flex-shrink-0">
              <Image
                src="/logo-symbol.png"
                alt="LIOC Commercial Hygiene Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain filter drop-shadow"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 leading-none">
                  LIOC<span className="text-teal-600">.</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200/80 rounded">
                  Chemical Mfg
                </span>
              </div>
              <span className="text-[10px] sm:text-[11.5px] font-extrabold uppercase tracking-wider text-teal-800 mt-1">
                {t("brand.tagline", "Chemical Manufacturer & B2B Supply")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "text-lioc-teal bg-teal-50"
                      : "text-slate-700 hover:text-lioc-navy hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Header Action Buttons (CTA) */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/request-sample"
              className="px-3.5 py-2 text-xs font-bold text-lioc-navy bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center space-x-1.5"
            >
              <Package className="w-3.5 h-3.5 text-lioc-teal" />
              <span>{t("cta.get_sample", "Get Free Sample")}</span>
            </Link>
            <Link
              href="/request-quote"
              className="px-4 py-2 text-xs font-bold text-white bg-lioc-teal hover:bg-lioc-tealDark rounded-lg shadow-sm shadow-teal-600/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t("cta.request_quote", "Request Quote")}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/request-quote"
              className="px-3 py-1.5 text-xs font-bold text-white bg-lioc-teal rounded-lg sm:hidden"
            >
              {t("cta.request_quote", "Quote")}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-lioc-navy rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-slate-900/60 backdrop-blur-sm z-40">
          <div className="bg-white w-full max-w-sm ml-auto h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="mb-4 pb-4 border-b border-slate-100">
                <LanguageSelector variant="mobile" />
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Navigation
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-teal-50 text-lioc-teal"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                <Link
                  href="/request-quote"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-lioc-teal text-white rounded-lg font-bold text-sm shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t("cta.request_bulk_quote", "Request Bulk Quote")}</span>
                </Link>
                <Link
                  href="/request-sample"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-100 text-lioc-navy rounded-lg font-bold text-sm border border-slate-200"
                >
                  <Package className="w-4 h-4 text-lioc-teal" />
                  <span>{t("cta.get_sample", "Request Free Sample Kit")}</span>
                </Link>
                <a
                  href={getWhatsAppUrl({ context: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-sm"
                >
                  <span>{t("cta.chat_whatsapp", "Chat on WhatsApp")}</span>
                </a>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white rounded-lg font-bold text-sm shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow on Instagram ({SITE_CONFIG.instagramHandle})</span>
                </a>
                <Link
                  href="/admin/login"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 text-slate-200 hover:text-white rounded-lg font-bold text-xs border border-slate-800"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t("topbar.admin_login", "CEO / Admin Login")}</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="font-semibold text-slate-700">{SITE_CONFIG.companyName} Commercial Sales</div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span>Phone:</span>
                <a href={`tel:${SITE_CONFIG.phone.replace(/[^0-9+]/g, "")}`} className="text-lioc-teal font-medium hover:underline">
                  {SITE_CONFIG.phone}
                </a>
                <span>,</span>
                <a href={`tel:${SITE_CONFIG.secondaryPhone.replace(/[^0-9+]/g, "")}`} className="text-lioc-teal font-medium hover:underline">
                  {SITE_CONFIG.secondaryPhone}
                </a>
              </div>
              <div>Email: {SITE_CONFIG.email}</div>
              <div>{SITE_CONFIG.address}</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

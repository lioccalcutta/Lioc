"use client";

import React from "react";
import Link from "next/link";

import Image from "next/image";
import {
    MapPin,
  Phone,
  Mail, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  CheckCircle2,
  Instagram,

} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lioc-navy text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-300">
          <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-lioc-tealLight flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-sm">{t("values.commercial_grade", "Commercial Grade")}</h4>
              <p className="text-xs text-slate-400 mt-1">{t("values.commercial_grade_desc", "High-potency institutional formulations for daily hygiene.")}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <Truck className="w-6 h-6 text-lioc-tealLight flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-sm">{t("values.direct_supply", "Direct Supply")}</h4>
              <p className="text-xs text-slate-400 mt-1">{t("values.direct_supply_desc", "Fast reliable delivery in Kolkata & surrounding industrial hubs.")}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <Award className="w-6 h-6 text-lioc-tealLight flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-sm">{t("values.bulk_cost", "Bulk Cost Efficiency")}</h4>
              <p className="text-xs text-slate-400 mt-1">{t("values.bulk_cost_desc", "High-dilution concentrates reducing per-liter cleaning costs.")}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-lioc-tealLight flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-sm">{t("values.free_samples", "Free Sample Trials")}</h4>
              <p className="text-xs text-slate-400 mt-1">{t("values.free_samples_desc", "Evaluation kits available for commercial decision makers.")}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center border border-slate-700/80 p-0.5 flex-shrink-0">
                <Image
                  src="/logo-symbol.png"
                  alt="LIOC Commercial Hygiene Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                LIOC<span className="text-lioc-tealLight">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              LIOC is a direct chemical manufacturer and institutional supplier of high-performance commercial cleaning formulations, heavy-duty floor soaps, air care, and facility hygiene products engineered for hotels, restaurants, hospitals, schools, and offices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={getWhatsAppUrl({ context: "general" })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>WhatsApp Sales Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram {SITE_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Products & Catalog */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("footer.formulations", "Formulations & Catalog")}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products?category=floor-cleaners" className="hover:text-lioc-tealLight transition-colors">
                  Floor Cleaners & Surface Care
                </Link>
              </li>
              <li>
                <Link href="/products?category=toilet-washroom" className="hover:text-lioc-tealLight transition-colors">
                  Toilet & Washroom Hygiene
                </Link>
              </li>
              <li>
                <Link href="/products?category=air-fresheners" className="hover:text-lioc-tealLight transition-colors">
                  Air Fresheners & Deodorizers
                </Link>
              </li>
              <li>
                <Link href="/products?category=kitchen-degreasers" className="hover:text-lioc-tealLight transition-colors">
                  Kitchen & Degreasers
                </Link>
              </li>
              <li>
                <Link href="/products?category=hand-hygiene" className="hover:text-lioc-tealLight transition-colors">
                  Hand Hygiene & Guest Amenities
                </Link>
              </li>
              <li>
                <Link href="/products?category=cleaning-tools" className="hover:text-lioc-tealLight transition-colors">
                  Janitorial Tools & Equipment
                </Link>
              </li>
              <li>
                <Link href="/products?category=pest-control" className="hover:text-lioc-tealLight transition-colors">
                  Pest Defense & Storage Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries We Serve */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("footer.industries", "Industries We Serve")}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/industries/hotels-guest-houses" className="hover:text-lioc-tealLight transition-colors">
                  Hotels & Guest Houses
                </Link>
              </li>
              <li>
                <Link href="/industries/restaurants-cafes" className="hover:text-lioc-tealLight transition-colors">
                  Restaurants & Cloud Kitchens
                </Link>
              </li>
              <li>
                <Link href="/industries/schools-colleges" className="hover:text-lioc-tealLight transition-colors">
                  Schools & Educational Institutes
                </Link>
              </li>
              <li>
                <Link href="/industries/corporate-offices" className="hover:text-lioc-tealLight transition-colors">
                  Corporate Offices & IT Parks
                </Link>
              </li>
              <li>
                <Link href="/industries/facility-management" className="hover:text-lioc-tealLight transition-colors">
                  Commercial Facility Cleaners
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Contact & Leads */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("footer.b2b_inquiries", "B2B Inquiries & Logistics")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-lioc-tealLight flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href={SITE_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-300 transition-colors block"
                    title="Open in Google Maps"
                  >
                    <span>{SITE_CONFIG.address}</span>
                    <span className="text-[10px] text-teal-400 block font-semibold hover:underline mt-0.5">
                      📍 {t("cta.open_in_google_maps", "View on Google Maps")} ↗
                    </span>
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-lioc-tealLight flex-shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-0.5">
                  <a href={`tel:${SITE_CONFIG.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                  <a href={`tel:${SITE_CONFIG.secondaryPhone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                    {SITE_CONFIG.secondaryPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-lioc-tealLight flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-300 transition-colors font-medium flex items-center gap-1"
                >
                  <span>{SITE_CONFIG.instagramHandle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">Official</span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-lioc-tealLight flex-shrink-0" />
                <span>{SITE_CONFIG.businessHours}</span>
              </li>
            </ul>
            <div className="mt-4 flex flex-col space-y-2">
              <Link
                href="/request-quote"
                className="text-xs font-semibold text-lioc-tealLight hover:underline flex items-center space-x-1"
              >
                <span>{t("cta.request_bulk_quote", "Request Wholesale Quotation")}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/become-distributor"
                className="text-xs font-semibold text-lioc-tealLight hover:underline flex items-center space-x-1"
              >
                <span>{t("cta.dealership_inquiries", "Dealership & Distributor Inquiries")}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div>
          © {currentYear} {SITE_CONFIG.companyName}. {t("footer.rights", "All rights reserved. Commercial Cleaning & Hygiene Solutions.")}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <LanguageSelector variant="footer" />
          <span className="text-slate-700">|</span>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            {t("footer.privacy", "Privacy Policy")}
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            {t("footer.terms", "Terms & Conditions")}
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            {t("footer.about_co", "About Company")}
          </Link>
          <Link href="/leadership" className="hover:text-teal-300 transition-colors font-medium">
            {t("nav.leadership", "Leadership & Founders")}
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            {t("footer.contact_us", "Contact Us")}
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/admin/login"
            className="text-slate-400 hover:text-teal-300 transition-colors flex items-center space-x-1"
          >
            <span>🔒 {t("topbar.admin_login", "Admin Login")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}


import React from "react";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import ProductCatalogView from "@/components/products/ProductCatalogView";
import { Sparkles, Package, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Commercial Cleaning Products Catalog",
  description:
    "Explore Lioc's commercial cleaning formulations including floor cleaners, toilet descalers, streak-free glass cleaners, antibacterial hand wash, and kitchen degreasers.",
};

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    industry?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, industries, products] = await Promise.all([
    api.getCategories(),
    api.getIndustries(),
    api.getProducts({
      category: searchParams?.category,
      industry: searchParams?.industry,
      search: searchParams?.search,
    }),
  ]);

  return (
    <div className="py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Commercial & Institutional Grade Formulas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Commercial Cleaning Formulations & Bulk Supplies
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formulated specifically for high-footfall hotels, restaurants, schools, and corporate facilities in Kolkata and surrounding regions. Direct factory packaging available in 5L, 20L cans, and 50L drums.
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Evaluation & Custom Formulations Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-500/10 via-emerald-50 to-teal-50 border border-teal-500/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-teal-600 text-white rounded-xl shrink-0 shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Need Commercial Sample Evaluation or Custom Batch Formulation?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Request commercial evaluation kits or direct wholesale factory pricing for your facility.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/request-sample"
              className="px-4 py-2 bg-white border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              Request Sample Kit
            </Link>
            <Link
              href="/request-quote"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              Request Bulk Quote →
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalogView
          initialProducts={products}
          categories={categories}
          industries={industries}
          initialCategory={searchParams?.category || ""}
          initialIndustry={searchParams?.industry || ""}
        />
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-teal-50 rounded-3xl p-8 border border-teal-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-lioc-navy">Need Custom Formulation or 50L+ Drum Pricing?</h3>
            <p className="text-xs text-slate-600">
              Our chemical technical team can assist with specialized dilution setups and institutional pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-sample"
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-lioc-navy text-xs font-bold rounded-xl border border-slate-300 transition-all shadow-sm"
            >
              Get Evaluation Sample
            </Link>
            <Link
              href="/request-quote"
              className="px-5 py-2.5 bg-lioc-teal hover:bg-lioc-tealDark text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

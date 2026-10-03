import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Droplets,
  Factory,
  FlaskConical,
  Layers,
  Package,
  Instagram,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";


export const metadata: Metadata = {
  title: "About LIOC | Direct Chemical Manufacturer & B2B Commercial Supplier",
  description:
    "Learn about LIOC—a premier chemical manufacturing enterprise providing institutional cleaning formulations, heavy-duty surface soaps, and wholesale hygiene solutions in Kolkata and Eastern India.",
};

export default function AboutPage() {
  return (
    <div className="py-12 space-y-16">
      {/* Hero Banner */}
      <div className="bg-lioc-navy text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 border-2 border-slate-700/80 p-2">
              <Image
                src="/logo-symbol.png"
                alt="LIOC Official Logo"
                width={96}
                height={96}
                className="w-full h-full object-contain rounded-2xl"
                priority
              />
            </div>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Factory className="w-3.5 h-3.5" />
            <span>Direct Chemical Manufacturing & Institutional Wholesale</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            About {SITE_CONFIG.companyName}
          </h1>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Formulating and manufacturing high-potency, surface-safe, and cost-efficient cleaning chemicals for commercial facilities, hotels, restaurants, schools, healthcare centers, and corporate facilities.
          </p>
        </div>
      </div>

      {/* Mission & Purpose */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider">
              <span>Our Manufacturing Identity</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy leading-tight">
              More Than a B2B Supplier — A Direct Chemical Manufacturer
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              LIOC operates a dual-engine model in the commercial hygiene sector: we are an **in-house chemical manufacturer** with direct formulation, batch testing, and automated bottling lines, as well as a **comprehensive B2B institutional supplier** providing end-to-end hotel guest amenities, janitorial hardware, and pest management.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              By removing middleman markups, LIOC gives commercial facilities direct access to high-concentration chemical formulations that yield hundreds of usable liters per can. Based in <span className="font-bold text-slate-800">Kolkata, West Bengal</span>, our facility supplies high-footfall venues across Eastern India and nationwide.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-lioc-navy">Direct Manufacturing</h4>
              <p className="text-xs text-slate-500">In-house formulation, rigorous TDS/MSDS testing, and automated filling.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-lioc-navy">Prompt Logistics</h4>
              <p className="text-xs text-slate-500">Same-day and 24h direct factory dispatch across Kolkata & Eastern India.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-lioc-navy">Surface-Safe Science</h4>
              <p className="text-xs text-slate-500">Formulated safe for expensive marble, granite, epoxy, glass, and steel.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-lioc-navy">High-Yield Economy</h4>
              <p className="text-xs text-slate-500">1:100 to 1:150 high dilution concentrates saving up to 40% cleaning costs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing Capabilities Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-lioc-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Plant & Laboratory Facilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Industrial Packaging & Custom OEM Contract Formulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We cater to institutional procurement requirements ranging from standard 5L Cans to 20L Jerry Cans, 50L Drums, and 200L Industrial Barrels, with custom fragrance profiling and private label packaging for hotel chains and facility contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Layers className="w-6 h-6 text-teal-300" />
              <h4 className="font-bold text-base text-white">Bulk Drum Packaging</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cost-effective 50L and 200L bulk barrel supply with on-site dilution dispensing charts for facility cleaning crews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <FlaskConical className="w-6 h-6 text-teal-300" />
              <h4 className="font-bold text-base text-white">OEM & Private Labeling</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Custom chemical blending, viscosity adjustments, and customized brand labeling for large hospitality groups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Package className="w-6 h-6 text-teal-300" />
              <h4 className="font-bold text-base text-white">Complete B2B Sourcing</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consolidate your entire purchase orders: liquid cleaners, room sprays, guest amenity soaps, mops, and pest repellents in a single invoice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team Spotlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Founding Vision</span>
            </div>
            <h3 className="text-2xl font-black text-lioc-navy">
              Meet the Founder & Co-Founder of LIOC
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Learn more about the chemical engineering vision, manufacturing leadership, and commercial supply chain infrastructure established by our founders.
            </p>
          </div>
          <Link
            href="/leadership"
            className="px-6 py-3.5 bg-lioc-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <span>View Leadership & Founders</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>
      </div>

      {/* Target Sectors */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4 mb-12">

          <h2 className="text-2xl sm:text-3xl font-black text-lioc-navy">
            Institutional Sectors We Serve
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From 100-room luxury hotels and hospitals to large corporate IT campuses and commercial facility crews.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <Building2 className="w-8 h-8 text-lioc-teal mx-auto" />
            <div className="text-xs font-bold text-slate-800">Hotels & Guest Houses</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <Droplets className="w-8 h-8 text-lioc-teal mx-auto" />
            <div className="text-xs font-bold text-slate-800">Restaurants & Cloud Kitchens</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-lioc-teal mx-auto" />
            <div className="text-xs font-bold text-slate-800">Hospitals & Schools</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <Factory className="w-8 h-8 text-lioc-teal mx-auto" />
            <div className="text-xs font-bold text-slate-800">Offices & Facility Cleaners</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-lioc-navy text-white rounded-3xl p-10 max-w-3xl mx-auto space-y-6">
          <h3 className="text-2xl font-bold">Partner with LIOC Directly</h3>
          <p className="text-xs text-slate-300">
            Whether you require bulk supply for your premises or seek authorized dealership distribution rights, our technical sales team is ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/request-quote"
              className="px-6 py-3 bg-lioc-teal hover:bg-lioc-tealDark text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Request Bulk Factory Quote</span>
            </Link>
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow on Instagram</span>
            </a>
            <Link
              href="/become-distributor"
              className="px-6 py-3 bg-white text-lioc-navy hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Dealership Inquiries</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

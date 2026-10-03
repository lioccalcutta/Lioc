import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Droplets,
  Award,
  ArrowRight,
  Package,
  Building2,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Factory,
  CheckCircle2,
  FileText,
  MessageSquare,
  ChevronRight,
  Layers,
  Star,
} from "lucide-react";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ProductCard from "@/components/products/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";

export default async function HomePage() {
  const [categories, industries, featuredProducts] = await Promise.all([
    api.getCategories(),
    api.getIndustries(),
    api.getProducts({ featured: true, limit: 6 }),
  ]);

  const industryIcons: Record<string, any> = {
    "hotels-guest-houses": Building2,
    "restaurants-cafes": UtensilsCrossed,
    "schools-colleges": GraduationCap,
    "corporate-offices": Briefcase,
    "facility-management": Factory,
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Glow Accent Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-lioc-teal/20 to-lioc-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide backdrop-blur-md">
                <Factory className="w-4 h-4 text-lioc-tealLight" />
                <span>Direct Chemical Manufacturer & B2B Commercial Supplier</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Professional Cleaning & Hygiene Formulations for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-cyan-300">Modern Facilities</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                In-house chemical manufacturing, custom OEM formulation, and bulk institutional supplies for hotels, restaurants, hospitals, schools, and corporate complexes in <span className="text-white font-semibold">Kolkata & across India</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="px-8 py-4 rounded-xl bg-lioc-teal hover:bg-lioc-tealLight text-white font-bold text-sm shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Explore Product Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request-quote"
                  className="px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Get Wholesale Pricing</span>
                </Link>
              </div>

              {/* Discreet Executive Login Link */}
              <div className="pt-2 flex items-center justify-center lg:justify-start">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-400 hover:text-teal-300 border border-slate-700/80 text-[11px] font-semibold transition-all shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>CEO & Executive Portal Login →</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">1:150+</div>
                  <div className="text-[11px] text-slate-400 font-medium">High Dilution Yield</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">24-48h</div>
                  <div className="text-[11px] text-slate-400 font-medium">Dispatch in Kolkata</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Commercial Grade</div>
                </div>
              </div>
            </div>

            {/* Right Card / Quick Quote Teaser */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-teal-300" />
                    <span className="text-sm font-bold">Free Commercial Sample Kit</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full">
                    For Businesses
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Evaluate Lioc floor cleaners, bathroom descalers, and kitchen degreasers at your facility before issuing a bulk order.
                </p>
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    <span>Free door-step delivery to commercial facilities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    <span>Includes dilution chart and chemical data sheets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    <span>No purchase obligation</span>
                  </div>
                </div>
                <Link
                  href="/request-sample"
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-lioc-navy font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <span>Request Free Sample Kit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider mb-2">
            <span>Specialized Formulations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy">
            Comprehensive Cleaning & Hygiene Catalog
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered for high footfall institutions and demanding commercial environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-card hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-lioc-teal text-lioc-teal group-hover:text-white flex items-center justify-center transition-colors mb-4 shadow-sm">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-lioc-navy group-hover:text-lioc-teal transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-lioc-teal">
                <span>View Products</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Direct Manufacturing & Bulk Wholesale Supply Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-lioc-navy via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Direct Factory & Institutional Supply</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Direct Manufacturer Wholesale Supply for Commercial Facilities
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Source commercial-grade floor cleaners, disinfectants, washroom descalers, and janitorial supplies directly from our Kolkata manufacturing facility with certified batch quality and instant bulk quotation.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:justify-end">
              <Link
                href="/request-quote"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-teal-500/30 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <span>Request Wholesale Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all text-center"
              >
                Browse Full Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Commercial Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider mb-2">
              <span>High-Demand Bulk Formulations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-lioc-navy">
              Featured Commercial Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Top-selling solutions trusted by hotels, guest houses, restaurants, and facility crews.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-lioc-teal hover:text-lioc-tealDark"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Industries We Serve Section */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-100 text-lioc-teal text-xs font-bold uppercase tracking-wider mb-2">
              <span>Tailored Industry Regimens</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy">
              Hygiene Solutions Tailored for Every Sector
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Different facilities face unique cleaning hurdles. Discover customized product sets for your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industries.slice(0, 3).map((ind) => {
              const IconComponent = industryIcons[ind.slug] || Building2;
              return (
                <div
                  key={ind.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-lioc-navy">{ind.name}</h3>
                    <p className="text-xs font-medium text-lioc-teal">{ind.tagline}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{ind.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/industries/${ind.slug}`}
                      className="text-xs font-bold text-lioc-navy hover:text-lioc-teal flex items-center justify-between group"
                    >
                      <span>Explore {ind.name} Regimen</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/industries"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-lioc-navy rounded-xl border border-slate-300 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
            >
              <span>View All Industries (Schools, Offices, Facility Crews)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Lioc Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider">
              <span>The Lioc Commercial Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy leading-tight">
              Why Kolkata & Eastern India Businesses Rely on Lioc
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We eliminate middlemen margins and inconsistent quality by delivering factory-direct high-dilution chemical concentrates backed by full safety data.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Surface Safety & High Efficacy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Safe on expensive Italian marble, granite, epoxy floors, and stainless steel cookware without corrosion.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Reliable Regional Stocking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Never face stock-outs. We maintain steady inventory in 5L, 20L, and 50L drums for immediate dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Commercial Cost Reduction</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Concentrated formulas engineered for high dilution ratios (up to 1:150) dramatically reduce monthly housekeeping expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-lioc-navy text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Direct Commercial Inquiry</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Request a Customized Bulk Supply Quotation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fill our quick B2B form to receive wholesale pricing tailored for your commercial volume.
              </p>
              <div className="pt-2">
                <Link
                  href="/request-quote"
                  className="w-full py-3.5 px-6 rounded-xl bg-lioc-teal hover:bg-lioc-tealLight text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <span>Open B2B Quotation Form</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="pt-4 border-t border-slate-800 text-center">
                <span className="text-xs text-slate-400">Prefer instant messaging? </span>
                <a
                  href={getWhatsAppUrl({ context: "quote" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-teal-300 hover:underline"
                >
                  Chat with Sales on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Placeholder / Facility Experience */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold uppercase tracking-wider mb-2">
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy">
              Trusted by Leading Facilities & Cleaning Crews
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Feedback from hospitality, restaurant, and facility decision-makers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Lioc PowerShield toilet descaler solved our hard water scaling issues in guest bathrooms where retail brands consistently failed. The dilution yield on floor cleaner is also outstanding."
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs">
                <div className="font-bold text-lioc-navy">Operations Manager</div>
                <div className="text-slate-500">Boutique Hotel & Suites, Kolkata</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The KitchenMaster degreaser cut our chimney filter cleaning time in half. Very potent formula with food-service safe handling guidelines."
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs">
                <div className="font-bold text-lioc-navy">Executive Chef</div>
                <div className="text-slate-500">Multi-Outlet Cloud Kitchen Group</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Direct supply in 50L drums with prompt delivery in Salt Lake Sector V has streamlined our monthly facility inventory. Highly recommend their commercial grade products."
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs">
                <div className="font-bold text-lioc-navy">Facility Director</div>
                <div className="text-slate-500">Corporate IT Park, New Town</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Conversion CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-lioc-navy via-lioc-navyLight to-teal-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Ready to Upgrade Your Commercial Cleaning & Hygiene Standards?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect with Lioc today for factory-direct bulk pricing, free evaluation kits, or dealership inquiries across West Bengal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/request-quote"
                className="px-8 py-4 bg-lioc-teal hover:bg-lioc-tealLight text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Request a Bulk Quotation
              </Link>
              <a
                href={getWhatsAppUrl({ context: "urgent_bulk" })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import {
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  FlaskConical,
  Building2,
  Factory,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Home,
  Check,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await api.getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Commercial & Institutional Cleaning`,
    description: product.short_description,
    keywords: [
      product.name,
      product.category?.name || "Commercial Cleaning",
      "Kolkata cleaning chemical manufacturer",
      "Bulk cleaning chemicals wholesale supplier",
      "Direct chemical factory supply",
    ],
    openGraph: {
      title: `${product.name} - ${SITE_CONFIG.companyName}`,
      description: product.short_description,
    },
  };
}

const industryPlaceIcons: Record<string, any> = {
  "hotels-guest-houses": Building2,
  "restaurants-cafes": UtensilsCrossed,
  "schools-colleges": GraduationCap,
  "corporate-offices": Briefcase,
  "facility-management": Factory,
  "hospitals-healthcare": ShieldCheck,
  "residential-homes": Home,
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await api.getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const isLiocManufactured =
    product.name.toLowerCase().includes("lioc") ||
    (product.sku && product.sku.toUpperCase().startsWith("LIOC"));

  const whatsappUrl = getWhatsAppUrl({
    context: "product",
    productName: product.name,
    sku: product.sku || undefined,
  });

  const benefitsList = product.benefits
    ? product.benefits.split("\n").filter(Boolean)
    : [];

  const usageDirections = product.usage_instructions
    ? product.usage_instructions.split("\n").filter(Boolean)
    : [];

  return (
    <div className="py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-lioc-teal">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-lioc-teal">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-lioc-teal"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-slate-900 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Hero & Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              primaryImage={product.product_image}
              images={product.images || []}
              productName={product.name}
              isBestseller={Boolean(product.is_bestseller)}
              isLiocManufactured={Boolean(isLiocManufactured)}
            />

            <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono font-bold text-slate-700">SKU: {product.sku || "N/A"}</span>
              <span className="font-semibold text-emerald-700 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>Direct Batch In Stock • Ready for Bulk Dispatch</span>
              </span>
            </div>
          </div>

          {/* Right: Product Metadata & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="px-3 py-1 bg-teal-50 text-lioc-teal text-xs font-bold rounded-full border border-teal-200">
                    {product.category.name}
                  </span>
                )}
                {isLiocManufactured ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center space-x-1">
                    <Factory className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Factory Formulation & Bottling</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span>Institutional Wholesale Supply</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-lioc-navy mt-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                {product.short_description}
              </p>
            </div>

            {/* Packaging Sizes */}
            {product.available_sizes && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <Layers className="w-4 h-4 text-lioc-teal" />
                  <span>Available Commercial Packaging Sizes:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.available_sizes.split(",").map((size, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-lioc-navy shadow-2xs"
                    >
                      {size.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                className="flex-1 py-4 px-6 rounded-xl bg-lioc-teal hover:bg-lioc-tealDark text-white font-bold text-sm text-center shadow-md shadow-teal-700/20 transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Get Bulk Wholesale Quote</span>
              </Link>
              <Link
                href={`/request-sample?product=${encodeURIComponent(product.name)}`}
                className="py-4 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-lioc-navy font-bold text-sm text-center border border-slate-200 transition-all flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4 text-lioc-teal" />
                <span>Request Sample</span>
              </Link>
            </div>

            {/* WhatsApp Direct */}
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire on WhatsApp with Technical Support</span>
              </a>
            </div>

            {/* Target Industries Quick Badges */}
            {product.industries && product.industries.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Versatile Formulation Suitable For {product.industries.length}+ Sectors:
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.industries.map((ind) => {
                    const IconComp = industryPlaceIcons[ind.slug] || Building2;
                    return (
                      <Link
                        key={ind.id}
                        href={`/industries/${ind.slug}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center space-x-1.5 shadow-2xs"
                      >
                        <IconComp className="w-3.5 h-3.5 text-lioc-teal" />
                        <span>{ind.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Place Applications Detailed Section */}
      {product.industries && product.industries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-lioc-navy text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Place & Facility Versatility</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Where Can You Deploy {product.name}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Engineered for multi-environment performance. This formulation meets the rigorous hygiene standards of the following facilities:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {product.industries.map((ind) => {
                const IconComp = industryPlaceIcons[ind.slug] || Building2;
                return (
                  <div
                    key={ind.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between space-y-3 backdrop-blur-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-white">{ind.name}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {ind.tagline || ind.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-teal-300 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Recommended Solution</span>
                      </span>
                      <Link
                        href={`/industries/${ind.slug}`}
                        className="text-[11px] text-white/80 hover:text-white font-bold inline-flex items-center space-x-1"
                      >
                        <span>View Sector →</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Details Tabs / Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Full Description */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-lioc-teal" />
                <span>Product Overview & Chemical Performance</span>
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.full_description}
              </div>
            </div>

            {/* Benefits & Advantages */}
            {benefitsList.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Key Commercial & Facility Advantages</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {benefitsList.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Instructions & Dilution */}
            {usageDirections.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
                  <FlaskConical className="w-5 h-5 text-lioc-teal" />
                  <span>Usage Directions & Dilution Protocol</span>
                </h2>
                <div className="space-y-2.5 pt-2">
                  {usageDirections.map((step, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-700 leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Technical & Safety Specifications */}
          <div className="lg:col-span-4 space-y-6">
            {/* Technical Information & Specifications */}
            {product.technical_information && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-lioc-navy flex items-center space-x-2">
                    <FlaskConical className="w-4 h-4 text-lioc-teal" />
                    <span>Technical Specifications</span>
                  </h3>
                </div>
                <div className="space-y-2 text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-mono">
                  {product.technical_information}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Inquire About Custom Batch / TDS</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Safety Guidelines */}
            {product.safety_information && (
              <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 text-amber-950 space-y-3">
                <h3 className="text-base font-bold flex items-center space-x-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Safety & Handling Information</span>
                </h3>
                <p className="text-xs leading-relaxed text-amber-900/90 whitespace-pre-line">
                  {product.safety_information}
                </p>
              </div>
            )}

            {/* Direct Manufacturer Guarantee */}
            <div className="bg-gradient-to-br from-lioc-navy to-slate-900 text-white rounded-3xl p-6 space-y-3 border border-slate-800 shadow-md">
              <div className="flex items-center space-x-2">
                <Factory className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">LIOC Direct Manufacturer Guarantee</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulated, batch-tested, and packaged in our dedicated manufacturing facility. Available in 5L Cans, 20L Jerry Cans, 50L Drums, and 200L Barrels with custom OEM dilution setup and MSDS support.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-teal-300 font-semibold">
                <span>✓ Laboratory Batch Tested</span>
                <span>✓ OEM Customization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

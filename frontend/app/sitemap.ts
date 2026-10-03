import { MetadataRoute } from "next";
import { api } from "@/lib/api";

const STATIC_PUBLIC_ROUTES = [
  "",
  "/products",
  "/industries",
  "/about",
  "/leadership",
  "/contact",
  "/request-quote",
  "/request-sample",
  "/become-distributor",
  "/privacy-policy",
  "/terms",
];

const INDUSTRY_SLUGS = [
  "hotels-guest-houses",
  "restaurants-cafes",
  "schools-colleges",
  "corporate-offices",
  "facility-management",
  "hospitals-healthcare",
  "residential-homes",
];

const CATALOG_PRODUCT_SLUGS = [
  "lioc-white-herbal-floor-cleaner-5l",
  "lioc-heavy-duty-pink-floor-soap-5l",
  "industrial-caustic-soda-flakes",
  "commercial-bleaching-powder-disinfectant",
  "lioc-ultra-toilet-cleaner-5l",
  "sanifresh-urinal-toilet-cubes",
  "naphthalene-balls-500g",
  "harpic-disinfectant-bathroom-cleaner-floral",
  "lioc-jasmine-bloom-air-freshener-200ml",
  "lioc-sandal-air-freshener-200ml",
  "lioc-lavender-bloom-air-freshener-200ml",
  "lioc-litchi-air-freshener-200ml",
  "odonil-air-freshener-blocks-4pack",
  "odonil-room-spray-assorted-4pack",
  "lioc-ultra-dishwash-liquid-5l",
  "finch-hand-wash-rose-5l",
  "hotel-guest-amenities-grooming-kit-7in1",
  "hotel-guest-dental-kit-box",
  "hotel-guest-soap-white-10g",
  "hotel-disposable-shower-caps-waterproof",
  "hotel-luxury-linen-collection",
  "commercial-360-spin-mop-system",
  "commercial-kentucky-loop-end-string-mop",
  "gala-no-dust-floor-broom",
  "commercial-utility-bathroom-mugs-set",
  "milton-heavy-duty-plastic-bucket",
  "pest-control-anti-roach-spray",
  "godrej-goodknight-flash-liquid-vaporiser-machine",
  "duracell-aa-alkaline-batteries-12pack",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lioc.in";
  const now = new Date();

  let productSlugs = CATALOG_PRODUCT_SLUGS;
  try {
    const liveProducts = await api.getProducts({ limit: 100 });
    if (liveProducts && liveProducts.length > 0) {
      const fetchedSlugs = liveProducts.map((p) => p.slug).filter(Boolean);
      productSlugs = Array.from(new Set([...CATALOG_PRODUCT_SLUGS, ...fetchedSlugs]));
    }
  } catch {
    // API not reachable during static build, use default catalog list
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_PUBLIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/request") ? 0.9 : 0.8,
  }));

  const industryEntries: MetadataRoute.Sitemap = INDUSTRY_SLUGS.map((slug) => ({
    url: `${baseUrl}/industries/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...industryEntries, ...productEntries];
}

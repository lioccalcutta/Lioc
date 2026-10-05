export const SITE_CONFIG = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "LIOC",
  tagline: "Direct Chemical Manufacturer & B2B Commercial Hygiene Supplier",
  logoUrl: "/logo.jpeg",
  description:
    "LIOC manufactures and supplies high-performance commercial cleaning chemicals, heavy-duty floor soaps, descalers, air fresheners, and facility hygiene products for hotels, restaurants, schools, offices, hospitals, and industrial facilities across Kolkata and India.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9007381804",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "lioccalcutta@gmail.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+91 90073 81804",
  secondaryPhone: process.env.NEXT_PUBLIC_COMPANY_SECONDARY_PHONE || "+91 80134 51653",
  phoneNumbers: [
    { label: "Primary / WhatsApp", display: "+91 90073 81804", raw: "+919007381804" },
    { label: "Direct Line", display: "+91 80134 51653", raw: "+918013451653" },
  ],
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    "156, PGH Shah Road, Jadavpur, Kolkata - 700032, West Bengal, India",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/lioc_calcutta/",
  instagramHandle: "@lioc_calcutta",
  googleMapsUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    "https://maps.google.com/?q=156+PGH+Shah+Road,+Jadavpur,+Kolkata+-+700032",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=156%2C+PGH+Shah+Road%2C+Jadavpur%2C+Kolkata+700032&t=&z=15&ie=UTF8&iwloc=&output=embed",
  geo: {
    latitude: 22.4975,
    longitude: 88.3713,
  },
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  primaryRegion: "Kolkata & West Bengal (Pan-India Institutional Supply & OEM Available)",
  businessHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
};



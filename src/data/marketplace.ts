export const MARKETPLACE_SERVICES = [
  {
    slug: "halwai-caterers",
    providerCategory: "halwai_caterer",
    label: "Halwai & Caterers",
    shortLabel: "Catering",
    description: "Traditional halwais, wedding caterers, live counters and complete food service.",
    icon: "utensils",
    image: "/images/home/halwai-sweets.jpg",
  },
  {
    slug: "venues-banquet-halls",
    providerCategory: "venue_banquet",
    label: "Venues & Banquet Halls",
    shortLabel: "Venues",
    description: "Banquet halls, lawns and event spaces for celebrations of every size.",
    icon: "building",
    image: "/images/home/wedding-reception.jpg",
  },
  {
    slug: "decorators",
    providerCategory: "decorator",
    label: "Decorators",
    shortLabel: "Decor",
    description: "Wedding stages, floral concepts, lighting and complete event decor.",
    icon: "sparkles",
    image: "/images/home/festive-celebration.jpg",
  },
  {
    slug: "tent-houses",
    providerCategory: "tent_house",
    label: "Tent Houses",
    shortLabel: "Tent Houses",
    description: "Tents, seating, shamianas, lighting and outdoor event infrastructure.",
    icon: "tent",
    image: "/images/home/large-catering-setup.jpg",
  },
  {
    slug: "djs-music",
    providerCategory: "dj",
    label: "DJs & Music",
    shortLabel: "DJs",
    description: "DJs, sound systems and music experiences for every celebration.",
    icon: "music",
    image: "/images/home/birthday-catering.jpg",
  },
  {
    slug: "photography-videography",
    providerCategory: "photographer",
    label: "Photography & Videography",
    shortLabel: "Photo & Video",
    description: "Photography and filmmaking teams to preserve every important moment.",
    icon: "camera",
    image: "/images/home/guests-enjoying-food.jpg",
  },
  {
    slug: "makeup-artists",
    providerCategory: "makeup_artist",
    label: "Makeup Artists",
    shortLabel: "Makeup",
    description: "Bridal and occasion makeup artists with professional styling services.",
    icon: "brush",
    image: "/images/home/hero-luxury.jpg",
  },
  {
    slug: "mehendi-artists",
    providerCategory: "mehendi_artist",
    label: "Mehendi Artists",
    shortLabel: "Mehendi",
    description: "Traditional and contemporary mehendi artists for families and guests.",
    icon: "flower",
    image: "/images/home/festive-celebration.jpg",
  },
  {
    slug: "pandits",
    providerCategory: "pandit",
    label: "Pandits",
    shortLabel: "Pandits",
    description: "Experienced pandits for wedding rituals, puja and religious ceremonies.",
    icon: "flame",
    image: "/images/home/live-counters.jpg",
  },
  {
    slug: "choreographers",
    providerCategory: "choreographer",
    label: "Choreographers",
    shortLabel: "Choreography",
    description: "Wedding and family performance choreography for memorable celebrations.",
    icon: "party",
    image: "/images/home/birthday-catering.jpg",
  },
  {
    slug: "return-gifts",
    providerCategory: "return_gifts",
    label: "Return Gifts",
    shortLabel: "Gifts",
    description: "Thoughtful, customisable gifts and favours for every guest list.",
    icon: "gift",
    image: "/images/home/halwai-sweets.jpg",
  },
] as const;

export const COMING_SOON_SERVICES = [
  "Wedding Planners",
  "Florists",
  "Cakes & Desserts",
  "Bands, Dhol & Live Artists",
  "Invitations",
  "Event Rentals",
  "Transport",
  "Attire & Jewellery",
  "Guest Accommodation",
  "Beverage Services",
] as const;

export type MarketplaceService = (typeof MARKETPLACE_SERVICES)[number];

export function getMarketplaceService(slug?: string | null) {
  if (!slug) return null;
  return MARKETPLACE_SERVICES.find((service) => service.slug === slug) ?? null;
}

export function serviceForProviderCategory(category?: string | null) {
  if (!category) return null;
  return MARKETPLACE_SERVICES.find((service) => service.providerCategory === category) ?? null;
}

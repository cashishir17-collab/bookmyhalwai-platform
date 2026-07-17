export const MARKETPLACE_SERVICES = [
  {
    slug: "halwai-caterers",
    providerCategory: "halwai_caterer",
    label: "Halwai & Caterers",
    shortLabel: "Catering",
    description: "Traditional halwais, wedding caterers, live counters and complete food service.",
    icon: "utensils",
  },
  {
    slug: "venues-banquet-halls",
    providerCategory: "venue_banquet",
    label: "Venues & Banquet Halls",
    shortLabel: "Venues",
    description: "Banquet halls, lawns and event spaces for celebrations of every size.",
    icon: "building",
  },
  {
    slug: "decorators",
    providerCategory: "decorator",
    label: "Decorators",
    shortLabel: "Decor",
    description: "Wedding stages, floral concepts, lighting and complete event decor.",
    icon: "sparkles",
  },
  {
    slug: "tent-houses",
    providerCategory: "tent_house",
    label: "Tent Houses",
    shortLabel: "Tent Houses",
    description: "Tents, seating, shamianas, lighting and outdoor event infrastructure.",
    icon: "tent",
  },
  {
    slug: "djs-music",
    providerCategory: "dj",
    label: "DJs & Music",
    shortLabel: "DJs",
    description: "DJs, sound systems and music experiences for every celebration.",
    icon: "music",
  },
  {
    slug: "photography-videography",
    providerCategory: "photographer",
    label: "Photography & Videography",
    shortLabel: "Photo & Video",
    description: "Photography and filmmaking teams to preserve every important moment.",
    icon: "camera",
  },
  {
    slug: "makeup-artists",
    providerCategory: "makeup_artist",
    label: "Makeup Artists",
    shortLabel: "Makeup",
    description: "Bridal and occasion makeup artists with professional styling services.",
    icon: "brush",
  },
  {
    slug: "mehendi-artists",
    providerCategory: "mehendi_artist",
    label: "Mehendi Artists",
    shortLabel: "Mehendi",
    description: "Traditional and contemporary mehendi artists for families and guests.",
    icon: "flower",
  },
  {
    slug: "pandits",
    providerCategory: "pandit",
    label: "Pandits",
    shortLabel: "Pandits",
    description: "Experienced pandits for wedding rituals, puja and religious ceremonies.",
    icon: "flame",
  },
  {
    slug: "choreographers",
    providerCategory: "choreographer",
    label: "Choreographers",
    shortLabel: "Choreography",
    description: "Wedding and family performance choreography for memorable celebrations.",
    icon: "party",
  },
  {
    slug: "return-gifts",
    providerCategory: "return_gifts",
    label: "Return Gifts",
    shortLabel: "Gifts",
    description: "Thoughtful, customisable gifts and favours for every guest list.",
    icon: "gift",
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

import { serviceForProviderCategory } from "@/data/marketplace";

export interface MarketplaceVendor {
  id: string;
  businessName: string;
  primaryCategory: string;
  categories: string[];
  serviceTypes: string[];
  state: string;
  city: string;
  serviceLocations: string[];
  description: string;
  image: string;
  rating: number;
  completedEvents: number;
  startingPrice: number;
  verificationStatus: string;
  publicationStatus: string;
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function firstImage(data: Record<string, unknown>) {
  const uploads = record(data.uploadedFiles || data.documents);
  for (const value of [uploads.portfolioPhotos, uploads.additionalPortfolioPhotos, uploads.foodPhotos, uploads.kitchenPhotos, uploads.staffPhotos]) {
    const images = strings(value);
    if (images[0]) return images[0];
  }
  return typeof uploads.logo === "string" && uploads.logo ? uploads.logo : "/images/home/wedding-reception.jpg";
}

export function mapVendorDocumentToMarketplaceVendor(id: string, data: Record<string, unknown>): MarketplaceVendor {
  const primaryCategory = String(data.primaryCategory || data.categorySlug || data.providerCategory || "halwai_caterer");
  const service = serviceForProviderCategory(primaryCategory);
  const pricing = record(data.pricing);
  const categories = strings(data.categories);
  const normalizedServiceTypes = strings(data.serviceTypes).length ? strings(data.serviceTypes) : strings(data.categoryServices);
  const serviceLocations = strings(data.serviceLocations).length
    ? strings(data.serviceLocations)
    : strings(data.serviceAreas).length
      ? strings(data.serviceAreas)
      : String(data.areasServed || "").split(",").map((item) => item.trim()).filter(Boolean);

  return {
    id,
    businessName: String(data.businessName || data.ownerName || "Verified event partner"),
    primaryCategory,
    categories: categories.length ? categories : [primaryCategory],
    serviceTypes: normalizedServiceTypes,
    state: String(data.state || ""),
    city: String(data.city || "India"),
    serviceLocations,
    description: String(data.description || data.servicesDescription || data.aboutBusiness || service?.description || "Verified event-service professional."),
    image: firstImage(data),
    rating: Number(data.rating || 0),
    completedEvents: Number(data.completedEvents || 0),
    startingPrice: Number(data.startingPrice || pricing.startingPrice || 0),
    verificationStatus: String(data.verificationStatus || "Pending"),
    publicationStatus: String(data.publicationStatus || ""),
  };
}

export function isPublicVendor(vendor: MarketplaceVendor) {
  const approved = ["Approved", "Verified", "Published"].includes(vendor.verificationStatus);
  const published = vendor.publicationStatus === "Published" || vendor.verificationStatus === "Published";
  return approved && published;
}

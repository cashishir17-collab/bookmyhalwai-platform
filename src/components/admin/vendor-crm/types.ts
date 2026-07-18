export interface VendorRecord {
  id: string;
  registrationNumber?: string;
  businessName?: string;
  ownerName?: string;
  city?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  profileCompletion?: number;
  verificationStatus?: string;
  leadStage?: string;
  qualityScore?: number;
  createdAt?: unknown;
  assignedTo?: string;
  assignedSalesExecutiveId?: string | null;
  assignedSalesExecutiveName?: string | null;
  salesExecutiveId?: string | null;
  salesExecutiveName?: string | null;
  nextFollowUpDate?: string;
  internalNotes?: string;
  fssai?: string;
  gst?: string;
  yearsExperience?: string | number;
  providerCategory?: string;
  providerCategoryLabel?: string;
  registrationSource?: string;
  ownershipStatus?: string;
  documents?: {
    logo?: string | null;
    kitchenPhotos?: string[] | null;
    foodPhotos?: string[] | null;
    staffPhotos?: string[] | null;
    menuPdf?: string | null;
    fssai?: string | null;
    gst?: string | null;
  };
  uploadedFiles?: VendorRecord["documents"];
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    googleBusinessProfile?: string;
    googleReviewLink?: string;
  };
  socialLinks?: VendorRecord["social"];
  services?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
}

export interface SalesExecutiveOption {
  id: string;
  label: string;
}

export interface VendorTimelineEntry {
  id: string;
  vendorId: string;
  type: string;
  note: string;
  createdAt?: unknown;
  createdBy?: string;
}

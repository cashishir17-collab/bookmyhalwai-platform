export interface VendorAcquisitionRecord {
  id: string;
  businessName?: string;
  ownerName?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  areasServed?: string | string[];
  cuisines?: string[];
  services?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
  documents?: {
    logo?: string | null;
    menuPdf?: string | null;
    fssai?: string | null;
    gst?: string | null;
    kitchenPhotos?: string[] | null;
    foodPhotos?: string[] | null;
    staffPhotos?: string[] | null;
  };
  uploadedFiles?: VendorAcquisitionRecord["documents"];
  providerCategory?: string;
  providerCategoryLabel?: string;
  verificationStatus?: string;
  leadStage?: string;
  profileCompletion?: number;
  qualityScore?: number;
  assignedTo?: string;
  assignedSalesExecutiveId?: string | null;
  assignedSalesExecutiveName?: string | null;
  salesExecutiveId?: string | null;
  salesExecutiveName?: string | null;
  nextFollowUpDate?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  source?: string;
}

export interface SalesExecutiveOption {
  id: string;
  label: string;
}

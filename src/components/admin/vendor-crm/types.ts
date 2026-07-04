export interface VendorRecord {
  id: string;
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
  nextFollowUpDate?: string;
  internalNotes?: string;
  fssai?: string;
  gst?: string;
  yearsExperience?: string | number;
  documents?: {
    logo?: string | null;
    kitchenPhotos?: string[] | null;
    foodPhotos?: string[] | null;
    staffPhotos?: string[] | null;
    menuPdf?: string | null;
    fssai?: string | null;
    gst?: string | null;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    googleBusinessProfile?: string;
    googleReviewLink?: string;
  };
  bank?: {
    accountHolder?: string;
    bank?: string;
    accountNumber?: string;
    ifsc?: string;
    upi?: string;
  };
  services?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
}

export interface VendorTimelineEntry {
  id: string;
  vendorId: string;
  type: string;
  note: string;
  createdAt?: unknown;
  createdBy?: string;
}

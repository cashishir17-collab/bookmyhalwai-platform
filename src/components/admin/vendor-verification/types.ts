export interface VerificationChecklistItem {
  id: string;
  label: string;
  status: "Approved" | "Pending" | "Rejected" | "Needs Re-upload";
  note?: string;
}

export interface VerificationDocument {
  id: string;
  label: string;
  status: "Approved" | "Pending" | "Rejected" | "Needs Re-upload";
  value?: string | null;
  type?: string;
}

export interface VendorVerificationRecord {
  id: string;
  businessName?: string;
  ownerName?: string;
  city?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  googleMapsLink?: string;
  profileCompletion?: number;
  verificationStatus?: string;
  leadStage?: string;
  qualityScore?: number;
  createdAt?: unknown;
  assignedTo?: string;
  nextFollowUpDate?: string;
  internalNotes?: string;
  reason?: string;
  rejectedBy?: string;
  rejectedAt?: unknown;
  documents?: {
    logo?: string | null;
    kitchenPhotos?: string[] | null;
    foodPhotos?: string[] | null;
    staffPhotos?: string[] | null;
    menuPdf?: string | null;
    fssai?: string | null;
    gst?: string | null;
    pan?: string | null;
  };
  bank?: {
    accountHolder?: string;
    bank?: string;
    accountNumber?: string;
    ifsc?: string;
    upi?: string;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    googleBusinessProfile?: string;
    googleReviewLink?: string;
  };
  services?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
}

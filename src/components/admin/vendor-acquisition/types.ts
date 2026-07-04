export interface VendorAcquisitionRecord {
  id: string;
  businessName?: string;
  ownerName?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  areasServed?: string[];
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
  verificationStatus?: string;
  leadStage?: string;
  profileCompletion?: number;
  qualityScore?: number;
  assignedTo?: string;
  nextFollowUpDate?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  source?: string;
}

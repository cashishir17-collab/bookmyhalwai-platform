export type PartnerStatus = "otp_pending" | "ownership_verified" | "approved" | "rejected";

export interface PartnerRegistration {
  id: string;
  businessName: string;
  ownerName: string;
  phoneE164: string;
  city: string;
  category: string;
  address?: string;
  salesExecutiveId: string;
  salesExecutiveName?: string;
  ownerUid?: string | null;
  status: PartnerStatus;
  rejectionReason?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (value.startsWith("+") && digits.length >= 10) return `+${digits}`;
  throw new Error("Enter a valid mobile number, for example +919876543210.");
}

export function statusLabel(status: PartnerStatus) {
  return ({
    otp_pending: "OTP ownership pending",
    ownership_verified: "Awaiting approval",
    approved: "Approved",
    rejected: "Rejected",
  })[status];
}

import type { VendorVerificationRecord } from "@/components/admin/vendor-verification/types";

interface TimestampLike {
  toDate?: () => Date;
  seconds?: number;
  nanoseconds?: number;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toDateValue(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (isObject(value)) {
    const timestamp = value as TimestampLike;

    if (typeof timestamp.toDate === "function") {
      const converted = timestamp.toDate();
      return Number.isNaN(converted.getTime()) ? null : converted;
    }

    if (typeof timestamp.seconds === "number") {
      const millis = timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1_000_000);
      const converted = new Date(millis);
      return Number.isNaN(converted.getTime()) ? null : converted;
    }
  }

  return null;
}

function pickRecord(value: unknown): Record<string, unknown> | undefined {
  return isObject(value) ? value : undefined;
}

export function mapVendorRegistrationToVerificationRecord(id: string, rawData: unknown): VendorVerificationRecord {
  const data = isObject(rawData) ? rawData : {};

  const documents = pickRecord(data.documents) ?? pickRecord(data.uploadedFiles);
  const social = pickRecord(data.social) ?? pickRecord(data.socialLinks);
  const bank = pickRecord(data.bank) ?? pickRecord(data.bankDetails);

  return {
    id,
    ...data,
    documents,
    social,
    bank,
    verificationStatus: typeof data.verificationStatus === "string" ? data.verificationStatus : "Pending",
    leadStage: typeof data.leadStage === "string" ? data.leadStage : "Registered",
    profileCompletion: typeof data.profileCompletion === "number" ? data.profileCompletion : 0,
    createdAt: data.createdAt,
  } as VendorVerificationRecord;
}
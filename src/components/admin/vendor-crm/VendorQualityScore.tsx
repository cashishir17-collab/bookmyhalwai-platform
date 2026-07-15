import type { VendorRecord } from "./types";

export function calculateProfileCompletion(vendor: Partial<VendorRecord>) {
  const checks = [
    vendor.businessName,
    vendor.ownerName,
    vendor.city,
    vendor.mobile,
    vendor.whatsapp,
    vendor.email,
    vendor.fssai,
    vendor.gst,
    vendor.yearsExperience,
    vendor.documents?.logo,
    vendor.documents?.kitchenPhotos?.length,
    vendor.documents?.foodPhotos?.length,
    vendor.documents?.staffPhotos?.length,
    vendor.documents?.menuPdf,
    vendor.social?.instagram || vendor.social?.facebook || vendor.social?.website,
    vendor.social?.googleBusinessProfile,
    vendor.social?.googleReviewLink,
  ];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function calculateVendorQualityScore(vendor: Partial<VendorRecord>) {
  const profileCompletion = calculateProfileCompletion(vendor);
  const fssaiPresent = Boolean(vendor.fssai);
  const gstPresent = Boolean(vendor.gst);
  const photosUploaded = Boolean(
    (vendor.documents?.kitchenPhotos?.length ?? 0) > 0 ||
      (vendor.documents?.foodPhotos?.length ?? 0) > 0 ||
      (vendor.documents?.staffPhotos?.length ?? 0) > 0,
  );
  const menuUploaded = Boolean(vendor.documents?.menuPdf);
  const socialLinksPresent = Boolean(
    vendor.social?.instagram || vendor.social?.facebook || vendor.social?.website,
  );
  const years = Number(vendor.yearsExperience || 0);
  const experiencePresent = years >= 1;
  const score =
    (profileCompletion / 100) * 35 +
    (fssaiPresent ? 10 : 0) +
    (gstPresent ? 10 : 0) +
    (photosUploaded ? 15 : 0) +
    (menuUploaded ? 10 : 0) +
    (socialLinksPresent ? 10 : 0) +
    (experiencePresent ? 10 : 0);

  return Math.round(Math.min(score, 100));
}

interface VendorQualityScoreProps {
  vendor: Partial<VendorRecord>;
}

export default function VendorQualityScore({ vendor }: VendorQualityScoreProps) {
  const profileCompletion = calculateProfileCompletion(vendor);
  const qualityScore = calculateVendorQualityScore(vendor);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">Profile Completion</span>
        <span className="font-semibold text-orange-600">{profileCompletion}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${profileCompletion}%` }} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">Quality Score</span>
        <span className="font-semibold text-emerald-600">{qualityScore}/100</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${qualityScore}%` }} />
      </div>
    </div>
  );
}

import type { VendorRecord } from "./types";

export function calculateProfileCompletion(vendor: Partial<VendorRecord>) {
  const documents = vendor.documents ?? vendor.uploadedFiles;
  const social = vendor.social ?? vendor.socialLinks;
  const commonChecks = [
    vendor.businessName,
    vendor.ownerName,
    vendor.city,
    vendor.mobile,
    vendor.whatsapp,
    vendor.email,
    vendor.yearsExperience,
    documents?.logo,
    (documents?.kitchenPhotos?.length ?? 0) + (documents?.foodPhotos?.length ?? 0) + (documents?.staffPhotos?.length ?? 0),
    social?.instagram || social?.facebook || social?.website,
  ];
  const categoryChecks = vendor.providerCategory === "halwai_caterer" ? [documents?.menuPdf] : [];
  const checks = [...commonChecks, ...categoryChecks];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function calculateVendorQualityScore(vendor: Partial<VendorRecord>) {
  const profileCompletion = calculateProfileCompletion(vendor);
  const documents = vendor.documents ?? vendor.uploadedFiles;
  const social = vendor.social ?? vendor.socialLinks;
  const photosUploaded = Boolean(
    (documents?.kitchenPhotos?.length ?? 0) > 0 ||
      (documents?.foodPhotos?.length ?? 0) > 0 ||
      (documents?.staffPhotos?.length ?? 0) > 0,
  );
  const socialLinksPresent = Boolean(social?.instagram || social?.facebook || social?.website);
  const years = Number(vendor.yearsExperience || 0);
  const experiencePresent = years >= 1;
  const score =
    (profileCompletion / 100) * 65 +
    (photosUploaded ? 15 : 0) +
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

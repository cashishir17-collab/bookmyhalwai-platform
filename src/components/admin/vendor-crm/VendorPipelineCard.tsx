import Link from "next/link";
import type { VendorRecord } from "./types";
import VendorQualityScore, { calculateProfileCompletion, calculateVendorQualityScore } from "./VendorQualityScore";

interface VendorPipelineCardProps {
  vendor: VendorRecord;
  isSelected: boolean;
  onSelect: (vendorId: string) => void;
}

const stageStyles: Record<string, string> = {
  Registered: "bg-orange-100 text-orange-700",
  "Documents Pending": "bg-sky-100 text-sky-700",
  "Verification Pending": "bg-violet-100 text-violet-700",
  Verified: "bg-emerald-100 text-emerald-700",
  "Photos Pending": "bg-amber-100 text-amber-700",
  "Menu Pending": "bg-indigo-100 text-indigo-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Published: "bg-cyan-100 text-cyan-700",
};

const verificationStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Verified: "bg-sky-100 text-sky-700",
};

export default function VendorPipelineCard({ vendor, isSelected, onSelect }: VendorPipelineCardProps) {
  const profileCompletion = calculateProfileCompletion(vendor);
  const qualityScore = calculateVendorQualityScore(vendor);

  return (
    <button
      type="button"
      onClick={() => onSelect(vendor.id)}
      className={`w-full rounded-[1.75rem] border p-5 text-left shadow-sm transition ${
        isSelected ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white hover:border-orange-300"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">{vendor.businessName || "Unnamed Vendor"}</p>
          <p className="mt-1 text-sm text-slate-500">Owner: {vendor.ownerName || "—"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stageStyles[vendor.leadStage || "Registered"] || stageStyles.Registered}`}>
            {vendor.leadStage || "Registered"}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationStyles[vendor.verificationStatus || "Pending"] || verificationStyles.Pending}`}>
            {vendor.verificationStatus || "Pending"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>City: {vendor.city || "—"}</p>
        <p>Mobile: {vendor.mobile || "—"}</p>
        <p>WhatsApp: {vendor.whatsapp || "—"}</p>
        <p>Email: {vendor.email || "—"}</p>
      </div>

      <div className="mt-4">
        <VendorQualityScore vendor={vendor} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>Profile: {profileCompletion}%</span>
        <span>Quality: {qualityScore}/100</span>
        <span>Assigned To: {vendor.assignedTo || "Unassigned"}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="#crm-detail" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          Open CRM
        </Link>
        <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
          Follow-up: {vendor.nextFollowUpDate || "Not set"}
        </span>
      </div>
    </button>
  );
}

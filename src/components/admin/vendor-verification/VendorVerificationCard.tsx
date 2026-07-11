import Link from "next/link";
import type { VendorVerificationRecord } from "./types";
import { toDateValue } from "@/lib/vendorVerification";

interface VendorVerificationCardProps {
  vendor: VendorVerificationRecord;
}

export default function VendorVerificationCard({ vendor }: VendorVerificationCardProps) {
  const createdAtDate = toDateValue(vendor.createdAt);
  const vendorRegistrationNumber = vendor.registrationNumber || (vendor.id.startsWith("BMH-V-") ? vendor.id : "—");
  const registrationDate = createdAtDate
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(createdAtDate)
    : "—";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{vendor.businessName || "Unnamed Vendor"}</h3>
          <p className="mt-1 text-sm text-slate-500">Owner: {vendor.ownerName || "—"}</p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{vendor.verificationStatus || "Pending"}</span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>City: {vendor.city || "—"}</p>
        <p>Mobile: {vendor.mobile || "—"}</p>
        <p>Registration No: {vendorRegistrationNumber}</p>
        <p>Registered: {registrationDate}</p>
        <p>WhatsApp: {vendor.whatsapp || "—"}</p>
        <p>Email: {vendor.email || "—"}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>Profile: {vendor.profileCompletion || 0}%</span>
        <span>Quality: {vendor.qualityScore || 0}/100</span>
        <span>Lead: {vendor.leadStage || "Registered"}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/admin/vendors/verification/${vendor.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          Review KYC
        </Link>
        <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">Assigned: {vendor.assignedTo || "Unassigned"}</span>
      </div>
    </div>
  );
}

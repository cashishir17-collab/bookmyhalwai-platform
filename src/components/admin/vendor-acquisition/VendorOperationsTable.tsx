import Link from "next/link";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { VendorAcquisitionRecord } from "./types";

interface VendorOperationsTableProps {
  vendors: VendorAcquisitionRecord[];
  onUpdated: () => void;
}

const executiveOptions = ["Unassigned", "Asha", "Rohan", "Neha", "Kunal"];

export default function VendorOperationsTable({ vendors, onUpdated }: VendorOperationsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const markFollowUpDone = async (vendor: VendorAcquisitionRecord) => {
    if (!db) return;
    setUpdatingId(vendor.id);
    try {
      await updateDoc(doc(db, "vendors", vendor.id), {
        nextFollowUpDate: "",
        updatedAt: new Date(),
      });
      onUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  const assignExecutive = async (vendor: VendorAcquisitionRecord, executive: string) => {
    if (!db) return;
    setUpdatingId(vendor.id);
    try {
      await updateDoc(doc(db, "vendors", vendor.id), {
        assignedTo: executive,
        updatedAt: new Date(),
      });
      onUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  if (!vendors.length) {
    return <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">No vendor leads available yet.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Business Name</th>
            <th className="px-4 py-3 font-semibold">Owner</th>
            <th className="px-4 py-3 font-semibold">City</th>
            <th className="px-4 py-3 font-semibold">Mobile</th>
            <th className="px-4 py-3 font-semibold">Lead Stage</th>
            <th className="px-4 py-3 font-semibold">Verification</th>
            <th className="px-4 py-3 font-semibold">Profile</th>
            <th className="px-4 py-3 font-semibold">Quality</th>
            <th className="px-4 py-3 font-semibold">Assigned To</th>
            <th className="px-4 py-3 font-semibold">Next Follow-up</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-t border-slate-200 align-top">
              <td className="px-4 py-3 font-semibold text-slate-900">{vendor.businessName || "Unnamed Vendor"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.ownerName || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.city || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.mobile || vendor.phone || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.leadStage || "Registered"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.verificationStatus || "Pending"}</td>
              <td className="px-4 py-3 text-slate-600">{vendor.profileCompletion || 0}%</td>
              <td className="px-4 py-3 text-slate-600">{vendor.qualityScore || 0}</td>
              <td className="px-4 py-3 text-slate-600">
                <select
                  value={vendor.assignedTo || "Unassigned"}
                  onChange={(event) => assignExecutive(vendor, event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                  disabled={updatingId === vendor.id}
                >
                  {executiveOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-slate-600">{vendor.nextFollowUpDate || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/vendors/crm`} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">View CRM</Link>
                  <Link href={`/admin/vendors/verification/${vendor.id}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">View KYC</Link>
                  <button type="button" onClick={() => markFollowUpDone(vendor)} disabled={updatingId === vendor.id} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-60">
                    {updatingId === vendor.id ? "Saving..." : "Follow-up done"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

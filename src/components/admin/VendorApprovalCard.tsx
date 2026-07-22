"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VendorApprovalCardProps {
  vendor: {
    id: string;
    businessName: string;
    ownerName: string;
    cities?: string[];
    fssai?: string;
    createdAt?: { toDate?: () => Date } | Date | string | null;
    verificationStatus?: string;
    rejectionReason?: string;
    approvedBy?: string;
  };
  adminUid: string;
  onUpdated: () => void;
}

export default function VendorApprovalCard({ vendor, adminUid, onUpdated }: VendorApprovalCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    if (!db) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "vendors", vendor.id), {
        verificationStatus: "Approved",
        publicationStatus: "Unpublished",
        approvedAt: new Date(),
        approvedBy: adminUid,
        updatedAt: new Date(),
      });
      onUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!db) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "vendors", vendor.id), {
        verificationStatus: "Rejected",
        publicationStatus: "Unpublished",
        rejectionReason: reason || "No reason provided",
        rejectedAt: new Date(),
        updatedAt: new Date(),
      });
      onUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  const submittedDate = vendor.createdAt
    ? vendor.createdAt instanceof Date
      ? vendor.createdAt.toLocaleDateString()
      : typeof vendor.createdAt === "object" && "toDate" in vendor.createdAt && typeof vendor.createdAt.toDate === "function"
        ? vendor.createdAt.toDate().toLocaleDateString()
        : String(vendor.createdAt)
    : "N/A";

  const statusColor =
    vendor.verificationStatus === "Approved"
      ? "bg-emerald-100 text-emerald-700"
      : vendor.verificationStatus === "Rejected"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{vendor.businessName}</h3>
          <p className="mt-1 text-sm text-slate-500">Owner: {vendor.ownerName}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{vendor.cities?.join(", ") || "No city listed"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">FSSAI: {vendor.fssai || "N/A"}</span>
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor}`}>
          {vendor.verificationStatus || "Pending"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-700">Submitted</p>
          <p>{submittedDate}</p>
        </div>
        <div>
          <p className="font-medium text-slate-700">Rejection Reason</p>
          <p>{vendor.rejectionReason || "—"}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Rejection Reason
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            placeholder="Reason for rejection"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isUpdating}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={isUpdating}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Reject
          </button>
        </div>
      </div>
    </article>
  );
}

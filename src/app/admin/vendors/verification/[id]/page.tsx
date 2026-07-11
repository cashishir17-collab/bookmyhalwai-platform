"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapVendorRegistrationToVerificationRecord } from "@/lib/vendorVerification";
import { useAuth } from "@/hooks/useAuth";
import VerificationChecklist from "@/components/admin/vendor-verification/VerificationChecklist";
import DocumentPreview from "@/components/admin/vendor-verification/DocumentPreview";
import VerificationTimeline from "@/components/admin/vendor-verification/VerificationTimeline";
import type { VerificationChecklistItem, VendorVerificationRecord } from "@/components/admin/vendor-verification/types";

interface TimelineEntry {
  id: string;
  label: string;
  note: string;
  createdAt?: unknown;
}

export default function VendorVerificationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendor, setVendor] = useState<VendorVerificationRecord | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState("Approve");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    const fetchVendor = async () => {
      if (!db || !params?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const vendorDocRef = doc(db, "vendors", params.id);
      const vendorSnapshot = await getDoc(vendorDocRef);

      if (!vendorSnapshot.exists()) {
        setVendor(null);
        setIsLoading(false);
        return;
      }

      const vendorData = mapVendorRegistrationToVerificationRecord(vendorSnapshot.id, vendorSnapshot.data()) as VendorVerificationRecord;

      setVendor(vendorData);

      const timelineRef = collection(db, "vendorTimeline");
      const timelineQuery = query(timelineRef, orderBy("createdAt", "desc"));
      const timelineSnapshot = await getDocs(timelineQuery);
      const entries = timelineSnapshot.docs
        .filter((docSnapshot) => docSnapshot.data().vendorId === params.id)
        .map((docSnapshot) => ({
          id: docSnapshot.id,
          label: docSnapshot.data().type || "Activity",
          note: docSnapshot.data().note || "No notes.",
          createdAt: docSnapshot.data().createdAt,
        })) as TimelineEntry[];

      setTimelineEntries(entries);
      setIsLoading(false);
    };

    fetchVendor();
  }, [loading, params?.id, router, user?.role]);

  const checklist: VerificationChecklistItem[] = useMemo(() => {
    if (!vendor) return [];

    return [
      {
        id: "business",
        label: "Business profile details",
        status: vendor.businessName && vendor.ownerName ? "Approved" : "Pending",
      },
      {
        id: "fssai",
        label: "FSSAI certificate",
        status: vendor.documents?.fssai ? "Approved" : "Needs Re-upload",
      },
      {
        id: "gst",
        label: "GST certificate",
        status: vendor.documents?.gst ? "Approved" : "Pending",
      },
      {
        id: "menu",
        label: "Menu PDF",
        status: vendor.documents?.menuPdf ? "Approved" : "Needs Re-upload",
      },
      {
        id: "photos",
        label: "Kitchen / food / staff photos",
        status: (vendor.documents?.kitchenPhotos?.length || 0) + (vendor.documents?.foodPhotos?.length || 0) + (vendor.documents?.staffPhotos?.length || 0) > 0 ? "Approved" : "Pending",
      },
      {
        id: "social",
        label: "Social proof and review links",
        status: vendor.social?.instagram || vendor.social?.website || vendor.social?.googleReviewLink ? "Approved" : "Pending",
      },
      {
        id: "bank",
        label: "Bank details",
        status: vendor.bank?.accountHolder && vendor.bank?.bank && vendor.bank?.accountNumber && vendor.bank?.ifsc ? "Approved" : "Pending",
      },
    ];
  }, [vendor]);

  const handleAction = async () => {
    if (!db || !vendor || !params?.id) return;

    setIsSaving(true);
    try {
      const normalizedReason = reason.trim() || "No additional notes provided.";
      const normalizedNote = note.trim() || "Reviewed by admin.";
      const actionUpdates: Partial<VendorVerificationRecord> = {};

      if (action === "Approve") {
        actionUpdates.verificationStatus = "Approved";
        actionUpdates.leadStage = "Approved";
        actionUpdates.reason = "";
        actionUpdates.profileCompletion = Math.max(vendor.profileCompletion || 0, 90);
      } else if (action === "Reject") {
        actionUpdates.verificationStatus = "Rejected";
        actionUpdates.leadStage = "Rejected";
        actionUpdates.reason = normalizedReason;
      } else if (action === "Request Documents") {
        actionUpdates.verificationStatus = "Pending";
        actionUpdates.leadStage = "Documents Pending";
        actionUpdates.reason = normalizedReason;
      } else if (action === "Publish") {
        actionUpdates.verificationStatus = "Approved";
        actionUpdates.leadStage = "Published";
        actionUpdates.reason = "";
      }

      await updateDoc(doc(db, "vendors", params.id), {
        ...actionUpdates,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "vendorTimeline"), {
        vendorId: params.id,
        type: action,
        note: `${normalizedNote} ${normalizedReason}`,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "admin",
      });

      setVendor((current) => current ? { ...current, ...actionUpdates } : current);
      setReason("");
      setNote("");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading verification review...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-5xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Vendor not found.</p>
          <Link href="/admin/vendors/verification" className="mt-4 inline-flex text-sm font-semibold text-orange-600">Back to verification queue</Link>
        </div>
      </div>
    );
  }

  const vendorRegistrationNumber = vendor.registrationNumber || (vendor.id.startsWith("BMH-V-") ? vendor.id : "—");

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Vendor Verification Review</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{vendor.businessName || "Vendor KYC"}</h1>
              <p className="mt-2 text-sm font-semibold text-slate-700">Registration Number: {vendorRegistrationNumber}</p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Inspect uploaded documents, confirm mandatory checks, and decide whether the vendor is approved, rejected, or asked to re-upload.</p>
            </div>
            <Link href="/admin/vendors/verification" className="btn btn-outline btn-sm type-button">Back to queue</Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="section-shell rounded-[2rem] p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Verification Checklist</h2>
                  <p className="mt-2 text-sm text-slate-500">Apply a consistent review standard before publishing the vendor.</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{vendor.verificationStatus || "Pending"}</span>
              </div>
              <div className="mt-6">
                <VerificationChecklist items={checklist} />
              </div>
            </div>

            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Document Review</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DocumentPreview label="FSSAI" value={vendor.documents?.fssai} type="certificate" />
                <DocumentPreview label="GST" value={vendor.documents?.gst} type="certificate" />
                <DocumentPreview label="Menu PDF" value={vendor.documents?.menuPdf} type="menu" />
                <DocumentPreview label="Logo" value={vendor.documents?.logo} type="image" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Admin Action</h2>
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Review decision
                  <select value={action} onChange={(event) => setAction(event.target.value)} className="form-control mt-2">
                    <option value="Approve">Approve</option>
                    <option value="Request Documents">Request Documents</option>
                    <option value="Reject">Reject</option>
                    <option value="Publish">Publish</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Reason / follow-up note
                  <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} className="form-control mt-2" placeholder="Explain the decision or requested documents." />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Internal note
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="form-control mt-2" placeholder="Add an internal note for the team." />
                </label>
                <button type="button" onClick={handleAction} disabled={isSaving} className="btn btn-primary btn-sm type-button disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? "Saving..." : "Save Action"}
                </button>
              </div>
            </div>

            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Verification Timeline</h2>
              <div className="mt-6">
                <VerificationTimeline entries={timelineEntries} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

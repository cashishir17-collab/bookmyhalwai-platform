"use client";

import { useEffect, useState } from "react";
import { doc, serverTimestamp, updateDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { VendorRecord, VendorTimelineEntry } from "./types";
import VendorQualityScore, { calculateVendorQualityScore } from "./VendorQualityScore";
import VendorTimeline from "./VendorTimeline";

interface VendorCrmDetailProps {
  vendor: VendorRecord;
  onUpdated: () => void;
  currentUser: string;
}

const timelineTypes = [
  "Call Completed",
  "Documents Requested",
  "Photos Requested",
  "Menu Requested",
  "Verification Done",
  "Approved",
  "Rejected",
  "Published",
];

export default function VendorCrmDetail({ vendor, onUpdated, currentUser }: VendorCrmDetailProps) {
  const [localVendor, setLocalVendor] = useState(vendor);
  const [timelineEntries, setTimelineEntries] = useState<VendorTimelineEntry[]>([]);
  const [note, setNote] = useState("");
  const [selectedType, setSelectedType] = useState("Call Completed");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLocalVendor(vendor);
    }, 0);

    const loadTimeline = async () => {
      if (!db) return;
      const timelineRef = collection(db, "vendorTimeline");
      const q = query(timelineRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs
        .filter((docSnapshot) => docSnapshot.data().vendorId === vendor.id)
        .map((docSnapshot) => ({
          id: docSnapshot.id,
          vendorId: docSnapshot.data().vendorId,
          type: docSnapshot.data().type,
          note: docSnapshot.data().note,
          createdAt: docSnapshot.data().createdAt,
          createdBy: docSnapshot.data().createdBy,
        })) as VendorTimelineEntry[];
      setTimelineEntries(entries);
    };

    void loadTimeline();
    return () => window.clearTimeout(timeoutId);
  }, [vendor]);

  const saveField = async (updates: Partial<VendorRecord>) => {
    if (!db) return;
    setIsSaving(true);
    try {
      const mergedVendor = { ...localVendor, ...updates };
      const qualityScore = calculateVendorQualityScore(mergedVendor);
      await updateDoc(doc(db, "vendors", vendor.id), {
        ...updates,
        qualityScore,
        updatedAt: serverTimestamp(),
      });
      setLocalVendor((current) => ({ ...current, ...updates, qualityScore }));
      onUpdated();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTimeline = async () => {
    if (!db || !note.trim()) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "vendorTimeline"), {
        vendorId: vendor.id,
        type: selectedType,
        note: note.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser,
      });
      setNote("");
      const timelineRef = collection(db, "vendorTimeline");
      const q = query(timelineRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs
        .filter((docSnapshot) => docSnapshot.data().vendorId === vendor.id)
        .map((docSnapshot) => ({
          id: docSnapshot.id,
          vendorId: docSnapshot.data().vendorId,
          type: docSnapshot.data().type,
          note: docSnapshot.data().note,
          createdAt: docSnapshot.data().createdAt,
          createdBy: docSnapshot.data().createdBy,
        })) as VendorTimelineEntry[];
      setTimelineEntries(entries);
    } finally {
      setIsSaving(false);
    }
  };

  const qualityScore = calculateVendorQualityScore(localVendor);

  return (
    <div id="crm-detail" className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Vendor CRM</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{localVendor.businessName || "Vendor Detail"}</h2>
          <p className="mt-2 text-sm text-slate-500">Internal operational view for onboarding, verification, and follow-up.</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
          Quality Score: {qualityScore}/100
        </div>
      </div>

      <VendorQualityScore vendor={localVendor} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Business Details</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-700">Owner:</span> {localVendor.ownerName || "—"}</p>
            <p><span className="font-semibold text-slate-700">City:</span> {localVendor.city || "—"}</p>
            <p><span className="font-semibold text-slate-700">Mobile:</span> {localVendor.mobile || "—"}</p>
            <p><span className="font-semibold text-slate-700">WhatsApp:</span> {localVendor.whatsapp || "—"}</p>
            <p><span className="font-semibold text-slate-700">Email:</span> {localVendor.email || "—"}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Operations</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="block font-medium text-slate-700">
              Lead Stage
              <select value={localVendor.leadStage || "Registered"} onChange={(event) => saveField({ leadStage: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {[
                  "Registered",
                  "Documents Pending",
                  "Verification Pending",
                  "Verified",
                  "Photos Pending",
                  "Menu Pending",
                  "Approved",
                  "Rejected",
                  "Published",
                ].map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </label>
            <label className="block font-medium text-slate-700">
              Verification Status
              <select value={localVendor.verificationStatus || "Pending"} onChange={(event) => saveField({ verificationStatus: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {['Pending', 'Verified', 'Approved', 'Rejected'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="block font-medium text-slate-700">
              Assigned To
              <input value={localVendor.assignedTo || ""} onChange={(event) => saveField({ assignedTo: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Ops lead" />
            </label>
            <label className="block font-medium text-slate-700">
              Next Follow-up Date
              <input type="date" value={localVendor.nextFollowUpDate || ""} onChange={(event) => saveField({ nextFollowUpDate: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Service & Pricing</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-700">Services:</span> {localVendor.services ? Object.entries(localVendor.services).filter(([, value]) => Boolean(value)).map(([key]) => key).join(", ") : "—"}</p>
            <p><span className="font-semibold text-slate-700">Pricing:</span> {localVendor.pricing ? JSON.stringify(localVendor.pricing) : "—"}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Social & Documents</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-700">Social:</span> {localVendor.social ? Object.values(localVendor.social).filter(Boolean).join(", ") : "—"}</p>
            <p><span className="font-semibold text-slate-700">Documents:</span> {localVendor.documents ? Object.entries(localVendor.documents).filter(([, value]) => Boolean(value)).map(([key]) => key).join(", ") : "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Bank Details</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-700">Account Holder:</span> {localVendor.bank?.accountHolder || "—"}</p>
            <p><span className="font-semibold text-slate-700">Bank:</span> {localVendor.bank?.bank || "—"}</p>
            <p><span className="font-semibold text-slate-700">Account Number:</span> {localVendor.bank?.accountNumber || "—"}</p>
            <p><span className="font-semibold text-slate-700">IFSC:</span> {localVendor.bank?.ifsc || "—"}</p>
            <p><span className="font-semibold text-slate-700">UPI:</span> {localVendor.bank?.upi || "—"}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Follow-up Tasks</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-700">Next Follow-up:</span> {localVendor.nextFollowUpDate || "Not set"}</p>
            <p><span className="font-semibold text-slate-700">Assigned To:</span> {localVendor.assignedTo || "Unassigned"}</p>
            <p><span className="font-semibold text-slate-700">Internal Notes:</span> {localVendor.internalNotes || "No notes yet"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-900">Internal Notes</h3>
        <textarea value={localVendor.internalNotes || ""} onChange={(event) => setLocalVendor((current) => ({ ...current, internalNotes: event.target.value }))} className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Add follow-up notes..." />
        <button type="button" onClick={() => saveField({ internalNotes: localVendor.internalNotes || "" })} disabled={isSaving} className="mt-3 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Save Notes</button>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {timelineTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input value={note} onChange={(event) => setNote(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Add timeline note" />
          <button type="button" onClick={handleAddTimeline} disabled={isSaving || !note.trim()} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Add Entry</button>
        </div>
        <div className="mt-4">
          <VendorTimeline entries={timelineEntries} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapVendorRegistrationToVerificationRecord, toDateValue } from "@/lib/vendorVerification";
import { useAuth } from "@/hooks/useAuth";
import VendorVerificationCard from "@/components/admin/vendor-verification/VendorVerificationCard";
import KycProgressCard from "@/components/admin/vendor-verification/KycProgressCard";
import type { VendorVerificationRecord } from "@/components/admin/vendor-verification/types";

export default function VendorVerificationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorVerificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    const fetchVendors = async () => {
      const firestoreDb = db;
      if (!firestoreDb) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const vendorsCollection = collection(firestoreDb, "vendors");

      try {
        const snapshot = await getDocs(query(vendorsCollection, orderBy("createdAt", "desc")));
        const vendorRows = snapshot.docs.map((docSnapshot) => mapVendorRegistrationToVerificationRecord(docSnapshot.id, docSnapshot.data()));
        setVendors(vendorRows);
      } catch {
        const snapshot = await getDocs(vendorsCollection);
        const vendorRows = snapshot.docs
          .map((docSnapshot) => mapVendorRegistrationToVerificationRecord(docSnapshot.id, docSnapshot.data()))
          .sort((left, right) => {
            const leftDate = toDateValue(left.createdAt)?.getTime() || 0;
            const rightDate = toDateValue(right.createdAt)?.getTime() || 0;
            return rightDate - leftDate;
          });
        setVendors(vendorRows);
      }

      setIsLoading(false);
    };

    fetchVendors();
  }, [loading, router, user?.role]);

  const stats = useMemo(() => {
    const pendingKyc = vendors.filter((vendor) => (vendor.verificationStatus || "Pending") === "Pending").length;
    const pendingFssai = vendors.filter((vendor) => vendor.documents?.fssai == null).length;
    const pendingGst = vendors.filter((vendor) => vendor.documents?.gst == null).length;
    const pendingDocuments = vendors.filter((vendor) => !vendor.documents?.menuPdf || !vendor.documents?.kitchenPhotos?.length).length;
    const approved = vendors.filter((vendor) => vendor.verificationStatus === "Approved").length;
    const rejected = vendors.filter((vendor) => vendor.verificationStatus === "Rejected").length;
    const expiredDocuments = vendors.filter((vendor) => vendor.nextFollowUpDate && vendor.nextFollowUpDate < new Date().toISOString().slice(0, 10)).length;

    return [
      { title: "Pending KYC", value: pendingKyc, details: "Awaiting review", accent: "orange" as const },
      { title: "Pending FSSAI", value: pendingFssai, details: "Missing document", accent: "blue" as const },
      { title: "Pending GST", value: pendingGst, details: "Missing document", accent: "violet" as const },
      { title: "Pending Documents", value: pendingDocuments, details: "Uploads outstanding", accent: "rose" as const },
      { title: "Approved", value: approved, details: "Ready for marketplace", accent: "emerald" as const },
      { title: "Rejected", value: rejected, details: "Needs follow-up", accent: "rose" as const },
      { title: "Expired Documents", value: expiredDocuments, details: "Needs refresh", accent: "blue" as const },
    ];
  }, [vendors]);

  if (loading || isLoading) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading vendor verification queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Admin Verification Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor Verification & KYC</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Review each vendor’s KYC package and gate marketplace visibility until all mandatory checks are complete.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <KycProgressCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="section-shell rounded-[2rem] p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Verification Queue</h2>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {vendors.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 xl:col-span-2">
                No vendor registrations found for verification.
              </div>
            ) : (
              vendors.map((vendor) => (
                <VendorVerificationCard key={vendor.id} vendor={vendor} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

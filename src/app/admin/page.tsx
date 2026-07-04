"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import VendorApprovalCard from "@/components/admin/VendorApprovalCard";

interface VendorRecord {
  id: string;
  businessName: string;
  ownerName: string;
  city?: string;
  fssai?: string;
  createdAt?: string | Date | { toDate?: () => Date } | null;
  verificationStatus?: string;
  rejectionReason?: string;
  approvedBy?: string;
  leadStage?: string;
  profileCompletion?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    if (!db) {
      setVendors([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const snapshot = await getDocs(collection(db, "vendors"));
    const vendorRows = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<VendorRecord, "id">),
    }));
    setVendors(vendorRows);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
      return;
    }

    let isMounted = true;
    const loadVendors = async () => {
      if (!isMounted) {
        return;
      }
      await fetchVendors();
    };

    void loadVendors();
    return () => {
      isMounted = false;
    };
  }, [fetchVendors, loading, router, user?.role]);

  const stats = useMemo(() => {
    const registered = vendors.filter((vendor) => vendor.leadStage === "Registered" || vendor.verificationStatus === "Pending").length;
    const documentsPending = vendors.filter((vendor) => vendor.leadStage === "Documents Pending").length;
    const verification = vendors.filter((vendor) => vendor.verificationStatus === "Pending" && vendor.leadStage !== "Documents Pending").length;
    const approved = vendors.filter((vendor) => vendor.verificationStatus === "Approved").length;
    const rejected = vendors.filter((vendor) => vendor.verificationStatus === "Rejected").length;

    return [
      { title: "Registered", value: registered, description: "New leads ready for review", accent: "orange" as const },
      { title: "Documents Pending", value: documentsPending, description: "Missing uploads", accent: "blue" as const },
      { title: "Verification", value: verification, description: "Pending approval", accent: "violet" as const },
      { title: "Approved", value: approved, description: "Live on marketplace", accent: "emerald" as const },
      { title: "Rejected", value: rejected, description: "Needs follow-up", accent: "orange" as const },
    ];
  }, [vendors]);

  const stageBuckets = useMemo(() => {
    const buckets = [
      { title: "Registered", stage: "Registered", vendors: [] as VendorRecord[] },
      { title: "Documents Pending", stage: "Documents Pending", vendors: [] as VendorRecord[] },
      { title: "Verification", stage: "Verification", vendors: [] as VendorRecord[] },
      { title: "Approved", stage: "Approved", vendors: [] as VendorRecord[] },
      { title: "Rejected", stage: "Rejected", vendors: [] as VendorRecord[] },
    ];

    vendors.forEach((vendor) => {
      const normalizedStatus = vendor.verificationStatus?.toLowerCase();
      if (normalizedStatus === "approved") {
        buckets[3].vendors.push(vendor);
      } else if (normalizedStatus === "rejected") {
        buckets[4].vendors.push(vendor);
      } else if (vendor.leadStage === "Documents Pending") {
        buckets[1].vendors.push(vendor);
      } else if (vendor.leadStage === "Registered") {
        buckets[0].vendors.push(vendor);
      } else {
        buckets[2].vendors.push(vendor);
      }
    });

    return buckets;
  }, [vendors]);

  const refreshVendors = async () => {
    if (!db) return;
    const snapshot = await getDocs(collection(db, "vendors"));
    setVendors(snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<VendorRecord, "id">),
    })));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Admin Console</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor acquisition pipeline</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Review new vendor leads, track document readiness, and move promising partners into verification and approval.</p>
          <a href="/admin/vendors/crm" className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
            Open Vendor CRM
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <AdminStatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">New Vendor Leads</h2>
              <p className="mt-2 text-sm text-slate-500">Approve or reject vendors before they appear on the marketplace.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {vendors.map((vendor) => (
              <VendorApprovalCard key={vendor.id} vendor={vendor} adminUid={user?.uid || "admin"} onUpdated={refreshVendors} />
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900">Vendor Acquisition Pipeline</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {stageBuckets.map((bucket) => (
              <div key={bucket.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{bucket.title}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{bucket.vendors.length}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {bucket.vendors.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">No leads in this stage.</p>
                  ) : (
                    bucket.vendors.map((vendor) => (
                      <div key={vendor.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{vendor.businessName}</p>
                        <p className="mt-1 text-xs text-slate-500">{vendor.city || "Location pending"}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

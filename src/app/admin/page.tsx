"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import VendorApprovalCard from "@/components/admin/VendorApprovalCard";

interface VendorRecord {
  id: string;
  businessName: string;
  ownerName: string;
  cities?: string[];
  fssai?: string;
  createdAt?: string | Date | { toDate?: () => Date } | null;
  verificationStatus?: string;
  rejectionReason?: string;
  approvedBy?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
      return;
    }

    if (!db) {
      setIsLoading(false);
      return;
    }

    const fetchVendors = async () => {
      setIsLoading(true);
      if (!db) {
        setVendors([]);
        setIsLoading(false);
        return;
      }

      const snapshot = await getDocs(collection(db, "vendors"));
      const vendorRows = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<VendorRecord, "id">),
      }));
      setVendors(vendorRows);
      setIsLoading(false);
    };

    fetchVendors();
  }, [loading, router, user?.role]);

  const stats = useMemo(() => {
    const pending = vendors.filter((vendor) => vendor.verificationStatus !== "Approved" && vendor.verificationStatus !== "Rejected").length;
    const approved = vendors.filter((vendor) => vendor.verificationStatus === "Approved").length;
    const rejected = vendors.filter((vendor) => vendor.verificationStatus === "Rejected").length;

    return [
      { title: "Pending Vendors", value: pending, description: "Awaiting review", accent: "orange" as const },
      { title: "Approved Vendors", value: approved, description: "Live on marketplace", accent: "emerald" as const },
      { title: "Rejected Vendors", value: rejected, description: "Needs follow-up", accent: "violet" as const },
      { title: "Total Customers", value: "—", description: "Coming soon", accent: "blue" as const },
      { title: "Total Bookings", value: "—", description: "Coming soon", accent: "blue" as const },
      { title: "Revenue", value: "₹0", description: "Placeholder", accent: "orange" as const },
    ];
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
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor management</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Review vendor submissions, approve or reject applications, and manage marketplace visibility.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <AdminStatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Vendor Approval Queue</h2>
              <p className="mt-2 text-sm text-slate-500">Approve or reject vendors before they appear on the marketplace.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {vendors.map((vendor) => (
              <VendorApprovalCard
                key={vendor.id}
                vendor={vendor}
                adminUid={user?.uid || "admin"}
                onUpdated={refreshVendors}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

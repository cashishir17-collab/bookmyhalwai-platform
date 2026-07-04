"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import VendorAcquisitionStats from "@/components/admin/vendor-acquisition/VendorAcquisitionStats";
import CityPipelineCard from "@/components/admin/vendor-acquisition/CityPipelineCard";
import VendorOperationsTable from "@/components/admin/vendor-acquisition/VendorOperationsTable";
import SeedDemoVendorsButton from "@/components/admin/vendor-acquisition/SeedDemoVendorsButton";
import type { VendorAcquisitionRecord } from "@/components/admin/vendor-acquisition/types";

const cityList = ["Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad", "Lucknow", "Jaipur", "Chandigarh"];

export default function VendorAcquisitionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorAcquisitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendors = async () => {
    if (!db) {
      setVendors([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const snapshot = await getDocs(collection(db, "vendors"));
    const vendorRows = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<VendorAcquisitionRecord, "id">),
    })) as VendorAcquisitionRecord[];
    setVendors(vendorRows);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    fetchVendors();
  }, [loading, router, user?.role]);

  const stats = useMemo(() => {
    const leadCount = vendors.length;
    const newRegistrationsToday = vendors.filter((vendor) => {
      if (!vendor.createdAt) return false;
      const createdAt = vendor.createdAt as { toDate?: () => Date } | Date | string | null;
      if (createdAt instanceof Date) return createdAt.toDateString() === new Date().toDateString();
      if (typeof createdAt === "object" && createdAt !== null && "toDate" in createdAt && typeof createdAt.toDate === "function") {
        return createdAt.toDate().toDateString() === new Date().toDateString();
      }
      return false;
    }).length;

    const pendingKyc = vendors.filter((vendor) => (vendor.verificationStatus || "Pending") === "Pending").length;
    const documentsPending = vendors.filter((vendor) => !vendor.documents?.menuPdf || !vendor.documents?.fssai || !vendor.documents?.gst).length;
    const verificationCallsDue = vendors.filter((vendor) => vendor.nextFollowUpDate).length;
    const approvedVendors = vendors.filter((vendor) => vendor.verificationStatus === "Approved" || vendor.verificationStatus === "Verified").length;
    const publishedVendors = vendors.filter((vendor) => vendor.leadStage === "Published" || vendor.verificationStatus === "Published").length;
    const rejectedVendors = vendors.filter((vendor) => vendor.verificationStatus === "Rejected").length;
    const avgQuality = vendors.length ? Math.round(vendors.reduce((sum, vendor) => sum + (vendor.qualityScore || 0), 0) / vendors.length) : 0;
    const avgCompletion = vendors.length ? Math.round(vendors.reduce((sum, vendor) => sum + (vendor.profileCompletion || 0), 0) / vendors.length) : 0;

    return [
      { title: "Total Vendor Leads", value: leadCount, detail: "All active and pending vendor leads", accent: "orange" as const },
      { title: "New Registrations Today", value: newRegistrationsToday, detail: "Fresh onboarding submissions", accent: "blue" as const },
      { title: "Pending KYC", value: pendingKyc, detail: "Awaiting verification review", accent: "violet" as const },
      { title: "Documents Pending", value: documentsPending, detail: "Uploads still outstanding", accent: "rose" as const },
      { title: "Verification Calls Due", value: verificationCallsDue, detail: "Follow-up appointments pending", accent: "blue" as const },
      { title: "Approved Vendors", value: approvedVendors, detail: "Ready for marketplace visibility", accent: "emerald" as const },
      { title: "Published Vendors", value: publishedVendors, detail: "Live on the platform", accent: "emerald" as const },
      { title: "Rejected Vendors", value: rejectedVendors, detail: "Needs re-engagement", accent: "rose" as const },
      { title: "Average Quality Score", value: avgQuality, detail: "Weighted quality rating", accent: "orange" as const },
      { title: "Average Profile Completion", value: `${avgCompletion}%`, detail: "Completeness across vendors", accent: "violet" as const },
    ];
  }, [vendors]);

  const cityStats = useMemo(() => cityList.map((city) => {
    const cityVendors = vendors.filter((vendor) => vendor.city === city);
    const pendingVerification = cityVendors.filter((vendor) => (vendor.verificationStatus || "Pending") === "Pending").length;
    const approved = cityVendors.filter((vendor) => vendor.verificationStatus === "Approved" || vendor.verificationStatus === "Verified").length;
    const published = cityVendors.filter((vendor) => vendor.leadStage === "Published" || vendor.verificationStatus === "Published").length;
    const averageQualityScore = cityVendors.length ? Math.round(cityVendors.reduce((sum, vendor) => sum + (vendor.qualityScore || 0), 0) / cityVendors.length) : 0;

    return {
      city,
      totalLeads: cityVendors.length,
      pendingVerification,
      approved,
      published,
      averageQualityScore,
    };
  }), [vendors]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading vendor acquisition dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Vendor Acquisition Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Ops-ready vendor onboarding overview</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Monitor vendor leads across cities, track KYC readiness, and keep the acquisition team aligned with follow-up actions.</p>
            </div>
            <SeedDemoVendorsButton onCompleted={fetchVendors} />
          </div>
        </div>

        <VendorAcquisitionStats stats={stats} />

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900">City Pipeline</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cityStats.map((city) => (
              <CityPipelineCard key={city.city} {...city} />
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Operations Table</h2>
              <p className="mt-2 text-sm text-slate-500">Review vendor records, assign executives, and close follow-up tasks.</p>
            </div>
          </div>
          <div className="mt-6">
            <VendorOperationsTable vendors={vendors} onUpdated={fetchVendors} />
          </div>
        </div>
      </div>
    </div>
  );
}

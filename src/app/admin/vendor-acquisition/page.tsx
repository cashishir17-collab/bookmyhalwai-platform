"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import VendorAcquisitionStats from "@/components/admin/vendor-acquisition/VendorAcquisitionStats";
import CityPipelineCard from "@/components/admin/vendor-acquisition/CityPipelineCard";
import VendorOperationsTable from "@/components/admin/vendor-acquisition/VendorOperationsTable";
import SeedDemoVendorsButton from "@/components/admin/vendor-acquisition/SeedDemoVendorsButton";
import type { SalesExecutiveOption, VendorAcquisitionRecord } from "@/components/admin/vendor-acquisition/types";

type UserAccount = {
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
};

function requiredUploadsPending(vendor: VendorAcquisitionRecord) {
  const uploads = vendor.uploadedFiles ?? vendor.documents;
  const hasLogo = Boolean(uploads?.logo);
  const hasPortfolio = Boolean(
    uploads?.kitchenPhotos?.length || uploads?.foodPhotos?.length || uploads?.staffPhotos?.length,
  );
  const catererMenuPending = vendor.providerCategory === "halwai_caterer" && !uploads?.menuPdf;

  return !hasLogo || !hasPortfolio || catererMenuPending;
}

export default function VendorAcquisitionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorAcquisitionRecord[]>([]);
  const [salesExecutives, setSalesExecutives] = useState<SalesExecutiveOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchVendors = useCallback(async () => {
    if (!db) {
      setVendors([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const [vendorSnapshot, userSnapshot] = await Promise.all([
        getDocs(collection(db, "vendors")),
        getDocs(collection(db, "users")),
      ]);
      const vendorRows = vendorSnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<VendorAcquisitionRecord, "id">),
      })) as VendorAcquisitionRecord[];
      const executiveRows = userSnapshot.docs
        .map((item) => ({ id: item.id, ...(item.data() as UserAccount) }))
        .filter((account) => account.role === "sales_executive" || account.role === "sales")
        .map((account) => ({
          id: account.id,
          label: account.displayName || account.phoneNumber || account.email || account.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setVendors(vendorRows);
      setSalesExecutives(executiveRows);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load vendor operations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- authorized dashboard data is loaded after the role check.
    void fetchVendors();
  }, [fetchVendors, loading, router, user?.role]);

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
    const documentsPending = vendors.filter(requiredUploadsPending).length;
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

  const cityStats = useMemo(() => Array.from(new Set(vendors.map((vendor) => vendor.city?.trim()).filter(Boolean) as string[])).sort().map((city) => {
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
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading vendor acquisition dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Vendor Acquisition Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Ops-ready vendor onboarding overview</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Monitor vendor leads across cities, track KYC readiness, and keep the acquisition team aligned with follow-up actions.</p>
            </div>
            <SeedDemoVendorsButton onCompleted={fetchVendors} />
          </div>
          {loadError ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loadError}</p> : null}
        </div>

        <VendorAcquisitionStats stats={stats} />

        <div className="section-shell rounded-[2rem] p-8">
          <h2 className="text-2xl font-semibold text-slate-900">City Pipeline</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cityStats.map((city) => (
              <CityPipelineCard key={city.city} {...city} />
            ))}
            {!cityStats.length ? <p className="text-sm text-slate-500">City pipeline will appear after the first registration.</p> : null}
          </div>
        </div>

        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Operations Table</h2>
              <p className="mt-2 text-sm text-slate-500">Review vendor records, assign executives, and close follow-up tasks.</p>
            </div>
          </div>
          <div className="mt-6">
            <VendorOperationsTable vendors={vendors} salesExecutives={salesExecutives} onUpdated={fetchVendors} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import VendorCrmStats from "@/components/admin/vendor-crm/VendorCrmStats";
import VendorCrmFilters from "@/components/admin/vendor-crm/VendorCrmFilters";
import VendorPipelineCard from "@/components/admin/vendor-crm/VendorPipelineCard";
import VendorCrmDetail from "@/components/admin/vendor-crm/VendorCrmDetail";
import type { SalesExecutiveOption, VendorRecord } from "@/components/admin/vendor-crm/types";
import { calculateVendorQualityScore } from "@/components/admin/vendor-crm/VendorQualityScore";

const initialFilters = {
  leadStage: "",
  verificationStatus: "",
  city: "",
  assignedTo: "",
  minQuality: "",
  maxQuality: "",
  followUpDueToday: false,
  incompleteProfile: false,
};

type UserAccount = {
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
};

function normalizeVendor(id: string, raw: Omit<VendorRecord, "id">): VendorRecord {
  return {
    id,
    ...raw,
    documents: raw.documents ?? raw.uploadedFiles,
    social: raw.social ?? raw.socialLinks,
    assignedSalesExecutiveId: raw.assignedSalesExecutiveId || raw.salesExecutiveId,
    assignedSalesExecutiveName: raw.assignedSalesExecutiveName || raw.salesExecutiveName,
    assignedTo: raw.assignedSalesExecutiveName || raw.salesExecutiveName || raw.assignedTo,
  };
}

export default function VendorCrmPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [salesExecutives, setSalesExecutives] = useState<SalesExecutiveOption[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchVendors = useCallback(async () => {
    const firestoreDb = db;
    if (!firestoreDb) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const [vendorSnapshot, userSnapshot] = await Promise.all([
        getDocs(collection(firestoreDb, "vendors")),
        getDocs(collection(firestoreDb, "users")),
      ]);
      const rows = vendorSnapshot.docs.map((item) =>
        normalizeVendor(item.id, item.data() as Omit<VendorRecord, "id">),
      );
      const executiveRows = userSnapshot.docs
        .map((item) => ({ id: item.id, ...(item.data() as UserAccount) }))
        .filter((account) => account.role === "sales_executive" || account.role === "sales")
        .map((account) => ({
          id: account.id,
          label: account.displayName || account.phoneNumber || account.email || account.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setVendors(rows.map((row) => ({ ...row, qualityScore: calculateVendorQualityScore(row) })));
      setSalesExecutives(executiveRows);
      setSelectedVendorId((current) => current ?? rows[0]?.id ?? null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load vendor CRM.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading && user?.role === "admin") void fetchVendors();
  }, [fetchVendors, loading, router, user?.role]);

  const filteredVendors = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return vendors.filter((vendor) => {
      const leadStage = vendor.leadStage || "Registered";
      const verificationStatus = vendor.verificationStatus || "Pending";
      const qualityScore = calculateVendorQualityScore(vendor);
      const profileCompletion = Number(vendor.profileCompletion || 0);
      const matchLeadStage = filters.leadStage ? leadStage === filters.leadStage : true;
      const matchVerificationStatus = filters.verificationStatus ? verificationStatus === filters.verificationStatus : true;
      const matchCity = filters.city ? (vendor.city || "") === filters.city : true;
      const matchAssigned = filters.assignedTo ? (vendor.assignedTo || "") === filters.assignedTo : true;
      const matchMinQuality = filters.minQuality ? qualityScore >= Number(filters.minQuality) : true;
      const matchMaxQuality = filters.maxQuality ? qualityScore <= Number(filters.maxQuality) : true;
      const matchDueToday = filters.followUpDueToday ? (vendor.nextFollowUpDate || "") === today : true;
      const matchIncompleteProfile = filters.incompleteProfile ? profileCompletion < 100 : true;

      return (
        matchLeadStage &&
        matchVerificationStatus &&
        matchCity &&
        matchAssigned &&
        matchMinQuality &&
        matchMaxQuality &&
        matchDueToday &&
        matchIncompleteProfile
      );
    });
  }, [filters, vendors]);

  const selectedVendor = filteredVendors.find((vendor) => vendor.id === selectedVendorId) ?? filteredVendors[0] ?? null;

  const stats = useMemo(() => {
    const total = vendors.length;
    const pendingVerification = vendors.filter((vendor) => (vendor.verificationStatus || "Pending") === "Pending").length;
    const documentsPending = vendors.filter((vendor) => vendor.leadStage === "Documents Pending").length;
    const approved = vendors.filter((vendor) => vendor.verificationStatus === "Approved" || vendor.leadStage === "Approved").length;
    const rejected = vendors.filter((vendor) => vendor.verificationStatus === "Rejected" || vendor.leadStage === "Rejected").length;
    const averageQuality = vendors.length
      ? Math.round(vendors.reduce((sum, vendor) => sum + calculateVendorQualityScore(vendor), 0) / vendors.length)
      : 0;
    const dueToday = vendors.filter((vendor) => (vendor.nextFollowUpDate || "") === new Date().toISOString().slice(0, 10)).length;
    const incompleteProfiles = vendors.filter((vendor) => Number(vendor.profileCompletion || 0) < 100).length;

    return [
      { label: "Total Vendor Leads", value: total, accent: "orange" as const },
      { label: "Pending Verification", value: pendingVerification, accent: "blue" as const },
      { label: "Documents Pending", value: documentsPending, accent: "violet" as const },
      { label: "Approved Vendors", value: approved, accent: "emerald" as const },
      { label: "Rejected Vendors", value: rejected, accent: "rose" as const },
      { label: "Average Quality Score", value: `${averageQuality}/100`, accent: "orange" as const },
      { label: "Follow-ups Due Today", value: dueToday, accent: "blue" as const },
      { label: "Incomplete Profiles", value: incompleteProfiles, accent: "rose" as const },
    ];
  }, [vendors]);

  const handleFiltersChange = (updates: Partial<typeof initialFilters>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  if (loading || isLoading) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading vendor CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Admin CRM</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor CRM Pipeline</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Track vendor leads from registration through approval and publishing with a shared internal workflow.</p>
          {loadError ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loadError}</p> : null}
        </div>

        <VendorCrmStats stats={stats} />
        <VendorCrmFilters vendors={vendors} filters={filters} onFiltersChange={handleFiltersChange} onReset={resetFilters} />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            {filteredVendors.length === 0 ? (
              <div className="section-shell rounded-[2rem] border border-dashed p-8 text-center text-sm text-slate-500">No vendors match the current filters.</div>
            ) : (
              filteredVendors.map((vendor) => (
                <VendorPipelineCard key={vendor.id} vendor={vendor} isSelected={selectedVendor?.id === vendor.id} onSelect={setSelectedVendorId} />
              ))
            )}
          </div>

          <div>{selectedVendor ? <VendorCrmDetail vendor={selectedVendor} salesExecutives={salesExecutives} onUpdated={fetchVendors} currentUser={user?.displayName || user?.email || "Admin"} /> : <div className="section-shell rounded-[2rem] border border-dashed p-8 text-center text-sm text-slate-500">Select a vendor to view the full CRM.</div>}</div>
        </div>
      </div>
    </div>
  );
}

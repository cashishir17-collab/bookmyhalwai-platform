import type { VendorRecord } from "./types";

interface VendorCrmFiltersProps {
  vendors: VendorRecord[];
  filters: {
    leadStage: string;
    verificationStatus: string;
    city: string;
    assignedTo: string;
    minQuality: string;
    maxQuality: string;
    followUpDueToday: boolean;
    incompleteProfile: boolean;
  };
  onFiltersChange: (updates: Partial<VendorCrmFiltersProps["filters"]>) => void;
  onReset: () => void;
}

const leadStages = [
  "Registered",
  "Documents Pending",
  "Verification Pending",
  "Verified",
  "Photos Pending",
  "Menu Pending",
  "Approved",
  "Rejected",
  "Published",
];

const verificationStatuses = ["Pending", "Approved", "Rejected", "Verified"];

export default function VendorCrmFilters({ vendors, filters, onFiltersChange, onReset }: VendorCrmFiltersProps) {
  const assignedOptions = Array.from(new Set(vendors.map((vendor) => vendor.assignedTo).filter(Boolean))) as string[];
  const cities = Array.from(new Set(vendors.map((vendor) => vendor.city).filter(Boolean))) as string[];

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
          <p className="text-sm text-slate-500">Refine the vendor pipeline by stage, status, ownership, and follow-up priority.</p>
        </div>
        <button type="button" onClick={onReset} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Lead Stage
          <select value={filters.leadStage} onChange={(event) => onFiltersChange({ leadStage: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="">All</option>
            {leadStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Verification Status
          <select value={filters.verificationStatus} onChange={(event) => onFiltersChange({ verificationStatus: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="">All</option>
            {verificationStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          City
          <select value={filters.city} onChange={(event) => onFiltersChange({ city: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="">All</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Assigned To
          <select value={filters.assignedTo} onChange={(event) => onFiltersChange({ assignedTo: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="">All</option>
            {assignedOptions.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Min Quality
          <input type="number" value={filters.minQuality} onChange={(event) => onFiltersChange({ minQuality: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Max Quality
          <input type="number" value={filters.maxQuality} onChange={(event) => onFiltersChange({ maxQuality: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={filters.followUpDueToday} onChange={(event) => onFiltersChange({ followUpDueToday: event.target.checked })} />
          Follow-up due today
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={filters.incompleteProfile} onChange={(event) => onFiltersChange({ incompleteProfile: event.target.checked })} />
          Incomplete profile
        </label>
      </div>
    </div>
  );
}

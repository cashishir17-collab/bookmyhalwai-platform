import type { VendorTimelineEntry } from "./types";

interface VendorTimelineProps {
  entries: VendorTimelineEntry[];
}

function formatDate(value: unknown) {
  if (!value) return "—";
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleString();
  }
  return String(value);
}

export default function VendorTimeline({ entries }: VendorTimelineProps) {
  if (!entries.length) {
    return <p className="text-sm text-slate-500">No timeline entries yet.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{entry.type}</p>
            <p className="text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">{entry.note}</p>
          <p className="mt-2 text-xs text-slate-500">By {entry.createdBy || "Admin"}</p>
        </div>
      ))}
    </div>
  );
}

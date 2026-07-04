import type { VerificationChecklistItem } from "./types";

interface VerificationChecklistProps {
  items: VerificationChecklistItem[];
}

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-rose-100 text-rose-700",
  "Needs Re-upload": "bg-sky-100 text-sky-700",
};

export default function VerificationChecklist({ items }: VerificationChecklistProps) {
  const completed = items.filter((item) => item.status === "Approved").length;
  const progress = Math.round((completed / items.length) * 100);

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Verification Checklist</h3>
          <p className="mt-1 text-sm text-slate-500">Track the mandatory verification items for this vendor.</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">{progress}%</div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              {item.note ? <p className="mt-1 text-xs text-slate-500">{item.note}</p> : null}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

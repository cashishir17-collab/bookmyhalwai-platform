interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Cancelled: "bg-slate-200 text-slate-700",
  Completed: "bg-sky-100 text-sky-700",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

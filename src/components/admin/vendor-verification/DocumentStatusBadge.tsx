interface DocumentStatusBadgeProps {
  status: "Approved" | "Pending" | "Rejected" | "Needs Re-upload";
}

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-rose-100 text-rose-700",
  "Needs Re-upload": "bg-sky-100 text-sky-700",
};

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>;
}

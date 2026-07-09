interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Pending: "badge-warning",
  Accepted: "badge-success",
  Approved: "badge-success",
  Rejected: "bg-rose-100 text-rose-700",
  Cancelled: "badge-inactive",
  Completed: "badge-info",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusStyles[status] || "badge-inactive"}`}>
      {status}
    </span>
  );
}

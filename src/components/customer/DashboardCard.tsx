interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  accent: "orange" | "emerald" | "blue" | "violet";
}

const accentStyles = {
  orange: "badge-featured text-orange-700",
  emerald: "badge-success text-emerald-700",
  blue: "badge-info text-teal-700",
  violet: "bg-violet-50 text-violet-700",
};

export default function DashboardCard({ title, value, description, accent }: DashboardCardProps) {
  return (
    <div className="card-dashboard p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <span className={`badge ${accentStyles[accent]}`}>{title}</span>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

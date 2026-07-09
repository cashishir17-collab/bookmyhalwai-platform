interface StatItem {
  title: string;
  value: number | string;
  detail: string;
  accent: "orange" | "blue" | "emerald" | "violet" | "rose";
}

interface VendorAcquisitionStatsProps {
  stats: StatItem[];
}

const accentStyles = {
  orange: "badge-featured text-orange-700",
  blue: "badge-info text-teal-700",
  emerald: "badge-success text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
};

export default function VendorAcquisitionStats({ stats }: VendorAcquisitionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="card-stat p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
          <span className={`badge ${accentStyles[stat.accent]}`}>{stat.title}</span>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-600">{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}

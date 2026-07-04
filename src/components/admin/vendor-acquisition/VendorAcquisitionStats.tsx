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
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function VendorAcquisitionStats({ stats }: VendorAcquisitionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className={`rounded-[1.5rem] border p-5 shadow-sm ${accentStyles[stat.accent]}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.24em]">{stat.title}</p>
          <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-600">{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}

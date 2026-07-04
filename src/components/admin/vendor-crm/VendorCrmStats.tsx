interface StatCardProps {
  label: string;
  value: number | string;
  accent: "orange" | "blue" | "emerald" | "violet" | "rose";
}

const accentStyles = {
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

interface VendorCrmStatsProps {
  stats: StatCardProps[];
}

export default function VendorCrmStats({ stats }: VendorCrmStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-[1.75rem] border p-5 shadow-sm ${accentStyles[stat.accent]}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">{stat.label}</p>
          <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

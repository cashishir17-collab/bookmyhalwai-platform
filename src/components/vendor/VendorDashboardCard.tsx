interface VendorDashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  accent: "orange" | "emerald" | "blue" | "violet";
}

const accentStyles = {
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export default function VendorDashboardCard({ title, value, description, accent }: VendorDashboardCardProps) {
  return (
    <div className={`rounded-[1.75rem] border p-6 shadow-sm ${accentStyles[accent]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

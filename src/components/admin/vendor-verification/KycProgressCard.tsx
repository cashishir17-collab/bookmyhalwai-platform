interface KycProgressCardProps {
  title: string;
  value: number | string;
  details?: string;
  accent: "orange" | "blue" | "emerald" | "violet" | "rose";
}

const accentStyles = {
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function KycProgressCard({ title, value, details, accent }: KycProgressCardProps) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm ${accentStyles[accent]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      {details ? <p className="mt-2 text-sm text-slate-600">{details}</p> : null}
    </div>
  );
}

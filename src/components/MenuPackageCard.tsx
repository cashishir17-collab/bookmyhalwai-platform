export interface MenuPackageCardProps {
  title: string;
  price: number;
  features: string[];
  liveCounter: boolean;
  foodType: string;
}

export default function MenuPackageCard({
  title,
  price,
  features,
  liveCounter,
  foodType,
}: MenuPackageCardProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">₹{price}</p>
          <p className="text-sm text-slate-500">per plate</p>
        </div>
        <div className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          {foodType}
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          {liveCounter ? "Live Counter" : "No Live Counter"}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          {foodType}
        </span>
      </div>
    </article>
  );
}

import Link from "next/link";

export interface Caterer {
  id: string;
  name: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  events: number;
  cuisines: string[];
  foodType?: string;
  liveCounter?: boolean;
  outdoorCatering?: boolean;
}

interface CatererCardProps {
  caterer: Caterer;
}

export default function CatererCard({ caterer }: CatererCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-52 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100 px-6 py-5">
        <div className="flex h-full flex-col justify-between rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.16),_transparent_55%),linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] p-5 text-slate-900 shadow-inner">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
            Caterer Spotlight
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-4xl font-semibold leading-tight">{caterer.rating.toFixed(1)}</p>
              <p className="text-sm text-slate-500">Rated high by customers</p>
            </div>
            <div className="rounded-3xl bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">
              {caterer.city}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{caterer.name}</h2>
              <p className="text-sm text-slate-500">{caterer.location}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Verified
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{caterer.events} events</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">₹{caterer.price}/plate</span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">Top Rated</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {caterer.cuisines.map((cuisine) => (
            <span key={cuisine} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {cuisine}
            </span>
          ))}
        </div>

        <div className="pt-4">
          <Link
            href={`/caterers/${caterer.id}`}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-orange-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

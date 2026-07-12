import Link from "next/link";
import Image from "next/image";

export interface Caterer {
  id: string;
  name: string;
  location: string;
  city: string;
  image?: string;
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
  const imageSrc = caterer.image || "/images/home/hero-luxury.jpg";

  return (
    <article className="premium-card group overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden border-b border-slate-200">
        <Image
          src={imageSrc}
          alt={`${caterer.name} catering presentation in ${caterer.city}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081427]/88 via-[#081427]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4">
          <div className="rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(8,20,39,0.78)] px-3 py-2 text-white backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-[rgba(255,255,255,0.86)]">Customer Rating</p>
            <p className="mt-1 text-xl font-semibold">{caterer.rating.toFixed(1)} / 5</p>
          </div>
          <div className="rounded-full bg-[#F5E7C8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B1830] shadow-sm">
            {caterer.city}
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
            <span className="rounded-full bg-[#F5F3FF] px-3 py-1 text-[#0F172A]">Top Rated</span>
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
          <Link href={`/enquiries/new?vendorId=${encodeURIComponent(caterer.id)}&vendorName=${encodeURIComponent(caterer.name)}`} className="mb-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#0F6456] px-4 py-3 text-sm font-semibold text-white">Request Quotation</Link>
          <Link
            href={`/caterers/${caterer.id}`}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#1E293B]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const eventTypes = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Griha Pravesh",
  "Corporate Event",
  "Religious Function",
];

const caterers = [
  {
    name: "Sharma Halwai & Caterers",
    location: "Noida",
    price: "₹450/plate onwards",
    rating: "4.8",
  },
  {
    name: "Royal Feast Caterers",
    location: "Delhi NCR",
    price: "₹650/plate onwards",
    rating: "4.7",
  },
  {
    name: "Annapurna Rasoi",
    location: "Ghaziabad",
    price: "₹350/plate onwards",
    rating: "4.6",
  },
];

const partnerBenefits = [
  {
    title: "Verified exposure",
    text: "Showcase your business to high-intent customers across wedding, corporate, and social events.",
    icon: BadgeCheck,
  },
  {
    title: "Lead generation",
    text: "Receive curated enquiries from customers who are actively planning their celebrations.",
    icon: Users,
  },
  {
    title: "Revenue growth",
    text: "Use analytics-backed pricing and packaged offerings to scale faster with predictable demand.",
    icon: TrendingUp,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_38%),linear-gradient(180deg,_#fffaf5_0%,_#ffffff_100%)] text-slate-900">
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 shadow-sm">
            <Sparkles className="h-4 w-4" /> Premium catering marketplace for growth
          </div>
          <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Become a Verified BookMyHalwai Partner
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Join India&apos;s fastest growing catering marketplace and unlock more leads, enquiries, and business momentum.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/vendor/register" className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700">
              Register Now
            </Link>
            <Link href="/caterers" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600">
              Explore Marketplace
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-5xl gap-3 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
              <MapPin className="h-5 w-5 text-orange-500" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="City" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
              <CalendarDays className="h-5 w-5 text-orange-500" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Event Type" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
              <UtensilsCrossed className="h-5 w-5 text-orange-500" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Guests" />
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700">
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Why Caterers Love BookMyHalwai</h3>
            <span className="text-sm text-slate-500">Designed for premium growth</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {partnerBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Popular event types</h3>
            <span className="text-sm text-slate-500">Tailored for every celebration</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((event) => (
              <div key={event} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 text-center font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                {event}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Featured caterers</h3>
            <Link href="/caterers" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700">
              Explore all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {caterers.map((caterer) => (
              <div key={caterer.name} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="h-40 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.2),_transparent_45%),linear-gradient(135deg,_#fff7ed_0%,_#ffedd5_100%)]" />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-slate-900">{caterer.name}</h4>
                  <p className="mt-1 text-sm text-slate-600">{caterer.location}</p>
                  <p className="mt-3 font-semibold text-slate-900">{caterer.price}</p>
                  <p className="mt-2 text-sm text-slate-600">⭐ {caterer.rating} rating</p>
                  <button className="mt-5 w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

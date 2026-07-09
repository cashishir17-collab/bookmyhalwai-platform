import Link from "next/link";
import { BadgeCheck, Building2, Clock3, Handshake, ShieldCheck, Sparkles } from "lucide-react";

const trustPillars = [
  {
    title: "Verified vendor quality",
    description:
      "Every listed partner goes through profile, service, and document checks before becoming discoverable.",
    icon: ShieldCheck,
  },
  {
    title: "Faster event planning",
    description:
      "Shortlist caterers by budget, cuisine, and city so families can move from browsing to booking confidently.",
    icon: Clock3,
  },
  {
    title: "Growth for caterers",
    description:
      "We help serious catering businesses build predictable lead flow with a clean operations workflow.",
    icon: Building2,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),_transparent_42%),linear-gradient(180deg,_#fffaf5_0%,_#ffffff_100%)] px-4 py-14 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-10 rounded-[2.5rem] border border-orange-100 bg-white/90 p-8 shadow-xl backdrop-blur sm:p-10 lg:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          <Sparkles className="h-3.5 w-3.5" /> About BookMyHalwai
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Built for celebrations that matter.</h1>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              BookMyHalwai is a vendor-first catering platform focused on trust, speed, and operational clarity.
              We connect families and event planners with verified caterers, while giving partners a structured
              path to onboard, get discovered, and scale their business.
            </p>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              From weddings and birthdays to corporate events, our goal is simple: better food experiences,
              fewer planning headaches, and transparent vendor collaboration.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/caterers"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/vendor/register"
                className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-700"
              >
                Become a Partner
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-orange-50/70 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">What we optimize for</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-4 w-4 text-orange-600" />
                Verified vendors and cleaner customer trust signals.
              </li>
              <li className="flex items-start gap-3">
                <Handshake className="mt-0.5 h-4 w-4 text-orange-600" />
                Transparent communication from inquiry to booking.
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-orange-600" />
                Vendor dashboards built for real business operations.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
        {trustPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.title}
              className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
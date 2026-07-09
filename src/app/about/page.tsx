import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Building2, Rocket, ShieldCheck, Sparkles, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "About BookMyHalwai | Trusted Halwai & Caterer Marketplace",
  description: "Learn how BookMyHalwai is building India’s trusted digital marketplace for verified halwais and caterers.",
};

const vendorReasons = [
  "Early visibility",
  "Verified profile",
  "Compliance support",
  "Digital showcase",
  "Launch-phase advantage",
];

export default function AboutPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-14 text-slate-900 sm:px-6 lg:px-8">
      <section className="section-shell mx-auto max-w-6xl space-y-10 rounded-[2rem] p-8 sm:p-10 lg:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          <Sparkles className="h-3.5 w-3.5" /> About BookMyHalwai
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Building India’s trusted marketplace for halwais and caterers</h1>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              BookMyHalwai helps customers discover verified catering partners, while helping vendors build a digital presence and receive future booking opportunities.
            </p>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-slate-900">Current phase</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                We are currently onboarding vendors before opening customer bookings.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-slate-900">Our vision</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                To organize India&apos;s traditional catering ecosystem into a trusted, verified, digital marketplace.
              </p>
            </article>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/vendor/register" className="btn btn-primary btn-lg type-button w-full sm:w-auto">
                Become a BookMyHalwai Partner
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg type-button w-full sm:w-auto">
                Talk to Onboarding Team
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <article className="rounded-[2rem] border border-orange-100 bg-orange-50/70 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Why vendors should join</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {vendorReasons.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <BadgeCheck className="h-4 w-4 text-orange-600" /> {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">What we do</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-3"><Store className="h-4 w-4 text-orange-600" /> Build trusted vendor presence online</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-orange-600" /> Verify partners before listing</li>
                <li className="flex items-center gap-3"><Building2 className="h-4 w-4 text-orange-600" /> Prepare vendors for city-wide scale</li>
                <li className="flex items-center gap-3"><Rocket className="h-4 w-4 text-orange-600" /> Enable growth-ready launch advantage</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { INDIA_STATES } from "@/data/indiaLocations";

export const metadata: Metadata = {
  title: "Event Vendors by State, City & Town | BookMyHalwai",
  description: "Browse verified event vendors across all Indian states and union territories, including thousands of cities and towns.",
};

export default function LocationsPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="section-shell rounded-[2rem] p-8 text-center sm:p-12">
          <p className="type-label text-[#0F6456]">India-Wide Discovery</p>
          <h1 className="type-h1 mt-3 text-[#0B1830]">Find event partners near you</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#51657D]">Browse all 28 states and 8 union territories. Every state directory includes cities, towns and localities covered by our onboarding system.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INDIA_STATES.map((state) => (
            <article key={state.code} className="premium-card rounded-3xl p-6">
              <MapPin className="h-6 w-6 text-[#0F6456]" />
              <h2 className="mt-4 text-lg font-semibold text-[#0B1830]">{state.name}</h2>
              <p className="mt-2 text-sm text-[#5A6E84]">{state.cities.length.toLocaleString("en-IN")} cities, towns & localities</p>
              <Link href={`/vendors?state=${encodeURIComponent(state.name)}`} className="mt-4 inline-flex text-sm font-semibold text-[#0F6456] hover:underline">Browse approved vendors</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

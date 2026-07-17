import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { ServiceIcon } from "@/components/marketplace/ServiceIcon";
import { COMING_SOON_SERVICES, MARKETPLACE_SERVICES } from "@/data/marketplace";

export const metadata: Metadata = {
  title: "Event Services Directory | BookMyHalwai",
  description: "Explore catering, venues, decor, music, photography and videography, beauty, religious and guest services for events across India.",
};

export default function ServicesPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="section-shell rounded-[2rem] p-8 text-center sm:p-12">
          <p className="type-label text-[#0F6456]">Complete Event Marketplace</p>
          <h1 className="type-h1 mt-3 text-[#0B1830]">Every service for every celebration</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#51657D]">From food and venues to entertainment, rituals and guest gifting, discover the professionals who bring an event together.</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETPLACE_SERVICES.map((service) => (
            <Link key={service.slug} href={`/vendors/${service.slug}`} className="premium-card group rounded-3xl p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F0] text-[#0F6456]"><ServiceIcon name={service.icon} /></span>
              <h2 className="mt-5 text-xl font-semibold text-[#0B1830]">{service.label}</h2>
              <p className="mt-2 text-sm leading-7 text-[#51657D]">{service.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F6456]">Explore vendors <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-[2rem] border border-[#DCCDB2] bg-[#0B1830] p-8 text-white sm:p-10">
          <div className="flex items-center gap-3"><Clock3 className="h-6 w-6 text-[#C7A667]" /><h2 className="text-2xl font-semibold text-white">More services coming soon</h2></div>
          <div className="mt-6 flex flex-wrap gap-3">{COMING_SOON_SERVICES.map((service) => <span key={service} className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-[#E8DDC7]">{service}</span>)}</div>
        </section>
      </section>
    </main>
  );
}

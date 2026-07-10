import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Caterers | Coming Soon | BookMyHalwai",
  description: "Customer booking is coming soon as BookMyHalwai onboards and verifies catering partners across India.",
};

export default function CaterersPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-14 text-slate-900 sm:px-6 lg:px-8">
      <section className="section-shell mx-auto max-w-5xl rounded-[2rem] p-8 sm:p-10 lg:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C4B5FD] bg-[#F5F3FF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A]">
          <CalendarClock className="h-3.5 w-3.5" /> Marketplace Update
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Customer Booking is Coming Soon</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          We are currently onboarding and verifying halwais and caterers across India. Customer booking will open after a strong verified vendor base is ready.
        </p>

        <div className="mt-8 grid gap-4 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A]"><Sparkles className="h-4 w-4" /> Onboarding in progress</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Vendor verification is active and city-wise onboarding batches are underway.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><ShieldCheck className="h-4 w-4" /> Trust note</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Only verified partners will be listed when customer booking opens.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/vendor/register"
            className="inline-flex items-center rounded-full bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E293B]"
          >
            Become a Partner
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-[#6D28D9]"
          >
            Contact Onboarding Team
          </Link>
        </div>
      </section>
    </main>
  );
}

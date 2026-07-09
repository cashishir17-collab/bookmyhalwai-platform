import Link from "next/link";
import { CalendarClock, Rocket, Sparkles } from "lucide-react";

export default function CaterersPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),_transparent_45%),linear-gradient(180deg,_#fffaf5_0%,_#ffffff_100%)] px-4 py-14 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[2.5rem] border border-orange-100 bg-white p-8 shadow-xl sm:p-10 lg:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          <CalendarClock className="h-3.5 w-3.5" /> Marketplace Update
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Caterer Marketplace Is Coming Soon</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          We are currently onboarding verified catering partners city by city. The full customer marketplace
          experience will go live soon with trusted listings, transparent packages, and faster booking flow.
        </p>

        <div className="mt-8 grid gap-4 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              <Rocket className="h-4 w-4" /> Live Vendor Onboarding
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Vendors are being reviewed and approved in batches. Join now to secure early placement.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              <Sparkles className="h-4 w-4" /> Priority Visibility
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Early partners get stronger profile visibility when the next city launch goes live.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/vendor/register"
            className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-700"
          >
            Become a Partner
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            Talk to Partnerships Team
          </Link>
        </div>
      </section>
    </main>
  );
}

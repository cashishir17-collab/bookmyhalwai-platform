import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleCheckBig, MapPin, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "BookMyHalwai | Premium Catering Marketplace",
  description: "BookMyHalwai connects celebrations with verified premium halwais and professional caterers across India.",
};

const trustItems = [
  { title: "Verified Vendors", description: "Every listed partner passes profile and compliance checks.", icon: BadgeCheck },
  { title: "Trusted Marketplace", description: "Built for wedding families, planners, and premium events.", icon: ShieldCheck },
  { title: "Quality Assured", description: "Service standards designed for hospitality-grade consistency.", icon: Sparkles },
  { title: "Professional Caterers", description: "Specialists in weddings, festivals, and luxury gatherings.", icon: UsersRound },
  { title: "Growing Across India", description: "Expanding city by city with curated partner onboarding.", icon: MapPin },
];

const whyItems = [
  {
    title: "Curated Vendor Profiles",
    description: "Elegant vendor pages with service highlights, menu visibility, and trust credentials.",
  },
  {
    title: "Verification-First Approach",
    description: "Vendor quality checks help customers book with greater confidence.",
  },
  {
    title: "Marketplace-Ready Experience",
    description: "Professional UI for premium discovery and efficient enquiry journeys.",
  },
];

const onboardingSteps = ["Register", "Verification", "Profile Live", "Receive Enquiries"];

export default function Home() {
  return (
    <main className="page-shell min-h-screen text-[#11233D]">
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="section-shell luxury-ring rounded-[2rem] p-8 sm:p-10 lg:p-12">
            <p className="type-label text-[#0F6456]">Premium Wedding & Hospitality Marketplace</p>
            <h1 className="type-display mt-4 max-w-2xl text-[#0B1830]">Find the Perfect Halwai for Every Celebration</h1>
            <p className="type-body-lg mt-6 max-w-xl text-[#3A4D64]">
              Discover verified catering partners trusted for weddings, festive gatherings, and milestone events. Designed to bring premium hospitality standards to every booking.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/caterers" className="btn btn-primary btn-lg type-button w-full sm:w-auto">
                Find Caterers
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/vendor/register" className="btn btn-outline btn-lg type-button w-full sm:w-auto">
                Become a Partner
              </Link>
            </div>

            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              <div className="glass-strip rounded-2xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#1B3656]">Verified Vendors</div>
              <div className="glass-strip rounded-2xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#1B3656]">Premium Marketplace</div>
              <div className="glass-strip rounded-2xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#1B3656]">Across India</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#DCCDB2] bg-gradient-to-br from-[#0B1830] via-[#1A3657] to-[#0F6456] p-8 shadow-[0_28px_58px_rgba(11,24,48,0.3)] sm:p-10">
            <div className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-full bg-[#D7BA7D]/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-[#FCF8EE]/20 blur-2xl" />

            <div className="relative">
              <p className="type-label text-[#E6D5B8]">Luxury Hospitality Banner</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#F7F1E4] sm:text-4xl">
                Crafted for Wedding Catering Excellence
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#E7DDCC] sm:text-base">
                Showcase your culinary signature with a refined digital presence inspired by premium buffets, professional chefs, and celebration-first service.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#D7BA7D]/50 bg-[#F7F1E4]/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#DCC8A3]">Wedding Catering</p>
                  <p className="mt-2 text-sm font-semibold text-[#F7F1E4]">Signature menus and live counters for destination-style celebrations.</p>
                </div>
                <div className="rounded-2xl border border-[#D7BA7D]/50 bg-[#F7F1E4]/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#DCC8A3]">Professional Chefs</p>
                  <p className="mt-2 text-sm font-semibold text-[#F7F1E4]">Trusted halwais and hospitality teams for flawless execution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="premium-card rounded-3xl p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF5F3] text-[#0F6456]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg text-[#0B1830]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#51657D]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="type-label text-[#0F6456]">Why BookMyHalwai</p>
            <h2 className="type-h1 mt-3 text-[#0B1830]">A Premium Marketplace Experience Built for Trust</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {whyItems.map((item, index) => (
              <article key={item.title} className="section-shell rounded-3xl p-7">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1830] text-sm font-semibold text-[#F7F1E4]">
                  0{index + 1}
                </span>
                <h3 className="mt-5 font-serif text-2xl text-[#0B1830]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#4E6178]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#DCCDB2] bg-[#FFFCF5] p-8 shadow-[0_18px_44px_rgba(11,24,48,0.12)] sm:p-10">
          <div className="mb-8 text-center">
            <p className="type-label text-[#0F6456]">How It Works</p>
            <h2 className="type-h2 mt-3 text-[#0B1830]">Simple Timeline to Go Live</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {onboardingSteps.map((step, index) => (
              <article key={step} className="premium-card rounded-3xl p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1830] text-sm font-semibold text-[#F7F1E4]">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#304A65]">{step}</p>
                <CircleCheckBig className="mx-auto mt-4 h-5 w-5 text-[#0F6456]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-[#D7BA7D]/55 bg-gradient-to-r from-[#071123] via-[#0B1830] to-[#114C45] p-10 shadow-[0_28px_58px_rgba(11,24,48,0.32)] sm:p-14">
          <p className="type-label text-[#DCC8A3]">Final Call to Action</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-[#F7F1E4] sm:text-5xl">
            Ready to Grow Your Catering Business?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#E8DECB] sm:text-base">
            Join a premium marketplace crafted for trusted hospitality brands and celebration-focused customer discovery.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/vendor/register" className="btn btn-outline btn-lg type-button w-full border-[#D7BA7D] bg-[#D7BA7D] text-[#0B1830] hover:bg-[#E3CCA0] sm:w-auto">
              Become a Partner
            </Link>
            <Link href="/contact" className="btn btn-lg type-button w-full border border-[#D7BA7D]/60 bg-transparent px-7 text-[#F7F1E4] hover:bg-[#D7BA7D]/15 sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Clock3, FileCheck2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "BookMyHalwai | Partner with India’s Catering Marketplace",
  description: "Join BookMyHalwai as a verified halwai or catering partner. Vendor onboarding is live across India.",
};

const benefitCards = [
  "Get discovered by customers",
  "Build a professional digital profile",
  "Showcase menus, photos, and services",
  "Get verified before going live",
  "GST/FSSAI assistance available",
  "Direct onboarding support",
];

const onboardingSteps = [
  "Register your business",
  "Upload profile and documents",
  "BookMyHalwai verifies your details",
  "Your profile goes live",
  "Receive customer enquiries when booking launches",
];

const faqItems = [
  {
    question: "Is registration free?",
    answer: "Yes. Vendor onboarding is free during the launch phase for early verified partners.",
  },
  {
    question: "Who can register?",
    answer: "Halwais, caterers, sweet makers, live counter specialists, and event food partners can register.",
  },
  {
    question: "Do I need GST?",
    answer: "GST is recommended for business readiness. Support is available if you need help.",
  },
  {
    question: "Do I need FSSAI?",
    answer: "FSSAI strengthens trust and listing readiness. We can guide you if documentation is pending.",
  },
  {
    question: "What happens after registration?",
    answer: "Our team reviews your profile, documents, and service information for verification.",
  },
  {
    question: "How long does verification take?",
    answer: "Verification timelines vary by profile completeness, but complete submissions are prioritized.",
  },
  {
    question: "When will customer booking start?",
    answer: "Customer booking opens after a strong verified vendor base is live across target cities.",
  },
  {
    question: "Can small halwais join?",
    answer: "Absolutely. Quality and reliability matter more than business size.",
  },
  {
    question: "Can I update my profile later?",
    answer: "Yes. Vendors can update profile details, services, and uploads as operations evolve.",
  },
  {
    question: "How does BookMyHalwai help me grow?",
    answer: "By improving digital visibility, trust signals, and structured marketplace presence for long-term growth.",
  },
];

const popularCities = ["Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad", "Lucknow", "Jaipur", "Chandigarh"];
const cuisineCategories = ["North Indian", "South Indian", "Traditional Sweets", "Live Counters", "Wedding Catering", "Corporate Catering"];

export default function Home() {
  return (
    <main className="page-shell min-h-screen text-slate-900">
      <section className="px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell rounded-[2rem] p-8 sm:p-10 lg:p-12">
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Vendor Onboarding is LIVE
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C4B5FD] bg-[#F5F3FF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F172A]">
                <Sparkles className="h-3.5 w-3.5" /> Launch Offer: Free onboarding for early verified partners.
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Grow Your Catering Business with BookMyHalwai
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Join India&apos;s dedicated marketplace for halwais, caterers, live counters, and event food partners.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/vendor/register" className="btn btn-primary btn-lg type-button w-full sm:w-auto">
                Become a Partner
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg type-button w-full sm:w-auto">
                Talk to Onboarding Team
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {benefitCards.map((item) => (
                <article key={item} className="premium-card rounded-2xl p-4 text-sm font-medium text-slate-700">
                  <p className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {item}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How It Works</h2>
            <span className="text-sm font-medium text-slate-500">Simple onboarding flow</span>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {onboardingSteps.map((step, index) => (
              <article key={step} className="premium-card rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F172A]">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Traditional catering growth</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Word of mouth only</li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Limited online presence</li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">No verified profile</li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Manual enquiry handling</li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Low city-wide visibility</li>
            </ul>
          </div>

          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">BookMyHalwai growth path</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">Digital discovery</li>
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">Verified partner profile</li>
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">Menu and photo showcase</li>
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">Better trust with customers</li>
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">Growth-ready marketplace presence</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="type-label text-[#0F172A]">Compliance Support</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Need GST or FSSAI support?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Vyasa Vittam can help vendors with GST registration, FSSAI licensing, accounting, and tax support so your profile is marketplace-ready.
            </p>
            <Link href="/contact" className="btn btn-primary btn-md type-button mt-6">
              Get Compliance Help
            </Link>
          </div>

          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="type-label text-[#0F172A]">Launch Readiness</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Built for trusted onboarding</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <BadgeCheck className="h-4 w-4 text-emerald-600" /> Verification-first partner listing
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <FileCheck2 className="h-4 w-4 text-emerald-600" /> Profile and document quality checks
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Clock3 className="h-4 w-4 text-emerald-600" /> Guided onboarding support team
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Popular Cities</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <span key={city} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Cuisine Categories</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {cuisineCategories.map((cuisine) => (
                <span key={cuisine} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl section-shell rounded-[1.8rem] p-7 sm:p-9">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl section-shell rounded-[1.8rem] p-8 text-center sm:p-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Launch phase active
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Become a BookMyHalwai Partner Today</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Start your onboarding now and secure early visibility as verified vendor listings prepare for launch.
          </p>
          <Link href="/vendor/register" className="btn btn-primary btn-lg type-button mt-7 w-full sm:w-auto">
            Start Free Registration
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock3,
  Handshake,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const trustStats = [
  { label: "Verified Vendors", value: "450+" },
  { label: "Cities Expanding", value: "22" },
  { label: "Response SLA", value: "< 30 mins" },
  { label: "Support Coverage", value: "7 days" },
];

const howItWorks = [
  {
    title: "Share event details",
    description: "Post your city, guest count, and cuisine preference in minutes.",
    icon: CalendarDays,
  },
  {
    title: "Compare verified partners",
    description: "Review credentials, packages, and service quality from trusted vendors.",
    icon: ShieldCheck,
  },
  {
    title: "Confirm confidently",
    description: "Finalize faster with transparent communication and structured onboarding.",
    icon: Handshake,
  },
];

const customerBenefits = [
  {
    title: "Enterprise-grade verification",
    text: "Business, compliance, and quality checkpoints build stronger trust before bookings begin.",
    icon: BadgeCheck,
  },
  {
    title: "Operational reliability",
    text: "Clear timelines, professional communication, and disciplined response standards for every enquiry.",
    icon: Clock3,
  },
  {
    title: "National scalability",
    text: "A standardized marketplace framework designed to scale from local events to large celebrations.",
    icon: Building2,
  },
];

const platformFeatures = [
  "Verified halwai and catering partner network",
  "Structured lead allocation and vendor discovery",
  "Transparent package visibility and service scope",
  "Dedicated onboarding for premium vendor quality",
  "Multi-event support: wedding, social, corporate",
  "Continuous quality and profile completeness reviews",
];

const featuredCaterers = [
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

const testimonials = [
  {
    quote:
      "The platform helped us shortlist quality vendors quickly and reduced back-and-forth during wedding planning.",
    name: "Ritika Malhotra",
    role: "Customer, Delhi NCR",
  },
  {
    quote:
      "Onboarding felt structured and premium. We started receiving high-intent leads within the first cycle.",
    name: "Aman Sharma",
    role: "Owner, Sharma Halwai & Caterers",
  },
  {
    quote:
      "Clear process, better trust, and highly professional experience from discovery to booking discussions.",
    name: "Surbhi Jain",
    role: "Event Planner, Noida",
  },
];

const faqItems = [
  {
    question: "How are vendors verified on BookMyHalwai?",
    answer:
      "Each vendor goes through profile, document, and service-quality checks before receiving visibility in the marketplace.",
  },
  {
    question: "Can I compare multiple caterers before booking?",
    answer:
      "Yes. You can evaluate package levels, event fit, and credentials before deciding your preferred partner.",
  },
  {
    question: "Is BookMyHalwai only for weddings?",
    answer:
      "No. The platform supports wedding, social, private, and corporate event catering requirements.",
  },
  {
    question: "How can vendors join the platform?",
    answer:
      "Vendors can register through the partner onboarding form and complete verification to start receiving qualified leads.",
  },
];

export default function Home() {
  return (
    <main className="page-shell min-h-screen text-slate-900">
      <section className="px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up section-shell rounded-[2rem] p-8 sm:p-10 lg:p-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <Sparkles className="h-3.5 w-3.5" /> India&apos;s Premium Catering Marketplace
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Book trusted halwai and catering partners for every celebration.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              BookMyHalwai connects customers with verified vendors across weddings, social events, and enterprise gatherings, with a professional and transparent experience end-to-end.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/caterers"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                Explore Vendors
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/vendor/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
              >
                Become a Partner
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="animate-fade-up section-shell rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Quick Discovery</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Find the right food partner faster</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Discover verified profiles aligned to your event size, cuisine style, and service expectations.
            </p>

            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <MapPin className="h-4 w-4 text-orange-600" />
                <input className="w-full bg-transparent text-sm text-slate-700 outline-none" placeholder="City" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <CalendarDays className="h-4 w-4 text-orange-600" />
                <input className="w-full bg-transparent text-sm text-slate-700 outline-none" placeholder="Event Type" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                <input className="w-full bg-transparent text-sm text-slate-700 outline-none" placeholder="Guests" />
              </label>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How It Works</h2>
            <span className="text-sm font-medium text-slate-500">Simple, trusted, professional</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="premium-card rounded-3xl p-6 transition hover:-translate-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Why BookMyHalwai</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Built for confidence at every stage</h2>
            <div className="mt-6 grid gap-4">
              {customerBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Icon className="h-4 w-4 text-orange-700" /> {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Platform Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Designed for scale and quality</h2>
            <ul className="mt-6 space-y-3">
              {platformFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Featured Vendors</h2>
            <Link href="/caterers" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800">
              View marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredCaterers.map((caterer) => (
              <article key={caterer.name} className="premium-card overflow-hidden rounded-3xl transition hover:-translate-y-1">
                <div className="h-36 border-b border-slate-200 bg-[#f8f4ea] px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verified Profile</p>
                  <p className="mt-2 text-sm text-slate-600">Curated for consistency and service quality</p>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{caterer.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{caterer.location}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{caterer.price}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-600">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                    {caterer.rating} customer rating
                  </p>
                  <button className="mt-5 w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl section-shell rounded-[1.8rem] p-7 sm:p-9">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Testimonials</h2>
            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
              <MessageSquareText className="h-4 w-4" /> Customer and vendor voices
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm leading-7 text-slate-700">“{item.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Frequently Asked Questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Common questions, clearly answered</h2>
            <div className="mt-6 space-y-3">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-shell rounded-[1.8rem] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">For Vendors</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Grow with a premium partner network</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Join a trusted marketplace built for serious food businesses. Complete onboarding, verify your profile, and get matched to high-intent customer demand.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Users className="h-4 w-4 text-orange-700" /> Curated lead access
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-orange-700" /> Structured verification workflow
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Building2 className="h-4 w-4 text-orange-700" /> Marketplace-ready profile standards
              </li>
            </ul>
            <Link
              href="/vendor/register"
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:w-auto"
            >
              Start Vendor Registration
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

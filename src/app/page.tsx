import type { Metadata } from "next";
import Image from "next/image";
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
    image: "/images/home/serving-staff.jpg",
    alt: "Professional serving staff preparing a premium catering setup.",
  },
  {
    title: "Verification-First Approach",
    description: "Vendor quality checks help customers book with greater confidence.",
    image: "/images/home/halwai-sweets.jpg",
    alt: "A professional halwai preparing sweets in a commercial kitchen.",
  },
  {
    title: "Marketplace-Ready Experience",
    description: "Professional UI for premium discovery and efficient enquiry journeys.",
    image: "/images/home/corporate-catering.jpg",
    alt: "Corporate catering buffet setup with polished table presentation.",
  },
];

const onboardingSteps = ["Register", "Verification", "Profile Live", "Receive Enquiries"];

const experienceGallery = [
  {
    title: "Luxury Wedding Buffet",
    subtitle: "Grand station styling and curated menus.",
    image: "/images/home/hero-luxury.jpg",
    alt: "Luxury wedding buffet with warm ambient lighting and curated food stations.",
  },
  {
    title: "Professional Halwai",
    subtitle: "Traditional craftsmanship with modern execution.",
    image: "/images/home/halwai-sweets.jpg",
    alt: "Professional halwai preparing sweets for an event.",
  },
  {
    title: "Live Food Counters",
    subtitle: "Interactive stations for memorable guest service.",
    image: "/images/home/live-counters.jpg",
    alt: "Live food counters serving fresh dishes at a celebration.",
  },
  {
    title: "Corporate Catering",
    subtitle: "Business events with hospitality-grade quality.",
    image: "/images/home/corporate-catering.jpg",
    alt: "Professional corporate catering display at a formal event.",
  },
  {
    title: "Birthday Catering",
    subtitle: "Custom experiences for intimate milestones.",
    image: "/images/home/birthday-catering.jpg",
    alt: "Birthday catering table with premium plated desserts and snacks.",
  },
  {
    title: "Wedding Reception",
    subtitle: "Elegant service for once-in-a-lifetime evenings.",
    image: "/images/home/wedding-reception.jpg",
    alt: "Wedding reception dinner arrangement with decorative lighting.",
  },
  {
    title: "Guests Enjoying Food",
    subtitle: "Moments that define trusted hospitality.",
    image: "/images/home/guests-enjoying-food.jpg",
    alt: "Guests enjoying food together at a catered event.",
  },
  {
    title: "Festive Celebrations",
    subtitle: "Indian celebrations with vibrant culinary spreads.",
    image: "/images/home/festive-celebration.jpg",
    alt: "Indian festive celebrations with decorated dining and food service.",
  },
  {
    title: "Professional Serving Staff",
    subtitle: "Disciplined teams for smooth service flow.",
    image: "/images/home/serving-staff.jpg",
    alt: "Professional serving staff managing guests and service flow.",
  },
  {
    title: "Large Catering Setup",
    subtitle: "Scaled operations for high-volume events.",
    image: "/images/home/large-catering-setup.jpg",
    alt: "Large catering setup with multiple counters and coordinated staff.",
  },
];

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

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#DCCDB2] shadow-[0_28px_58px_rgba(11,24,48,0.3)] sm:min-h-[500px] lg:min-h-full">
            <Image
              src="/images/home/hero-luxury.jpg"
              alt="Luxury wedding buffet setup for a premium celebration."
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030912]/76 via-[#071224]/70 to-[#08162A]/65" />

            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
              <p className="type-label text-[rgba(255,255,255,0.96)]">Luxury Hospitality Banner</p>
              <h2
                className="mt-4 max-w-lg font-serif text-3xl font-bold leading-tight tracking-tight text-[#FFFFFF] sm:text-4xl"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
              >
                Crafted for Wedding Catering Excellence
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(255,255,255,0.92)] sm:text-base">
                Showcase your culinary signature with a refined digital presence inspired by premium buffets, professional chefs, and celebration-first service.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(255,255,255,0.15)] bg-[rgba(10,20,35,0.88)] p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#FFFFFF]">Wedding Catering</p>
                  <p className="mt-2 text-sm font-semibold text-[rgba(255,255,255,0.92)]">Signature menus and live counters for destination-style celebrations.</p>
                </div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.15)] bg-[rgba(10,20,35,0.88)] p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#FFFFFF]">Professional Chefs</p>
                  <p className="mt-2 text-sm font-semibold text-[rgba(255,255,255,0.92)]">Trusted halwais and hospitality teams for flawless execution.</p>
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

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="type-label text-[#0F6456]">Celebration Photography</p>
            <h2 className="type-h2 mt-3 text-[#0B1830]">Premium Catering Moments Across Event Types</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {experienceGallery.map((item) => (
              <article key={item.title} className="premium-card overflow-hidden rounded-3xl">
                <div className="relative h-52">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E1D]/90 via-[#060E1D]/48 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <h3 className="font-serif text-lg leading-tight text-[#FFFFFF]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[rgba(255,255,255,0.92)]">{item.subtitle}</p>
                  </div>
                </div>
              </article>
            ))}
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
              <article key={item.title} className="section-shell overflow-hidden rounded-3xl p-7">
                <div className="relative -mt-2 mb-6 h-44 overflow-hidden rounded-2xl">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1830]/58 to-transparent" />
                </div>
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
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-[#D7BA7D]/55 p-10 shadow-[0_28px_58px_rgba(11,24,48,0.32)] sm:p-14">
          <Image
            src="/images/home/festive-celebration.jpg"
            alt="Indian festive celebration with guests and premium catering atmosphere."
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040B17]/84 via-[#0A172A]/80 to-[#0B2434]/80" />

          <div className="relative">
            <p className="type-label text-[#EDD9B6]">Final Call to Action</p>
            <h2
              className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-[#FFFFFF] sm:text-5xl"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              Ready to Grow Your Catering Business?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(255,255,255,0.92)] sm:text-base">
              Join a premium marketplace crafted for trusted hospitality brands and celebration-focused customer discovery.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/vendor/register" className="btn btn-outline btn-lg type-button w-full border-[#D7BA7D] bg-[#D7BA7D] text-[#0B1830] hover:bg-[#E3CCA0] sm:w-auto">
                Become a Partner
              </Link>
              <Link href="/contact" className="btn btn-lg type-button w-full border border-[#D7BA7D]/70 bg-transparent px-7 text-[#FFF8EA] hover:bg-[#D7BA7D]/20 sm:w-auto">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

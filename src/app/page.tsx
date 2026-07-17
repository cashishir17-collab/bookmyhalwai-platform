import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarCheck2, MapPinned, MessageCircle, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { ServiceIcon } from "@/components/marketplace/ServiceIcon";
import { MARKETPLACE_SERVICES } from "@/data/marketplace";

export const metadata: Metadata = {
  title: "BookMyHalwai | Everything Your Event Needs, All in One Place",
  description: "Find verified caterers, venues, decorators, DJs, photography and videography teams, makeup artists and event professionals across India.",
};

const eventTypes = ["Weddings", "Engagements", "Birthdays", "Corporate Events", "Festive Functions", "Religious Ceremonies"];
const popularLocations = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Lucknow", "Pune", "Ahmedabad", "Chandigarh", "Indore"];
const customerSteps = [
  { title: "Tell us what you need", text: "Choose a service, location and event date.", icon: Search },
  { title: "Compare verified partners", text: "Explore approved profiles suited to your event.", icon: BadgeCheck },
  { title: "Send your requirements", text: "Request a quotation with your event details.", icon: MessageCircle },
  { title: "Plan with confidence", text: "Discuss, compare and choose the right partner.", icon: CalendarCheck2 },
];

export default function Home() {
  return (
    <main className="page-shell min-h-screen text-[#11233D]">
      <section className="px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="relative mx-auto min-h-[680px] max-w-7xl overflow-hidden rounded-[2.25rem] border border-[#DCCDB2] shadow-[0_32px_72px_rgba(11,24,48,0.28)]">
          <Image src="/images/home/wedding-reception.jpg" alt="A beautifully prepared Indian celebration venue" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,15,31,0.94)_0%,rgba(7,22,43,0.78)_48%,rgba(7,22,43,0.32)_100%)]" />
          <div className="relative flex min-h-[680px] flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
            <div className="max-w-3xl">
              <p className="type-label text-[#E0C488]">India&apos;s Complete Event Marketplace</p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-7xl">Everything your event needs, all in one place.</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#E8E3D9] sm:text-lg">Discover verified venues, caterers, decorators, DJs, photography and videography teams, artists and celebration professionals across India.</p>
            </div>
            <div className="mt-10 max-w-6xl"><MarketplaceSearch /></div>
            <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-white/90">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#E0C488]" /> Admin-approved partners</span>
              <span className="inline-flex items-center gap-2"><MapPinned className="h-5 w-5 text-[#E0C488]" /> All Indian states & union territories</span>
              <span className="inline-flex items-center gap-2"><UsersRound className="h-5 w-5 text-[#E0C488]" /> Assisted vendor onboarding</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="type-label text-[#0F6456]">Explore Services</p><h2 className="type-h1 mt-3 text-[#0B1830]">Build your event, your way</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#51657D]">One trusted directory for the people and places that bring celebrations to life.</p></div>
            <Link href="/services" className="btn btn-outline btn-lg shrink-0">View all services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MARKETPLACE_SERVICES.map((service) => (
              <Link key={service.slug} href={`/vendors/${service.slug}`} className="premium-card group overflow-hidden rounded-3xl">
                <div className="relative h-36 overflow-hidden">
                  <Image src={service.image} alt={`${service.label} service`} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07162B]/75 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#0F6456] shadow-lg"><ServiceIcon name={service.icon} /></span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#0B1830]">{service.label}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5A6E84]">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#0F6456]">Find vendors <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-[#DCCDB2] shadow-[0_24px_56px_rgba(11,24,48,0.2)]">
            <Image src="/images/home/festive-celebration.jpg" alt="Guests enjoying a vibrant Indian celebration" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061326]/85 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-8"><p className="type-label text-[#E0C488]">For every occasion</p><h2 className="mt-3 font-serif text-3xl font-semibold text-white">One marketplace, countless celebrations</h2></div>
          </div>
          <div className="section-shell rounded-[2rem] p-8 sm:p-10">
            <p className="type-label text-[#0F6456]">Event Types</p>
            <h2 className="type-h2 mt-3 text-[#0B1830]">Start with the moment you are planning</h2>
            <p className="mt-4 text-sm leading-7 text-[#51657D]">BookMyHalwai is built for intimate functions, grand weddings and professional gatherings alike.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{eventTypes.map((event) => <div key={event} className="flex items-center gap-3 rounded-2xl border border-[#DED1BA] bg-white px-4 py-4 text-sm font-semibold text-[#243955]"><Sparkles className="h-5 w-5 text-[#B58D43]" /> {event}</div>)}</div>
            <Link href="/vendors" className="btn btn-primary btn-lg mt-7">Explore all vendors <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] bg-[#0B1830] p-8 sm:p-10 lg:p-12">
          <div className="text-center"><p className="type-label text-[#D8BE89]">How It Works</p><h2 className="type-h1 mt-3 text-white">A clearer way to find event partners</h2></div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {customerSteps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className="rounded-3xl border border-white/10 bg-white/6 p-6"><span className="text-xs font-bold tracking-[0.18em] text-[#D8BE89]">0{index + 1}</span><Icon className="mt-4 h-7 w-7 text-[#D8BE89]" /><h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-7 text-[#D5CCBC]">{step.text}</p></article>; })}
          </div>
          <div className="mt-8 text-center"><Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E0C488] hover:text-white">See the complete journey <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center"><p className="type-label text-[#0F6456]">Popular Locations</p><h2 className="type-h1 mt-3 text-[#0B1830]">Discover event partners across India</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#51657D]">Our location system covers 4,000+ cities, towns and localities across every state and union territory.</p></div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{popularLocations.map((location) => <Link key={location} href={`/vendors?city=${encodeURIComponent(location)}`} className="rounded-full border border-[#D8C8AA] bg-white px-5 py-3 text-sm font-semibold text-[#304A65] shadow-sm transition hover:border-[#B58D43] hover:text-[#0B1830]">{location}</Link>)}</div>
          <div className="mt-7 text-center"><Link href="/locations" className="btn btn-outline btn-lg">Browse all states & locations <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section id="utsav-saathi" className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="section-shell rounded-[2rem] p-8 sm:p-10"><p className="type-label text-[#0F6456]">Utsav Saathi with Gemini</p><h2 className="type-h2 mt-3 text-[#0B1830]">Help for every registered vendor</h2><p className="mt-4 text-sm leading-7 text-[#51657D]">Our AI assistant answers onboarding, approval, login and support questions after verifying a vendor&apos;s registered details. Open Utsav Saathi from the chat button on this page.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EAF3F0] px-4 py-2 text-sm font-semibold text-[#0F6456]"><MessageCircle className="h-4 w-4" /> Vendor support, whenever needed</div></div>
          <div className="rounded-[2rem] border border-[#DCCDB2] bg-gradient-to-br from-[#F5E9D0] to-[#FFFDF7] p-8 sm:p-10"><p className="type-label text-[#9A6F24]">Grow with BookMyHalwai</p><h2 className="type-h2 mt-3 text-[#0B1830]">Turn your event business into a trusted digital brand</h2><p className="mt-4 text-sm leading-7 text-[#51657D]">Register yourself or get assisted onboarding from an authorised sales executive. Your profile goes live only after admin approval.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/vendor/register" className="btn btn-primary btn-lg">Become a partner</Link><Link href="/login" className="btn btn-outline btn-lg">Partner login</Link></div></div>
        </div>
      </section>
    </main>
  );
}

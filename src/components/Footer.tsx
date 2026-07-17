import Link from "next/link";
import { INDIA_STATES } from "@/data/indiaLocations";

const linkGroups = [
  {
    title: "Marketplace",
    links: [
      { label: "Find Vendors", href: "/vendors" },
      { label: "All Services", href: "/services" },
      { label: "Browse Locations", href: "/locations" },
      { label: "Become a Partner", href: "/vendor/register" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Support", href: "/support" },
      { label: "Vendor Onboarding", href: "/vendor/register" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Customer Dashboard", href: "/customer/dashboard" },
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "Unified Login", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Legal & Compliance", href: "/compliance" },
    ],
  },
];

export default function Footer() {
  const stateGroups = [
    INDIA_STATES.slice(0, 9),
    INDIA_STATES.slice(9, 18),
    INDIA_STATES.slice(18, 27),
    INDIA_STATES.slice(27),
  ];
  return (
    <footer className="mt-20 border-t border-[#CDBA95] bg-gradient-to-b from-[#0B1830] to-[#081221] text-[#F4EEE2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-serif text-3xl font-semibold tracking-[0.08em] text-[#F7F1E4]">BOOKMYHALWAI</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#D6C7AC]">
              India-wide marketplace for trusted event-service professionals, venues, halwais and caterers. Built for modern discovery, verified quality and celebration-ready service.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4BF95]/50 bg-[#D4BF95]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#E8DAC0]">
              Growing Across India
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="font-serif text-lg tracking-[0.08em] text-[#F7F1E4]">{group.title}</p>
                <div className="mt-4 space-y-2.5 text-sm">
                  {group.links.map((link) => (
                    <Link key={link.href + link.label} href={link.href} className="block text-[#CFBEA0] transition hover:text-[#F7F1E4]">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#D4BF95]/20 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="type-label text-[#D8BE89]">Explore India</p><h2 className="mt-2 text-2xl text-white">Event vendors by state & union territory</h2></div><Link href="/locations" className="text-sm font-semibold text-[#E8DAC0] hover:text-white">View complete location directory</Link></div>
          <div className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {stateGroups.map((group, index) => <div key={`state-group-${index}`} className="space-y-2">{group.map((state) => <Link key={state.code} href={`/vendors?state=${encodeURIComponent(state.name)}`} className="block text-sm text-[#BFB39F] transition hover:text-white">{state.name}</Link>)}</div>)}
          </div>
        </div>

        <div className="mt-12 border-t border-[#D4BF95]/20 pt-6 text-sm text-[#CFBEA0]">
          <p>© 2026 BookMyHalwai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

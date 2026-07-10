import Link from "next/link";

const linkGroups = [
  {
    title: "Marketplace",
    links: [
      { label: "Find Caterers", href: "/caterers" },
      { label: "Become a Partner", href: "/vendor/register" },
      { label: "Contact", href: "/contact" },
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
      { label: "New Booking", href: "/bookings/new" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Compliance", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#CDBA95] bg-gradient-to-b from-[#0B1830] to-[#081221] text-[#F4EEE2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-serif text-3xl font-semibold tracking-[0.08em] text-[#F7F1E4]">BOOKMYHALWAI</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#D6C7AC]">
              Premium hospitality marketplace for trusted halwais and caterers. Built for modern discovery, verified quality, and wedding-ready service excellence.
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

        <div className="mt-12 border-t border-[#D4BF95]/20 pt-6 text-sm text-[#CFBEA0]">
          <p>© 2026 BookMyHalwai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ClipboardList, MessageSquareText, Search, Store, UserRoundCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "How BookMyHalwai Works",
  description: "Learn how customers discover verified event vendors and how partners join the BookMyHalwai marketplace.",
};

const customerSteps = [
  { title: "Search", text: "Choose a service and location for your event.", icon: Search },
  { title: "Compare", text: "Review approved profiles, services and starting prices.", icon: BadgeCheck },
  { title: "Send requirements", text: "Share your date, location, guest count and expectations.", icon: ClipboardList },
  { title: "Discuss & decide", text: "Receive a quotation and continue the conversation.", icon: MessageSquareText },
];

const partnerSteps = [
  { title: "Register", text: "Complete the category-specific business registration.", icon: Store },
  { title: "Get verified", text: "The admin team reviews documents, details and profile quality.", icon: UserRoundCheck },
  { title: "Go live", text: "Approved profiles become discoverable in the marketplace.", icon: BadgeCheck },
];

export default function HowItWorksPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-10">
        <div className="section-shell rounded-[2rem] p-8 text-center sm:p-12"><p className="type-label text-[#0F6456]">Simple, transparent journeys</p><h1 className="type-h1 mt-3 text-[#0B1830]">How BookMyHalwai works</h1><p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#51657D]">One marketplace for families planning events and professionals growing their business.</p></div>
        <section><p className="type-label text-[#0F6456]">For customers</p><h2 className="type-h2 mt-2 text-[#0B1830]">From idea to the right event partner</h2><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{customerSteps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className="premium-card rounded-3xl p-6"><span className="text-xs font-bold tracking-[0.16em] text-[#B58D43]">0{index + 1}</span><Icon className="mt-4 h-7 w-7 text-[#0F6456]" /><h3 className="mt-4 text-xl font-semibold text-[#0B1830]">{step.title}</h3><p className="mt-2 text-sm leading-7 text-[#51657D]">{step.text}</p></article>; })}</div></section>
        <section className="rounded-[2rem] bg-[#0B1830] p-8 sm:p-10"><p className="type-label text-[#D8BE89]">For partners</p><h2 className="type-h2 mt-2 text-white">Build a trusted digital presence</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{partnerSteps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className="rounded-3xl border border-white/10 bg-white/6 p-6"><span className="text-xs font-bold tracking-[0.16em] text-[#D8BE89]">0{index + 1}</span><Icon className="mt-4 h-7 w-7 text-[#D8BE89]" /><h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-7 text-[#D5CCBC]">{step.text}</p></article>; })}</div><Link href="/vendor/register" className="btn btn-lg mt-8 bg-[#C7A667] font-semibold text-[#0B1830]">Become a partner</Link></section>
      </section>
    </main>
  );
}

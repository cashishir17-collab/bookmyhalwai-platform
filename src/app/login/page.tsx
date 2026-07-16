"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

const roleCards = [
  {
    title: "Admin Panel",
    description: "Secure access for platform administrators to approvals, sales access, support and marketplace controls.",
    badge: "Administration",
    href: null,
    accent: "border-amber-300 bg-amber-50/80",
  },
  {
    title: "Sales Panel",
    description: "Login for authorised BookMyHalwai sales executives to onboard and assist vendors in the field.",
    badge: "Sales Executive",
    href: "/partner/login",
    accent: "border-orange-300 bg-orange-50/80",
  },
  {
    title: "Vendor Panel",
    description: "Login for registered vendors to manage their profile, availability, enquiries and support.",
    badge: "Vendor Partner",
    href: "/vendor/login",
    accent: "border-emerald-300 bg-emerald-50/80",
  },
];

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#B7791F]">BookMyHalwai Access</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#0B1830] sm:text-5xl">Choose your login panel</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Select the panel that matches your role. Access is verified after login, so each user can open only the authorised workspace.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {roleCards.map((card) => (
            <article key={card.title} className={`rounded-[2rem] border p-6 shadow-sm ${card.accent}`}>
              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{card.badge}</span>
              <h2 className="mt-5 text-2xl font-semibold text-[#0B1830]">{card.title}</h2>
              <p className="mt-3 min-h-24 text-sm leading-6 text-slate-600">{card.description}</p>
              {card.href ? (
                <Link href={card.href} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#0B1830] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#1E426A]">Open {card.title}</Link>
              ) : (
                <div className="mt-6 rounded-2xl bg-white p-3">
                  <GoogleLoginButton
                    onSuccess={() => router.replace("/admin")}
                    onError={(message) => setError(message)}
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        {error ? <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">{error}</p> : null}
        <p className="mt-8 text-center text-sm text-slate-500">New vendor? <Link href="/vendor/register" className="font-semibold text-[#0B1830] underline">Register your business</Link></p>
      </section>
    </main>
  );
}

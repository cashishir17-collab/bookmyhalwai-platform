"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Find Caterers", href: "/caterers" },
  { label: "Become a Vendor", href: "/vendor" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-orange-600 md:text-2xl">
          BookMyHalwai
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-orange-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600"
            >
              Login
            </Link>
            <Link
              href="/book"
              className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-700"
            >
              Book Now
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-600 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-sm md:hidden">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/book"
              className="mt-2 block rounded-2xl bg-orange-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-700"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

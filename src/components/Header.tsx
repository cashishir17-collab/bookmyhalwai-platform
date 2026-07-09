"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Find Caterers", href: "/caterers" },
  { label: "Become a Verified Partner", href: "/vendor/register" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const displayName = user?.displayName || user?.email || "Profile";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";
  const quickLinks = [
    { label: "Dashboard", href: isVendor ? "/vendor/dashboard" : "/customer/dashboard" },
    { label: "Bookings", href: isVendor ? "/vendor/bookings" : "/customer/bookings" },
    ...(isVendor
      ? [
          { label: "Menus", href: "/vendor/menus" },
          { label: "Calendar", href: "/vendor/calendar" },
          { label: "Reviews", href: "/vendor/reviews" },
        ]
      : []),
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e0d4] bg-[#fffdf8]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          BookMy<span className="text-orange-700">Halwai</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-orange-50 hover:text-orange-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm font-medium text-slate-500">Loading...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-700 text-sm font-semibold text-white">
                    {avatarInitial}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{displayName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700">
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/customer/profile" className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700">
                    Profile
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
              >
                Login
              </button>
            )}
            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              Become a Partner
              <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-emerald-700">LIVE</span>
            </Link>
            <Link
              href="/book"
              className="rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-800"
            >
              Book Now
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-[#fffdf8] px-4 py-4 shadow-sm backdrop-blur-sm lg:hidden">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <div className="font-semibold text-slate-900">{displayName}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{user.role}</div>
                </div>
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/customer/profile" className="block rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsOpen(false);
                }}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
              >
                Login
              </button>
            )}
            <Link
              href="/vendor/register"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              Become a Partner
              <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-emerald-700">LIVE</span>
            </Link>
            <Link
              href="/book"
              className="mt-2 block rounded-2xl bg-orange-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-800"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </nav>
        </div>
      ) : null}

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}

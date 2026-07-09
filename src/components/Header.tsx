"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Find Caterers", href: "/caterers" },
  { label: "Become a Partner", href: "/vendor/register" },
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#FAFAF8]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          <Image
            src="/bmh-logo.svg"
            alt="BookMyHalwai logo"
            className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm sm:h-11 sm:w-11"
            width={44}
            height={44}
          />
          <span className="leading-none">
            BookMy<span className="text-[#D4AF37]">Halwai</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-[#0F172A]"
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.href === "/caterers" ? (
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">Coming Soon</span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm font-medium text-slate-500">Loading...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A] text-sm font-semibold text-white">
                    {avatarInitial}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{displayName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]">
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/customer/profile" className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]">
                    Profile
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-[#0F172A]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-[#0F172A]"
              >
                Login
              </button>
            )}
            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
            >
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
              Become a Partner
              <span className="rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white">LIVE</span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:text-[#0F172A] lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-[#FAFAF8] px-4 py-4 shadow-sm backdrop-blur-sm lg:hidden">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]"
                onClick={() => setIsOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.href === "/caterers" ? (
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">Soon</span>
                  ) : null}
                </span>
              </Link>
            ))}
            {user ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <div className="font-semibold text-slate-900">{displayName}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{user.role}</div>
                </div>
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/customer/profile" className="block rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]"
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
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0F172A]"
              >
                Login
              </button>
            )}
            <Link
              href="/vendor/register"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1E293B]"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
              Become a Partner
              <span className="rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white">LIVE</span>
            </Link>
          </nav>
        </div>
      ) : null}

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}

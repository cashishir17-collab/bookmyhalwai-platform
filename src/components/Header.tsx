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
    <header className="sticky top-0 z-50 border-b border-[#1b3150]/15 bg-[#FBF8F0]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3.5 text-[#0B1830]">
          <Image
            src="/bmh-logo.svg"
            alt="BookMyHalwai logo"
            className="h-11 w-11 shrink-0 rounded-full border border-[#D4BF95] bg-[#FCF8EE] object-cover shadow-[0_10px_24px_rgba(11,24,48,0.2)] sm:h-12 sm:w-12"
            width={48}
            height={48}
            priority
          />
          <span className="leading-none">
            <span className="block font-serif text-lg font-semibold tracking-[0.14em] sm:text-xl">BOOKMY</span>
            <span className="block -mt-0.5 font-serif text-lg font-semibold tracking-[0.14em] text-[#0F6456] sm:text-xl">HALWAI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          <nav className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#3E5168]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2.5 transition hover:bg-[#0B1830] hover:text-[#F7F1E3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm font-semibold text-[#4B5F76]">Loading...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-[#D9C8A7] bg-[#FFFCF5] px-3 py-2 shadow-[0_8px_18px_rgba(11,24,48,0.1)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1830] text-sm font-semibold text-white">
                    {avatarInitial}
                  </div>
                  <span className="max-w-[160px] truncate text-sm font-semibold text-[#243955]">{displayName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-[#40536A] transition hover:bg-[#EEE6D5] hover:text-[#0B1830]">
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/customer/profile" className="rounded-full px-3 py-2 text-sm font-semibold text-[#40536A] transition hover:bg-[#EEE6D5] hover:text-[#0B1830]">
                    Profile
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-full border border-[#D1BD98] px-4 py-2 text-sm font-semibold text-[#3C4F67] transition hover:border-[#BFA36E] hover:text-[#0B1830]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full border border-[#D1BD98] px-4 py-2 text-sm font-semibold text-[#3C4F67] transition hover:border-[#BFA36E] hover:text-[#0B1830]"
              >
                Login
              </button>
            )}

            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B1830] to-[#1E426A] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#F8F2E5] shadow-[0_12px_26px_rgba(11,24,48,0.3)] transition hover:translate-y-[-1px]"
            >
              Become a Partner
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D1BD98] bg-[#FFFBEF] text-[#334A63] transition hover:border-[#BFA36E] hover:text-[#0B1830] xl:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[#D7C8AC] bg-[#FDF9F0] px-4 py-4 shadow-sm backdrop-blur-sm xl:hidden">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#3E5168] transition hover:bg-[#EDE4D2] hover:text-[#0B1830]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="rounded-2xl border border-[#D9C8A7] bg-[#FFFDF8] px-4 py-3 text-sm font-medium text-[#3E5168]">
                  <div className="font-semibold text-[#0B1830]">{displayName}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#63778D]">{user.role}</div>
                </div>
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.08em] text-[#3E5168] transition hover:bg-[#EDE4D2] hover:text-[#0B1830]" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/customer/profile" className="block rounded-2xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.08em] text-[#3E5168] transition hover:bg-[#EDE4D2] hover:text-[#0B1830]" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.08em] text-[#3E5168] transition hover:bg-[#EDE4D2] hover:text-[#0B1830]"
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
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.08em] text-[#3E5168] transition hover:bg-[#EDE4D2] hover:text-[#0B1830]"
              >
                Login
              </button>
            )}
            <Link
              href="/vendor/register"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B1830] to-[#1E426A] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-[#F8F2E5]"
              onClick={() => setIsOpen(false)}
            >
              Become a Partner
            </Link>
          </nav>
        </div>
      ) : null}

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}

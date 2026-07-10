import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#FAFAF8] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              BookMy<span className="text-[#D4AF37]">Halwai</span>
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              India&apos;s premium marketplace for trusted halwais, caterers, and event food partners.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Marketplace</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/caterers" className="block transition hover:text-[#0F172A]">Find Caterers</Link>
              <Link href="/vendor/register" className="block transition hover:text-[#0F172A]">Become a Partner</Link>
              <Link href="/contact" className="block transition hover:text-[#0F172A]">Onboarding Support</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Company</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/about" className="block transition hover:text-[#0F172A]">About</Link>
              <Link href="/contact" className="block transition hover:text-[#0F172A]">Contact</Link>
              <Link href="/support" className="block transition hover:text-[#0F172A]">Support</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Legal</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/terms" className="block transition hover:text-[#0F172A]">Terms</Link>
              <Link href="/privacy" className="block transition hover:text-[#0F172A]">Privacy</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">
          © 2026 BookMyHalwai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

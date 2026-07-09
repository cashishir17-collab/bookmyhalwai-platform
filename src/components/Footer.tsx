import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e0d4] bg-[#fcf8f1] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              BookMy<span className="text-orange-700">Halwai</span>
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              India&apos;s premium marketplace for trusted halwais, caterers, and event food partners.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Marketplace</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/caterers" className="block transition hover:text-orange-700">Find Caterers</Link>
              <Link href="/vendor/register" className="block transition hover:text-orange-700">Become a Partner</Link>
              <Link href="/contact" className="block transition hover:text-orange-700">Onboarding Support</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Company</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/about" className="block transition hover:text-orange-700">About</Link>
              <Link href="/contact" className="block transition hover:text-orange-700">Contact</Link>
              <Link href="/support" className="block transition hover:text-orange-700">Support</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Legal</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/terms" className="block transition hover:text-orange-700">Terms</Link>
              <Link href="/privacy" className="block transition hover:text-orange-700">Privacy</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#e8e0d4] pt-5 text-sm text-slate-500">
          © 2026 BookMyHalwai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

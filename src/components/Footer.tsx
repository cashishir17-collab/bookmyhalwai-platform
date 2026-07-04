export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-center sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between md:text-left">
        <p className="text-sm font-medium">
          © 2026 BookMyHalwai. India’s trusted catering marketplace.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 md:justify-end">
          <a href="/terms" className="transition hover:text-white">Terms</a>
          <a href="/privacy" className="transition hover:text-white">Privacy</a>
          <a href="/support" className="transition hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
}

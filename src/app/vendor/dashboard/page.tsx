import Link from "next/link";

export default function VendorDashboardPage() {
  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
          Vendor Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your registration is under review</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Your business details have been submitted successfully. We will review them shortly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Back to Home
          </Link>
          <Link
            href="/vendor/register"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            Register Again
          </Link>
        </div>
      </div>
    </div>
  );
}

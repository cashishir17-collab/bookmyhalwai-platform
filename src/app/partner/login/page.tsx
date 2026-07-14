"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { useAuth } from "@/hooks/useAuth";

export default function SalesLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (user?.role === "sales" || user?.role === "admin")) router.replace("/partner/dashboard");
  }, [loading, router, user]);

  return <main className="page-shell min-h-screen px-4 py-12">
    <section className="section-shell mx-auto max-w-lg rounded-[2rem] p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Partner Acquisition</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sales executive login</h1>
      <p className="mt-3 text-slate-600">Use your approved BookMyHalwai mobile number.</p>
      {user && user.role !== "sales" && user.role !== "admin" ? <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">This number is signed in but has not yet been approved as a sales executive. Contact an administrator.</div> : null}
      {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      <div className="mt-6"><PhoneLogin onError={setError} /></div>
      <Link href="/vendor/login" className="mt-6 block text-center text-sm font-semibold text-slate-600">Vendor login instead</Link>
    </section>
  </main>;
}

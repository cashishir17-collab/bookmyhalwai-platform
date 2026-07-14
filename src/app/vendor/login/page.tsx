"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { useAuth } from "@/hooks/useAuth";

export default function VendorLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState("");
  useEffect(() => { if (!loading && user?.role === "vendor") router.replace("/vendor/dashboard"); }, [loading, router, user]);
  return <main className="page-shell min-h-screen px-4 py-12"><section className="section-shell mx-auto max-w-lg rounded-[2rem] p-8">
    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Vendor Portal</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor login</h1>
    <p className="mt-3 text-slate-600">Sign in with the mobile number used during registration.</p>
    {user && user.role !== "vendor" ? <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Your phone is verified, but no vendor profile is linked. Use the ownership link sent by your sales executive, or register directly.</div> : null}
    {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
    <div className="mt-6"><PhoneLogin onError={setError} /></div>
    <div className="mt-6 flex justify-center gap-5 text-sm font-semibold"><Link href="/vendor/register">Register</Link><Link href="/support">Support</Link></div>
  </section></main>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneLogin from "@/components/auth/PhoneLogin";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  return <main className="page-shell min-h-screen px-4 py-16"><section className="section-shell mx-auto max-w-md rounded-[2rem] p-8">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Partner Team</p>
    <h1 className="mt-2 text-3xl font-semibold">Sales executive login</h1>
    <p className="mt-3 text-sm text-slate-600">Use the mobile number assigned by the BookMyHalwai administrator.</p>
    {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6"><PhoneLogin onSuccess={() => router.replace("/partner/dashboard")} onError={setError} /></div>
  </section></main>;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import PersonalDatesForm from "@/components/profile/PersonalDatesForm";

type Lead = { id: string; businessName?: string; ownerName?: string; city?: string; status?: string; vendorId?: string };

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== "sales_executive" && user.role !== "admin")) {
      router.replace("/partner/login");
      return;
    }
    if (!db) return;
    const source = user.role === "admin"
      ? collection(db, "partnerOnboarding")
      : query(collection(db, "partnerOnboarding"), where("salesExecutiveId", "==", user.uid));
    void getDocs(source).then((snapshot) => setLeads(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
  }, [loading, router, user]);

  if (loading || !user) return <main className="page-shell min-h-screen p-10 text-center">Loading...</main>;
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-6xl space-y-8">
    <section className="section-shell rounded-[2rem] p-8"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Sales Console</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">Assisted vendor registration</h1><p className="mt-3 text-slate-600">Use the complete registration wizard. Vendor OTP consent is verified inside the form before submission.</p><Link href="/vendor/register" className="btn btn-primary btn-lg mt-6">Register a vendor</Link></section>
    <PersonalDatesForm userId={user.uid} title="Sales executive personal dates" />
    <section className="section-shell rounded-[2rem] p-8"><h2 className="text-2xl font-semibold">My registrations</h2><div className="mt-5 space-y-3">{leads.length ? leads.map((lead) => <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-4"><div><p className="font-semibold text-slate-900">{lead.businessName}</p><p className="text-sm text-slate-500">{lead.ownerName} · {lead.city}</p><p className="mt-1 text-xs text-slate-500">{lead.vendorId || lead.id}</p></div><span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{lead.status?.replaceAll("_", " ")}</span></div></article>) : <p className="text-slate-500">No assisted registrations yet.</p>}</div></section>
  </div></main>;
}

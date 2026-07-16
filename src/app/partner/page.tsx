"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { normalizeIndianPhone, statusLabel, type PartnerRegistration } from "@/lib/partner";
import IndiaPhoneInput from "@/components/forms/IndiaPhoneInput";

const blank = { businessName: "", ownerName: "", phone: "", city: "", category: "Halwai & Caterer", address: "" };

export default function PartnerPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [rows, setRows] = useState<PartnerRegistration[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!db || !user) return;
    const snap = await getDocs(query(collection(db, "partnerOnboarding"), where("salesExecutiveId", "==", user.uid)));
    setRows(snap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRegistration)));
  };
  useEffect(() => {
    if (!loading && !user) router.replace("/partner/login");
    else if (!loading && user?.role !== "sales_executive" && user?.role !== "admin") setMessage("This number is not assigned a sales-executive role. Ask the administrator to activate it.");
    else void load();
  }, [loading, user?.uid, user?.role]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!db || !user) return;
    try {
      setSaving(true); setMessage("");
      const ref = await addDoc(collection(db, "partnerOnboarding"), {
        businessName: form.businessName.trim(), ownerName: form.ownerName.trim(), phoneE164: normalizeIndianPhone(form.phone),
        city: form.city.trim(), category: form.category, address: form.address.trim(), salesExecutiveId: user.uid,
        salesExecutiveName: user.displayName || user.phoneNumber || "Sales executive", ownerUid: null, status: "otp_pending",
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setForm(blank); setMessage(`Registration saved. Share this ownership link: ${window.location.origin}/partner/claim/${ref.id}`); await load();
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not save registration."); }
    finally { setSaving(false); }
  };

  if (loading) return <main className="page-shell min-h-screen p-10 text-center">Loading...</main>;
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-6xl space-y-8">
    <section className="section-shell rounded-[2rem] p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Partner Onboarding</p><h1 className="mt-2 text-3xl font-semibold">Assisted vendor registration</h1></div><button onClick={() => void logout().then(() => router.replace("/partner/login"))} className="btn btn-outline btn-sm">Log out</button></div></section>
    {message && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 break-words">{message}</div>}
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="section-shell space-y-4 rounded-[2rem] p-7">
        <h2 className="text-2xl font-semibold">Register a vendor</h2>
        {([['businessName','Business name'],['ownerName','Owner name'],['city','City'],['address','Business address']] as const).map(([key,label]) => <label key={key} className="block text-sm font-semibold text-slate-700">{label}<input required={key !== 'address'} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" /></label>)}
        <label className="block text-sm font-semibold text-slate-700">Mobile number<IndiaPhoneInput value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required className="mt-2" /></label>
        <label className="block text-sm font-semibold text-slate-700">Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"><option>Halwai & Caterer</option><option>Wedding Caterer</option><option>Corporate Caterer</option><option>Home Caterer</option></select></label>
        <button disabled={saving || (user?.role !== "sales_executive" && user?.role !== "admin")} className="btn btn-primary btn-md w-full">{saving ? "Saving..." : "Save & create OTP link"}</button>
      </form>
      <div className="section-shell rounded-[2rem] p-7"><h2 className="text-2xl font-semibold">My registrations</h2><div className="mt-5 space-y-3">{rows.length ? rows.map(row => <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold text-slate-900">{row.businessName}</p><p className="text-sm text-slate-500">{row.ownerName} · {row.city} · {row.phoneE164}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{statusLabel(row.status)}</span></div>{row.status === 'otp_pending' && <Link className="mt-3 inline-block text-sm font-semibold text-orange-700" href={`/partner/claim/${row.id}`}>Open ownership link</Link>}</article>) : <p className="text-sm text-slate-500">No registrations yet.</p>}</div></div>
    </section>
  </div></main>;
}

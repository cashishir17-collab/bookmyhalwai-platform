"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { normalizeIndianPhone, PARTNER_CATEGORIES } from "@/lib/partnerOnboarding";

type Lead = { id: string; businessName?: string; ownerName?: string; ownerPhone?: string; city?: string; status?: string; vendorId?: string };

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ businessName: "", ownerName: "", phone: "", email: "", category: "Halwai", city: "", state: "", address: "", notes: "" });

  const loadLeads = async () => {
    if (!db || !user) return;
    const snapshot = await getDocs(collection(db, "partnerOnboarding"));
    setLeads(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Lead, "id">) })).filter((lead) => user.role === "admin" || (snapshot.docs.find((d) => d.id === lead.id)?.data().salesExecutiveId === user.uid)));
  };

  useEffect(() => {
    if (!loading && user?.role !== "sales" && user?.role !== "admin") router.replace("/partner/login");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading && (user?.role === "sales" || user?.role === "admin")) void loadLeads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, router, user?.role]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!db || !user) return;
    setSaving(true); setMessage("");
    try {
      const onboardingRef = doc(collection(db, "partnerOnboarding"));
      const vendorId = `BMH-${Date.now().toString(36).toUpperCase()}-${onboardingRef.id.slice(0, 5).toUpperCase()}`;
      const phone = normalizeIndianPhone(form.phone);
      const batch = writeBatch(db);
      batch.set(onboardingRef, {
        businessName: form.businessName.trim(), ownerName: form.ownerName.trim(), ownerPhone: phone,
        email: form.email.trim(), category: form.category, city: form.city.trim(), state: form.state.trim(),
        address: form.address.trim(), notes: form.notes.trim(), status: "awaiting_otp", vendorId,
        salesExecutiveId: user.uid, salesExecutiveName: user.displayName || user.phoneNumber || "Sales executive",
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      batch.set(doc(db, "vendors", vendorId), {
        registrationId: vendorId, businessName: form.businessName.trim(), ownerName: form.ownerName.trim(),
        ownerPhone: phone, phone, email: form.email.trim(), providerCategory: form.category,
        city: form.city.trim(), state: form.state.trim(), address: form.address.trim(),
        source: "Sales Assisted", assistedRegistrationId: onboardingRef.id,
        verificationStatus: "Ownership Pending", leadStage: "OTP Ownership Pending", profileCompletion: 35,
        createdBy: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      await batch.commit();
      const claimUrl = `${window.location.origin}/partner/claim/${onboardingRef.id}`;
      setMessage(`Registration created. Send this secure OTP ownership link to the vendor: ${claimUrl}`);
      setForm({ businessName: "", ownerName: "", phone: "", email: "", category: "Halwai", city: "", state: "", address: "", notes: "" });
      await loadLeads();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not create registration."); }
    finally { setSaving(false); }
  };

  if (loading) return <main className="page-shell min-h-screen p-10 text-center">Loading...</main>;
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-7xl space-y-8">
    <section className="section-shell rounded-[2rem] p-8"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Sales Console</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">Assisted vendor registration</h1><p className="mt-3 text-slate-600">Create the profile, then let the vendor prove ownership with OTP.</p></section>
    <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <form onSubmit={submit} className="section-shell grid gap-4 rounded-[2rem] p-8 sm:grid-cols-2">
        <Field label="Business name" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} required />
        <Field label="Owner name" value={form.ownerName} onChange={(v) => setForm({ ...form, ownerName: v })} required />
        <Field label="Owner mobile" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="9876543210" required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <label className="text-sm font-semibold text-slate-700">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">{PARTNER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
        <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
        <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
        {message ? <div className="break-all rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 sm:col-span-2">{message}</div> : null}
        <button disabled={saving} className="btn btn-primary btn-md sm:col-span-2">{saving ? "Creating..." : "Create registration & OTP link"}</button>
      </form>
      <section className="section-shell rounded-[2rem] p-8"><h2 className="text-2xl font-semibold">My registrations</h2><div className="mt-5 space-y-3">{leads.length ? leads.map((lead) => <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-4"><div><p className="font-semibold text-slate-900">{lead.businessName}</p><p className="text-sm text-slate-500">{lead.ownerName} · {lead.city}</p><p className="mt-1 text-xs text-slate-500">{lead.vendorId}</p></div><span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{lead.status?.replaceAll("_", " ")}</span></div><button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/partner/claim/${lead.id}`)} className="mt-3 text-sm font-semibold text-orange-700">Copy ownership link</button></article>) : <p className="text-slate-500">No assisted registrations yet.</p>}</div></section>
    </div>
  </div></main>;
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <label className="text-sm font-semibold text-slate-700">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>;
}

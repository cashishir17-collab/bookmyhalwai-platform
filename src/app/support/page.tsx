"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Ticket = { id: string; subject?: string; category?: string; description?: string; status?: string; priority?: string; requesterName?: string };

export default function SupportPage() {
  const router = useRouter(); const { user, loading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "Account & Login", description: "", priority: "Normal" });

  const load = async () => {
    if (!db || !user) return;
    const ref = collection(db, "supportTickets");
    const snapshot = await getDocs(user.role === "admin" ? ref : query(ref, where("createdBy", "==", user.uid)));
    setTickets(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Ticket, "id">) })));
  };
  useEffect(() => {
    if (!loading && !user) router.replace("/");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading && user) void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, router, user?.uid]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!db || !user) return; setSaving(true); setMessage("");
    try { await addDoc(collection(db, "supportTickets"), { ...form, status: "Open", createdBy: user.uid, requesterRole: user.role, requesterName: user.displayName || user.phoneNumber || user.email || "User", createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); setForm({ subject: "", category: "Account & Login", description: "", priority: "Normal" }); setMessage("Support ticket created successfully."); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not create ticket."); } finally { setSaving(false); }
  };
  const closeTicket = async (id: string) => { if (!db) return; await updateDoc(doc(db, "supportTickets", id), { status: "Resolved", updatedAt: serverTimestamp() }); await load(); };

  if (loading) return <main className="page-shell min-h-screen p-10 text-center">Loading...</main>;
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-6xl space-y-8"><section className="section-shell rounded-[2rem] p-8"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Help Desk</p><h1 className="mt-2 text-3xl font-semibold">Support tickets</h1><p className="mt-3 text-slate-600">Report an onboarding, login, listing, enquiry, or payment issue.</p></section><div className="grid gap-8 lg:grid-cols-2">
    <form onSubmit={submit} className="section-shell space-y-4 rounded-[2rem] p-8"><label className="block text-sm font-semibold">Subject<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label><label className="block text-sm font-semibold">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">{["Account & Login", "Registration", "Approval", "Marketplace Listing", "Enquiry & Booking", "Payment", "Other"].map((c) => <option key={c}>{c}</option>)}</select></label><label className="block text-sm font-semibold">Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option>Normal</option><option>Urgent</option></select></label><label className="block text-sm font-semibold">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>{message ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div> : null}<button disabled={saving} className="btn btn-primary btn-md w-full">{saving ? "Submitting..." : "Create ticket"}</button></form>
    <section className="section-shell rounded-[2rem] p-8"><h2 className="text-2xl font-semibold">{user?.role === "admin" ? "All tickets" : "My tickets"}</h2><div className="mt-5 space-y-3">{tickets.length ? tickets.map((ticket) => <article key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-3"><div><p className="font-semibold">{ticket.subject}</p><p className="text-xs text-slate-500">{ticket.category} · {ticket.requesterName}</p></div><span className="h-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{ticket.status}</span></div><p className="mt-3 text-sm text-slate-600">{ticket.description}</p>{user?.role === "admin" && ticket.status !== "Resolved" ? <button onClick={() => closeTicket(ticket.id)} className="mt-3 text-sm font-semibold text-emerald-700">Mark resolved</button> : null}</article>) : <p className="text-slate-500">No tickets yet.</p>}</div></section>
  </div></div></main>;
}

"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Mode = "customer" | "vendor" | "admin";
type Enquiry = { id:string; vendorId?:string; vendorName?:string; customerId?:string; customerName?:string; eventType?:string; eventDate?:string; location?:string; guests?:number; budget?:number; status?:string; quoteAmount?:number; quoteMessage?:string; quoteValidity?:string; auditTrail?: Array<{action:string;actorId:string;actorRole:string;at:string}> };

export default function EnquiryWorkspace({ mode }: { mode: Mode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotingId, setQuotingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!db || !user?.uid) return;
    try {
      let source;
      if (mode === "customer") source = query(collection(db, "enquiries"), where("customerId", "==", user.uid));
      else if (mode === "vendor") {
        const vendorSnapshot = await getDocs(query(collection(db, "vendors"), where("userId", "==", user.uid)));
        const vendorId = vendorSnapshot.docs[0]?.id;
        if (!vendorId) { setRows([]); setLoading(false); return; }
        source = query(collection(db, "enquiries"), where("vendorId", "==", vendorId));
      } else source = collection(db, "enquiries");
      const snapshot = await getDocs(source);
      setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Enquiry)));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load enquiries."); }
    finally { setLoading(false); }
  }, [mode, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/"); return; }
    if (user.role !== mode) { router.replace(user.role === "admin" ? "/admin" : user.role === "vendor" ? "/vendor/dashboard" : "/customer/dashboard"); return; }
    void load();
  }, [authLoading, load, mode, router, user]);

  const changeStatus = async (row: Enquiry, status: string) => {
    if (!db || !user) return;
    await updateDoc(doc(db, "enquiries", row.id), { status, updatedAt: serverTimestamp(), auditTrail: arrayUnion({ action: status, actorId: user.uid, actorRole: user.role, at: new Date().toISOString() }) });
    await load();
  };

  const submitQuote = async (event: FormEvent<HTMLFormElement>, row: Enquiry) => {
    event.preventDefault(); if (!db || !user) return;
    const data = new FormData(event.currentTarget);
    await updateDoc(doc(db, "enquiries", row.id), { quoteAmount: Number(data.get("amount")), quoteMessage: String(data.get("message") || ""), quoteValidity: String(data.get("validity") || ""), status: "Quoted", quotedAt: serverTimestamp(), updatedAt: serverTimestamp(), auditTrail: arrayUnion({ action: "Quoted", actorId: user.uid, actorRole: user.role, at: new Date().toISOString() }) });
    setQuotingId(null); await load();
  };

  if (authLoading || !user || loading) return <main className="page-shell min-h-screen px-4 py-10 text-center">Loading secure workspace…</main>;
  return <main className="page-shell min-h-screen px-4 py-10"><section className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8"><p className="type-label text-[#0F6456]">Enquiry & Quotation CRM</p><h1 className="mt-3 font-serif text-3xl text-[#0B1830]">{mode === "customer" ? "My enquiries" : mode === "vendor" ? "Customer leads" : "All marketplace enquiries"}</h1>{error && <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p>}<div className="mt-8 space-y-4">{rows.length === 0 ? <p className="rounded-2xl border border-dashed p-6 text-slate-500">No enquiries yet.</p> : rows.map((row) => <article key={row.id} className="rounded-3xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-4"><div><h2 className="font-semibold text-slate-900">{row.eventType || "Event"} · {mode === "vendor" ? row.customerName : row.vendorName}</h2><p className="mt-2 text-sm text-slate-600">{row.eventDate || "Date TBD"} · {row.location || "Location TBD"} · {row.guests || 0} guests</p><p className="mt-1 text-sm text-slate-600">Budget ₹{Number(row.budget || 0).toLocaleString("en-IN")}</p>{row.quoteAmount ? <p className="mt-3 font-semibold text-[#0F6456]">Quote ₹{row.quoteAmount.toLocaleString("en-IN")} · {row.quoteMessage} {row.quoteValidity ? `· Valid until ${row.quoteValidity}` : ""}</p> : null}</div><span className="h-fit rounded-full bg-[#F5E7C8] px-3 py-1 text-xs font-semibold">{row.status || "New"}</span></div>{mode === "vendor" && quotingId === row.id ? <form onSubmit={(event) => submitQuote(event, row)} className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"><input name="amount" type="number" min="1" required placeholder="Quotation amount ₹" className="form-control"/><input name="validity" type="date" required className="form-control"/><input name="message" required placeholder="Menu, inclusions and terms" className="form-control sm:col-span-3"/><button className="btn btn-primary btn-sm">Send quotation</button><button type="button" onClick={() => setQuotingId(null)} className="btn btn-outline btn-sm">Cancel</button></form> : <div className="mt-4 flex flex-wrap gap-2">{mode === "vendor" && <><button onClick={() => setQuotingId(row.id)} className="btn btn-primary btn-sm">Prepare quotation</button><button onClick={() => changeStatus(row, "Rejected")} className="btn btn-outline btn-sm">Decline</button></>}{mode === "customer" && row.status === "Quoted" && <button onClick={() => changeStatus(row, "Accepted")} className="btn btn-primary btn-sm">Accept quotation</button>}{mode === "admin" && <button onClick={() => changeStatus(row, "Closed")} className="btn btn-outline btn-sm">Close enquiry</button>}</div>}<details className="mt-4 text-xs text-slate-500"><summary className="cursor-pointer font-semibold">Activity history</summary><div className="mt-2 space-y-1">{row.auditTrail?.map((entry, index) => <p key={`${entry.at}-${index}`}>{entry.at}: {entry.action} by {entry.actorRole}</p>) || <p>Created</p>}</div></details></article>)}</div></section></main>;
}

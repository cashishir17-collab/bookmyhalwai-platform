"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";

interface Ticket { id: string; subject: string; message: string; status: string; adminResponse?: string; }
export default function VendorSupportPage() {
  const { user, loading } = useAuth(); const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]); const [subject, setSubject] = useState(""); const [message, setMessage] = useState(""); const [notice, setNotice] = useState("");
  const load = async () => { if (!db || !user) return; const snap = await getDocs(query(collection(db,"supportTickets"),where("createdBy","==",user.uid))); setTickets(snap.docs.map(d=>({id:d.id,...d.data()} as Ticket))); };
  useEffect(()=>{ if(!loading&&!user) router.replace("/vendor/login"); else if(user) void load(); },[loading,user?.uid]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(!db||!user)return; await addDoc(collection(db,"supportTickets"),{createdBy:user.uid,createdByRole:user.role,subject,message,status:"open",createdAt:serverTimestamp(),updatedAt:serverTimestamp()});setSubject("");setMessage("");setNotice("Support ticket created.");await load();};
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-4xl space-y-7"><section className="section-shell rounded-[2rem] p-8"><h1 className="text-3xl font-semibold">Vendor support</h1><p className="mt-2 text-slate-600">Raise and track onboarding or account issues.</p></section>{notice&&<p className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}<div className="grid gap-7 md:grid-cols-2"><form onSubmit={submit} className="section-shell space-y-4 rounded-[2rem] p-7"><input required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"/><textarea required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe the issue" rows={6} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"/><button className="btn btn-primary btn-md w-full">Create ticket</button></form><section className="section-shell rounded-[2rem] p-7"><h2 className="text-2xl font-semibold">My tickets</h2><div className="mt-4 space-y-3">{tickets.map(t=><article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-3"><p className="font-semibold">{t.subject}</p><span className="text-xs font-semibold uppercase">{t.status}</span></div><p className="mt-2 text-sm text-slate-600">{t.message}</p>{t.adminResponse&&<p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><b>Support:</b> {t.adminResponse}</p>}</article>)}</div></section></div></div></main>;
}
"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";

interface Ticket { id: string; subject: string; message: string; status: string; adminResponse?: string; }
export default function VendorSupportPage() {
  const { user, loading } = useAuth(); const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]); const [subject, setSubject] = useState(""); const [message, setMessage] = useState(""); const [notice, setNotice] = useState("");
  const load = async () => { if (!db || !user) return; const snap = await getDocs(query(collection(db,"supportTickets"),where("createdBy","==",user.uid))); setTickets(snap.docs.map(d=>({id:d.id,...d.data()} as Ticket))); };
  useEffect(()=>{ if(!loading&&!user) router.replace("/vendor/login"); else if(user) void load(); },[loading,user?.uid]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(!db||!user)return; await addDoc(collection(db,"supportTickets"),{createdBy:user.uid,createdByRole:user.role,subject,message,status:"open",createdAt:serverTimestamp(),updatedAt:serverTimestamp()});setSubject("");setMessage("");setNotice("Support ticket created.");await load();};
  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-4xl space-y-7"><section className="section-shell rounded-[2rem] p-8"><h1 className="text-3xl font-semibold">Vendor support</h1><p className="mt-2 text-slate-600">Raise and track onboarding or account issues.</p></section>{notice&&<p className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}<div className="grid gap-7 md:grid-cols-2"><form onSubmit={submit} className="section-shell space-y-4 rounded-[2rem] p-7"><input required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"/><textarea required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe the issue" rows={6} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"/><button className="btn btn-primary btn-md w-full">Create ticket</button></form><section className="section-shell rounded-[2rem] p-7"><h2 className="text-2xl font-semibold">My tickets</h2><div className="mt-4 space-y-3">{tickets.map(t=><article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-3"><p className="font-semibold">{t.subject}</p><span className="text-xs font-semibold uppercase">{t.status}</span></div><p className="mt-2 text-sm text-slate-600">{t.message}</p>{t.adminResponse&&<p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><b>Support:</b> {t.adminResponse}</p>}</article>)}</div></section></div></div></main>;
}

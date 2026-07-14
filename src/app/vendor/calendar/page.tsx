"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Block = { id:string; date?:string; note?:string };

export default function VendorCalendarPage() {
  const { user, loading } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const load = useCallback(async () => { if (!db || !user) return; const snapshot = await getDocs(query(collection(db, "availability"), where("ownerId", "==", user.uid))); setBlocks(snapshot.docs.map((item) => ({ id:item.id, ...item.data() }))); }, [user]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading) void load();
  }, [load, loading]);
  const addBlock = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!db || !user) return; const data = new FormData(event.currentTarget); await addDoc(collection(db, "availability"), { ownerId:user.uid, date:String(data.get("date")), note:String(data.get("note") || "Unavailable"), createdAt:serverTimestamp() }); event.currentTarget.reset(); await load(); };
  const remove = async (id:string) => { if (!db) return; await deleteDoc(doc(db, "availability", id)); await load(); };
  return <main className="page-shell min-h-screen px-4 py-10"><section className="section-shell mx-auto max-w-5xl rounded-[2rem] p-8"><p className="type-label">Availability</p><h1 className="mt-3 text-3xl font-semibold text-slate-900">Block unavailable dates</h1><p className="mt-3 text-slate-600">Prevent customers from requesting dates when your team is already committed.</p><form onSubmit={addBlock} className="mt-7 grid gap-3 sm:grid-cols-[0.7fr_1fr_auto]"><input name="date" type="date" required className="form-control"/><input name="note" placeholder="Reason or private note" className="form-control"/><button className="btn btn-primary btn-sm">Block date</button></form><div className="mt-8 grid gap-3 sm:grid-cols-2">{blocks.length ? blocks.sort((a,b) => String(a.date).localeCompare(String(b.date))).map((block) => <article key={block.id} className="rounded-2xl border bg-white p-4"><p className="font-semibold">{block.date}</p><p className="mt-1 text-sm text-slate-500">{block.note}</p><button onClick={() => remove(block.id)} className="mt-3 text-xs font-semibold text-rose-600">Make available</button></article>) : <p className="text-slate-500">No dates are blocked.</p>}</div></section></main>;
}

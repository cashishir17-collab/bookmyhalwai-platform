"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Row = Record<string, unknown>;
export default function AnalyticsPage() {
  const [data, setData] = useState<{vendors:Row[];enquiries:Row[];bookings:Row[];reviews:Row[]}>({vendors:[],enquiries:[],bookings:[],reviews:[]});
  useEffect(() => { const load = async () => { if (!db) return; const names = ["vendors","enquiries","bookings","reviews"] as const; const snapshots = await Promise.all(names.map((name) => getDocs(collection(db, name)))); setData(Object.fromEntries(names.map((name,index) => [name, snapshots[index].docs.map((item) => item.data())])) as typeof data); }; void load(); }, []);
  const metrics = useMemo(() => { const accepted = data.enquiries.filter((row) => ["Accepted","Booked","Closed"].includes(String(row.status))).length; const revenue = data.bookings.filter((row) => row.paymentStatus === "Advance Paid").reduce((sum,row) => sum + Number(row.advanceAmount || 0), 0); const average = data.reviews.length ? data.reviews.reduce((sum,row) => sum + Number(row.rating || 0),0) / data.reviews.length : 0; return [{label:"Vendors",value:data.vendors.length},{label:"Enquiries",value:data.enquiries.length},{label:"Conversion",value:`${data.enquiries.length ? Math.round(accepted/data.enquiries.length*100) : 0}%`},{label:"Verified reviews",value:data.reviews.length},{label:"Average rating",value:average.toFixed(1)},{label:"Recorded advances",value:`₹${revenue.toLocaleString("en-IN")}`}]; }, [data]);
  return <main className="page-shell min-h-screen px-4 py-10"><section className="section-shell mx-auto max-w-6xl rounded-[2rem] p-8"><p className="type-label">Phase 3 Analytics</p><h1 className="mt-3 text-3xl font-semibold">Marketplace health</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map((item) => <article key={item.label} className="rounded-3xl border bg-white p-6"><p className="text-sm text-slate-500">{item.label}</p><p className="mt-2 text-3xl font-semibold">{item.value}</p></article>)}</div></section></main>;
}

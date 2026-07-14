"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Account = { id: string; displayName?: string; phoneNumber?: string; email?: string; role?: string };

export default function SalesExecutivesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState("");

  const loadAccounts = useCallback(async () => {
    if (!db) return;
    const snapshot = await getDocs(collection(db, "users"));
    setAccounts(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Account, "id">) })));
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "admin") router.replace("/");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading && user?.role === "admin") void loadAccounts();
  }, [loadAccounts, loading, router, user?.role]);

  const setRole = async (account: Account, role: "sales" | "customer") => {
    if (!db) return;
    setMessage("");
    try {
      await updateDoc(doc(db, "users", account.id), { role });
      setMessage(`${account.displayName || account.phoneNumber || account.id} is now ${role === "sales" ? "a sales executive" : "a standard user"}.`);
      await loadAccounts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update this account.");
    }
  };

  if (loading) return <main className="page-shell min-h-screen p-10 text-center">Loading...</main>;

  return <main className="page-shell min-h-screen px-4 py-10"><div className="mx-auto max-w-5xl space-y-8">
    <section className="section-shell rounded-[2rem] p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Admin Console</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sales executive access</h1>
      <p className="mt-3 text-slate-600">Ask the executive to sign in once at the Partner Login page, then promote their account here.</p>
      {message ? <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
    </section>
    <section className="section-shell rounded-[2rem] p-8">
      <div className="space-y-3">{accounts.map((account) => <article key={account.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-semibold text-slate-900">{account.displayName || account.phoneNumber || account.email || "Unnamed account"}</p><p className="text-sm text-slate-500">{account.phoneNumber || account.email || account.id} · {account.role || "customer"}</p></div>
        {account.role === "sales" ? <button onClick={() => void setRole(account, "customer")} className="btn btn-outline btn-sm">Remove sales access</button> : account.role !== "admin" ? <button onClick={() => void setRole(account, "sales")} className="btn btn-primary btn-sm">Make sales executive</button> : null}
      </article>)}</div>
    </section>
  </div></main>;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Account = { id: string; displayName?: string; phoneNumber?: string; email?: string; role?: string; staffCode?: string };

const SALES_CODE_COLLECTION = "systemCounters";
const SALES_CODE_DOCUMENT = "salesExecutive";
const SALES_CODE_PREFIX = "SALES";

async function getNextSalesExecutiveCode() {
  if (!db) {
    throw new Error("Firestore is not configured yet.");
  }

  const counterRef = doc(db, SALES_CODE_COLLECTION, SALES_CODE_DOCUMENT);

  return runTransaction(db, async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);
    const counterData = counterSnapshot.data() as { lastSequence?: unknown } | undefined;
    const storedSequence = typeof counterData?.lastSequence === "number" ? counterData.lastSequence : 0;
    const nextSequence = storedSequence + 1;

    transaction.set(counterRef, { lastSequence: nextSequence, updatedAt: serverTimestamp() }, { merge: true });

    return `${SALES_CODE_PREFIX}-${String(nextSequence).padStart(3, "0")}`;
  });
}

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

  const setRole = async (account: Account, role: "sales_executive" | "customer") => {
    if (!db) return;
    setMessage("");
    try {
      const updates: { role: "sales_executive" | "customer"; staffCode?: string } = { role };
      if (role === "sales_executive" && !account.staffCode) {
        updates.staffCode = await getNextSalesExecutiveCode();
      }
      await updateDoc(doc(db, "users", account.id), updates);
      const codeNote = updates.staffCode ? ` (${updates.staffCode})` : account.staffCode ? ` (${account.staffCode})` : "";
      setMessage(`${account.displayName || account.phoneNumber || account.id} is now ${role === "sales_executive" ? `a sales executive${codeNote}` : "a standard user"}.`);
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
        <div><p className="font-semibold text-slate-900">{account.displayName || account.phoneNumber || account.email || "Unnamed account"}</p><p className="text-sm text-slate-500">{account.phoneNumber || account.email || account.id} · {account.role || "customer"}{account.staffCode ? ` · ${account.staffCode}` : ""}</p></div>
        {(account.role === "sales_executive" || account.role === "sales") ? <button onClick={() => void setRole(account, "customer")} className="btn btn-outline btn-sm">Remove sales access</button> : account.role !== "admin" ? <button onClick={() => void setRole(account, "sales_executive")} className="btn btn-primary btn-sm">Make sales executive</button> : null}
      </article>)}</div>
    </section>
  </div></main>;
}

"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import type { PartnerRegistration } from "@/lib/partner";

export default function ClaimPartnerPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [record, setRecord] = useState<PartnerRegistration | null>(null);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  const claim = async () => {
    if (!db || !user?.uid || !user.phoneNumber) return;
    try {
      setWorking(true);
      const ref = doc(db, "partnerOnboarding", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("Registration link not found.");
      const data = { id: snap.id, ...snap.data() } as PartnerRegistration;
      if (data.phoneE164 !== user.phoneNumber) throw new Error("This login number does not match the registered vendor number.");
      if (data.ownerUid && data.ownerUid !== user.uid) throw new Error("This registration has already been claimed.");
      if (data.status === "otp_pending") {
        const batch = writeBatch(db);
        batch.update(ref, {
          ownerUid: user.uid,
          status: "ownership_verified",
          ownershipVerifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        const vendorId = data.vendorId || data.id;
        batch.update(doc(db, "vendors", vendorId), {
          userId: user.uid,
          ownerUid: user.uid,
          ownershipStatus: "ownership_verified",
          ownershipVerifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        batch.set(doc(db, "users", user.uid), {
          role: "vendor",
          phoneNumber: user.phoneNumber,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        await batch.commit();
      }
      setRecord({ ...data, ownerUid: user.uid, status: "ownership_verified" });
      setMessage("Mobile ownership verified. Your application is now awaiting administrator approval.");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Ownership verification failed."); }
    finally { setWorking(false); }
  };

  useEffect(() => { if (!loading && user) void claim(); }, [loading, user?.uid]);
  return <main className="page-shell min-h-screen px-4 py-16"><section className="section-shell mx-auto max-w-lg rounded-[2rem] p-8">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Vendor Ownership</p><h1 className="mt-2 text-3xl font-semibold">Verify your mobile number</h1>
    <p className="mt-3 text-sm text-slate-600">The vendor must complete OTP verification personally. This securely transfers the assisted registration to the vendor.</p>
    {message && <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">{message}</p>}
    {!loading && !user && <div className="mt-6"><PhoneLogin onError={setMessage} /></div>}
    {working && <p className="mt-5 text-sm text-slate-500">Confirming ownership...</p>}
    {record && <div className="mt-6"><p className="font-semibold">{record.businessName}</p><p className="text-sm text-slate-500">{record.ownerName} · {record.city}</p><Link href="/vendor/dashboard" className="btn btn-primary btn-md mt-5 inline-flex">Continue to vendor dashboard</Link></div>}
  </section></main>;
}

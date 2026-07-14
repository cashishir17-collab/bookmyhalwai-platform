"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { normalizeIndianPhone } from "@/lib/partnerOnboarding";

export default function ClaimPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const router = useRouter(); const { user, loading } = useAuth();
  const [state, setState] = useState("Verify the registered owner mobile number to claim this business profile.");
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (loading || !user || working || done || !db) return;
    const firestore = db;
    const claim = async () => {
      setWorking(true);
      try {
        const onboardingRef = doc(firestore, "partnerOnboarding", id);
        const snapshot = await getDoc(onboardingRef);
        if (!snapshot.exists()) throw new Error("This ownership link is invalid or expired.");
        const data = snapshot.data();
        if (normalizeIndianPhone(user.phoneNumber || "") !== normalizeIndianPhone(data.ownerPhone || "")) throw new Error("This signed-in mobile number does not match the registered owner number.");
        await runTransaction(firestore, async (transaction) => {
          transaction.update(onboardingRef, { ownerUid: user.uid, status: "ownership_verified", ownershipVerifiedAt: serverTimestamp(), updatedAt: serverTimestamp() });
          transaction.update(doc(firestore, "vendors", data.vendorId), { userId: user.uid, verificationStatus: "Pending", leadStage: "Verification", ownershipVerified: true, updatedAt: serverTimestamp() });
          transaction.set(doc(firestore, "users", user.uid), { uid: user.uid, phoneNumber: user.phoneNumber, role: "vendor", vendorId: data.vendorId, updatedAt: serverTimestamp() }, { merge: true });
        });
        setState("Ownership verified. Your profile is now awaiting administrator approval.");
        setDone(true);
        window.setTimeout(() => router.replace("/vendor/dashboard"), 1200);
      } catch (error) { setState(error instanceof Error ? error.message : "Could not verify ownership."); }
      finally { setWorking(false); }
    };
    void claim();
  }, [done, id, loading, router, user, working]);
  return <main className="page-shell min-h-screen px-4 py-12"><section className="section-shell mx-auto max-w-lg rounded-[2rem] p-8"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Business Ownership</p><h1 className="mt-2 text-3xl font-semibold">Claim vendor profile</h1><div className="my-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{working ? "Verifying ownership..." : state}</div>{!user ? <PhoneLogin onError={setState} /> : null}</section></main>;
}

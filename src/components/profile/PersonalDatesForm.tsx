"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PersonalDatesForm({ userId, title = "My personal dates" }: { userId: string; title?: string }) {
  const [birthDate, setBirthDate] = useState("");
  const [anniversaryApplicable, setAnniversaryApplicable] = useState<"" | "yes" | "no">("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    void getDoc(doc(db, "salesExecutives", userId)).then((snapshot) => {
      const data = snapshot.data();
      setBirthDate(typeof data?.birthDate === "string" ? data.birthDate : "");
      setAnniversaryApplicable(data?.anniversaryApplicable === true ? "yes" : data?.anniversaryApplicable === false ? "no" : "");
      setAnniversaryDate(typeof data?.anniversaryDate === "string" ? data.anniversaryDate : "");
    });
  }, [userId]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!db || !birthDate || !anniversaryApplicable || (anniversaryApplicable === "yes" && !anniversaryDate)) {
      setMessage("Complete the birth date and anniversary selection.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "salesExecutives", userId), {
        birthDate,
        anniversaryApplicable: anniversaryApplicable === "yes",
        anniversaryDate: anniversaryApplicable === "yes" ? anniversaryDate : null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMessage("Personal dates saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save personal dates.");
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={save} className="section-shell rounded-[2rem] p-7">
    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-700">Date of birth<input type="date" required max={new Date().toISOString().slice(0, 10)} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" /></label>
      <label className="text-sm font-semibold text-slate-700">Anniversary<select required value={anniversaryApplicable} onChange={(event) => { const value = event.target.value as "" | "yes" | "no"; setAnniversaryApplicable(value); if (value === "no") setAnniversaryDate(""); }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"><option value="">Select</option><option value="yes">Applicable (Married)</option><option value="no">N/A (Not married)</option></select></label>
      {anniversaryApplicable === "yes" ? <label className="text-sm font-semibold text-slate-700">Anniversary date<input type="date" required max={new Date().toISOString().slice(0, 10)} value={anniversaryDate} onChange={(event) => setAnniversaryDate(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" /></label> : null}
    </div>
    {message ? <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p> : null}
    <button disabled={saving} className="btn btn-primary btn-md mt-5">{saving ? "Saving..." : "Save personal dates"}</button>
  </form>;
}

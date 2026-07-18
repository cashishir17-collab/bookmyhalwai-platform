"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import IndiaPhoneInput, { isValidIndianMobile, toIndianMobileDigits, toIndianPhoneE164 } from "@/components/forms/IndiaPhoneInput";

interface ProfileFormProps {
  user: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    role?: string;
  };
  initialData?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    cuisine?: string | null;
    birthDate?: string | null;
    anniversaryApplicable?: boolean | null;
    anniversaryDate?: string | null;
  };
}

export default function ProfileForm({ user, initialData }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || user.displayName || "",
    email: initialData?.email || user.email || "",
    phone: toIndianMobileDigits(initialData?.phone || user.phoneNumber || ""),
    address: initialData?.address || "",
    city: initialData?.city || "",
    cuisine: initialData?.cuisine || "",
    birthDate: initialData?.birthDate || "",
    anniversaryApplicable: initialData?.anniversaryApplicable === true ? "yes" : initialData?.anniversaryApplicable === false ? "no" : "",
    anniversaryDate: initialData?.anniversaryDate || "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      setMessage("Firestore is not configured.");
      return;
    }

    if (!isValidIndianMobile(form.phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.birthDate || !form.anniversaryApplicable || (form.anniversaryApplicable === "yes" && !form.anniversaryDate)) {
      setMessage("Complete the birth date and anniversary selection.");
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: form.name,
        email: form.email,
        phone: toIndianPhoneE164(form.phone),
        address: form.address,
        preferredCity: form.city,
        preferredCuisine: form.cuisine,
        birthDate: form.birthDate,
        anniversaryApplicable: form.anniversaryApplicable === "yes",
        anniversaryDate: form.anniversaryApplicable === "yes" ? form.anniversaryDate : null,
        updatedAt: new Date(),
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="form-control"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="form-control"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <IndiaPhoneInput value={form.phone} onChange={(phone) => setForm((current) => ({ ...current, phone }))} required className="mt-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Preferred City
          <input
            value={form.city}
            onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
            className="form-control"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Default Address
          <textarea
            rows={3}
            value={form.address}
            onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            className="form-control"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Date of Birth
          <input type="date" required max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))} className="form-control" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Anniversary
          <select required value={form.anniversaryApplicable} onChange={(event) => setForm((current) => ({ ...current, anniversaryApplicable: event.target.value, anniversaryDate: event.target.value === "no" ? "" : current.anniversaryDate }))} className="form-control"><option value="">Select</option><option value="yes">Applicable (Married)</option><option value="no">N/A (Not married)</option></select>
        </label>
        {form.anniversaryApplicable === "yes" ? <label className="block text-sm font-medium text-slate-700"><span>Anniversary Date</span><input type="date" required max={new Date().toISOString().slice(0, 10)} value={form.anniversaryDate} onChange={(event) => setForm((current) => ({ ...current, anniversaryDate: event.target.value }))} className="form-control" /></label> : null}
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Preferred Cuisine
          <input
            value={form.cuisine}
            onChange={(event) => setForm((current) => ({ ...current, cuisine: event.target.value }))}
            className="form-control"
          />
        </label>
      </div>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary btn-md type-button disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  };
}

export default function ProfileForm({ user, initialData }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || user.displayName || "",
    email: initialData?.email || user.email || "",
    phone: initialData?.phone || user.phoneNumber || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    cuisine: initialData?.cuisine || "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      setMessage("Firestore is not configured.");
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        preferredCity: form.city,
        preferredCuisine: form.cuisine,
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
          <input
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="form-control"
          />
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

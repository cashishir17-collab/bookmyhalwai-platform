"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Headset, Mail, MapPin, Phone, SendHorizontal } from "lucide-react";

type ContactState = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  helpNeeded: string;
  message: string;
};

const initialState: ContactState = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  city: "",
  helpNeeded: "Vendor Registration",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactState>(initialState);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <T extends keyof ContactState>(field: T, value: ContactState[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: `Help Needed: ${form.helpNeeded}\n${form.message}`,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus(payload.message || "Unable to send your message. Please try again.");
        return;
      }

      setStatus("Your enquiry has been received. Our team will contact you shortly.");
      setForm(initialState);
    } catch {
      setStatus("Network issue detected. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell min-h-screen px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="section-shell rounded-[2rem] p-7 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C4B5FD] bg-[#F5F3FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A]">
            <Headset className="h-3.5 w-3.5" /> Contact
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Vendor onboarding support across India</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Share your business details and our team will guide you through registration, compliance, and launch readiness.
          </p>

          <div className="mt-7 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#6D28D9]" /> admin@bookmyhalwai.com
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#6D28D9]" /> +91 9557421217
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#6D28D9]" /> Serving Vendors Across India
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Prefer self-serve signup? Use the registration wizard and complete onboarding in minutes.
            <div className="mt-3">
              <Link href="/vendor/register" className="btn btn-outline btn-sm type-button">
                Go to Vendor Registration
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell rounded-[2rem] p-7 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Contact Onboarding Team</h2>
          <p className="mt-2 text-sm text-slate-600">Share your requirement and our team will connect with the right support flow.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Business Name
              <input
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                placeholder="The Royal Caterers"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Owner Name
                <input
                  value={form.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                  placeholder="Amit Sharma"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                City
                <input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                  placeholder="Noida"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Work Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                  placeholder="yourbusiness@domain.com"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone Number
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                  placeholder="+91 9876543210"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Help Needed
              <select
                value={form.helpNeeded}
                onChange={(event) => updateField("helpNeeded", event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
              >
                <option>Vendor Registration</option>
                <option>GST Registration</option>
                <option>FSSAI License</option>
                <option>General Support</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Message
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
                placeholder="Tell us about your business and the support you need."
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg type-button inline-flex w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              <SendHorizontal className="h-4 w-4" /> {isSubmitting ? "Sending..." : "Submit Enquiry"}
            </button>

            {status ? (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{status}</p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
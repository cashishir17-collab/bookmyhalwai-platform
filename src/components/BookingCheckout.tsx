"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import BookingSummary from "@/components/BookingSummary";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { addNotification } from "@/lib/notifications";

interface BookingCheckoutProps {
  catererId: string;
  catererName: string;
  packageName: string;
  eventDate: string;
  guests: number;
  pricePerPlate: number;
  estimatedTotal: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN");
}

export default function BookingCheckout({
  catererId,
  catererName,
  packageName,
  eventDate,
  guests,
  pricePerPlate,
  estimatedTotal,
}: BookingCheckoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const advanceAmount = useMemo(() => Math.round(estimatedTotal * 0.2), [estimatedTotal]);
  const remainingAmount = useMemo(() => estimatedTotal - advanceAmount, [estimatedTotal, advanceAmount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!db) {
      setSubmitError("Firebase is not configured right now.");
      return;
    }

    if (!fullName || !mobileNumber || !email || !eventAddress) {
      setSubmitError("Please fill in your name, contact details, and event address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
      const bookingPayload = {
        bookingId,
        customerId: user?.uid || "guest",
        vendorId: catererId,
        catererId,
        catererName: catererName || catererId || "Selected Caterer",
        packageName,
        eventDate,
        guests,
        pricePerPlate,
        estimatedTotal,
        advanceAmount,
        remainingAmount,
        customerName: fullName || user?.displayName || "Guest",
        customerPhone: mobileNumber || user?.phoneNumber || "",
        customerEmail: email || user?.email || "",
        eventAddress,
        specialInstructions: instructions,
        status: "Pending",
        paymentStatus: "Advance Pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingPayload);
      await addNotification({
        userId: user?.uid || "guest",
        bookingId: bookingRef.id,
        type: "booking_created",
        title: "Booking requested",
        message: `Your booking request for ${catererName || catererId || "the selected caterer"} is pending review.`,
      });

      setBookingConfirmed(true);
      window.setTimeout(() => {
        router.push("/customer/bookings");
      }, 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create the booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <BookingSummary
          catererName={catererName}
          packageName={packageName}
          eventDate={eventDate}
          guests={guests}
          pricePerPlate={pricePerPlate}
          estimatedTotal={estimatedTotal}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-900">Customer details</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                type="text"
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mobile Number
              <input
                value={mobileNumber}
                onChange={(event) => setMobileNumber(event.target.value)}
                type="tel"
                placeholder="Enter mobile number"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Event Address
            <textarea
              value={eventAddress}
              onChange={(event) => setEventAddress(event.target.value)}
              placeholder="Enter event address"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              rows={4}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Special Instructions
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Any special requests or dietary notes"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              rows={4}
            />
          </label>

          <div className="rounded-[2rem] border border-slate-200 bg-orange-50 p-6 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Advance amount (20%)</span>
              <span className="font-semibold text-slate-900">₹{formatCurrency(advanceAmount)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span>Remaining amount</span>
              <span className="font-semibold text-slate-900">₹{formatCurrency(remainingAmount)}</span>
            </div>
          </div>

          {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-orange-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isSubmitting ? "Creating booking..." : "Pay Advance & Confirm Booking"}
          </button>
        </form>
      </section>

      {bookingConfirmed ? (
        <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-lg font-semibold text-emerald-800">Booking request created successfully.</p>
          <p className="mt-3 text-sm leading-6 text-emerald-700">
            Your booking request has been received and you will be redirected to your bookings shortly.
          </p>
        </section>
      ) : null}
    </div>
  );
}

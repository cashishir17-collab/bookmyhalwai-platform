"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import BookingTimeline from "@/components/customer/BookingTimeline";
import StatusBadge from "@/components/customer/StatusBadge";

interface BookingDetailsRecord {
  id?: string;
  catererName?: string;
  eventDate?: string;
  eventType?: string;
  guestCount?: number;
  packageName?: string;
  status?: string;
  notes?: string;
  vendorNotes?: string;
  totalAmount?: number;
  advancePaid?: number;
  paymentMethod?: string;
}

export default function CustomerBookingDetailsPage() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingDetailsRecord | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!db || !params?.id) return;
      const snapshot = await getDoc(doc(db, "bookings", String(params.id)));
      if (snapshot.exists()) {
        setBooking({ id: snapshot.id, ...(snapshot.data() as BookingDetailsRecord) });
      }
    };

    fetchBooking();
  }, [params?.id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Booking Details</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{booking.catererName || "Caterer"}</h1>
            </div>
            <StatusBadge status={booking.status || "Pending"} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Booking Summary</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Event Date</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.eventDate || "TBD"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Event Type</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.eventType || "Event"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Guests</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.guestCount || 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Package</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.packageName || "Standard"}</p>
                </div>
              </div>
            </div>

            <BookingTimeline status={booking.status || "Pending"} />
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Payment Summary</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span>₹{booking.totalAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance Paid</span>
                  <span>₹{booking.advancePaid || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{booking.paymentMethod || "Pending"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Notes</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Customer notes:</span> {booking.notes || "No notes provided."}</p>
                <p><span className="font-semibold text-slate-800">Vendor notes:</span> {booking.vendorNotes || "No vendor notes yet."}</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <div className="flex flex-wrap gap-3">
                <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
                  Download Invoice
                </button>
                <button type="button" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
                  Cancel Booking
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-500">Cancellation policy applies based on the booking package and timeline.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <Link href="/customer/bookings" className="text-sm font-semibold text-orange-600">
            ← Back to bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

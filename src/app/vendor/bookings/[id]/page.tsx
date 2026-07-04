"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BookingDetailsRecord {
  id?: string;
  customerName?: string;
  eventDate?: string;
  eventType?: string;
  packageName?: string;
  guestCount?: number;
  status?: string;
  amount?: number;
  notes?: string;
}

const statusOptions = ["Accepted", "Preparing", "Cooking", "Dispatched", "Serving", "Completed", "Cancelled"];

export default function VendorBookingDetailsPage() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingDetailsRecord | null>(null);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!db || !params?.id) return;
    const snapshot = await getDoc(doc(db, "bookings", String(params.id)));
    if (snapshot.exists()) {
      const data = snapshot.data() as BookingDetailsRecord;
      setBooking({ id: snapshot.id, ...data });
      setNotes(data.notes || "");
    }
  }, [params]);

  useEffect(() => {
    let isMounted = true;
    const loadBooking = async () => {
      if (!isMounted) {
        return;
      }
      await fetchBooking();
    };

    void loadBooking();
    return () => {
      isMounted = false;
    };
  }, [fetchBooking]);

  const updateStatus = async (nextStatus: string) => {
    if (!db || !booking?.id) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: nextStatus,
        updatedAt: new Date(),
      });
      await fetchBooking();
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!db || !booking?.id) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        notes,
        updatedAt: new Date(),
      });
      await fetchBooking();
    } finally {
      setIsUpdating(false);
    }
  };

  const summary = useMemo(() => [
    { label: "Customer", value: booking?.customerName || "Customer" },
    { label: "Event Date", value: booking?.eventDate || "TBD" },
    { label: "Event Type", value: booking?.eventType || "Event" },
    { label: "Package", value: booking?.packageName || "Standard" },
    { label: "Guests", value: booking?.guestCount || 0 },
    { label: "Amount", value: `₹${booking?.amount || 0}` },
  ], [booking]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading booking...</p>
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
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{booking.customerName || "Customer"}</h1>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{booking.status || "Pending"}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Booking Summary</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{String(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Update Status</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {statusOptions.map((status) => (
                  <button key={status} type="button" onClick={() => updateStatus(status)} disabled={isUpdating} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Add Notes</h2>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
              <button type="button" onClick={saveNotes} disabled={isUpdating} className="mt-4 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70">
                Save Notes
              </button>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
              <Link href="/vendor/bookings" className="text-sm font-semibold text-orange-600">← Back to bookings</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VendorBookingCardProps {
  booking: {
    id: string;
    customerName?: string;
    eventDate?: string;
    eventType?: string;
    packageName?: string;
    guestCount?: number;
    status?: string;
    amount?: number;
  };
  onUpdated?: () => void;
}

export default function VendorBookingCard({ booking, onUpdated }: VendorBookingCardProps) {
  const updateStatus = async (nextStatus: string) => {
    if (!db) return;
    await updateDoc(doc(db, "bookings", booking.id), {
      status: nextStatus,
      updatedAt: new Date(),
    });
    onUpdated?.();
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Booking #{booking.id}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.customerName || "Customer"}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventDate || "TBD"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventType || "Event"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.guestCount || 0} guests</span>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          {booking.status || "Pending"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <span>Package: {booking.packageName || "Standard"}</span>
        <span>Amount: ₹{booking.amount || 0}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => updateStatus("Accepted")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
          Accept
        </button>
        <button type="button" onClick={() => updateStatus("Rejected")} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
          Reject
        </button>
        <Link href={`/vendor/bookings/${booking.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
          View Details
        </Link>
      </div>
    </div>
  );
}

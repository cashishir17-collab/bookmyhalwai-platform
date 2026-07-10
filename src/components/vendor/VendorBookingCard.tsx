"use client";

import Link from "next/link";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addNotification } from "@/lib/notifications";

interface VendorBookingCardProps {
  booking: {
    id: string;
    customerId?: string;
    customerName?: string;
    eventDate?: string;
    eventType?: string;
    packageName?: string;
    guestCount?: number;
    status?: string;
    amount?: number;
    paymentStatus?: string;
  };
  onUpdated?: () => void;
}

export default function VendorBookingCard({ booking, onUpdated }: VendorBookingCardProps) {
  const updateStatus = async (nextStatus: string) => {
    if (!db) return;
    await updateDoc(doc(db, "bookings", booking.id), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    });

    await addNotification({
      userId: booking.customerId || booking.id,
      bookingId: booking.id,
      type: nextStatus === "Accepted" ? "booking_accepted" : "booking_rejected",
      title: nextStatus === "Accepted" ? "Booking accepted" : "Booking rejected",
      message: nextStatus === "Accepted"
        ? `Your booking for ${booking.eventDate || "the requested event"} has been accepted.`
        : `Your booking for ${booking.eventDate || "the requested event"} has been rejected.`,
    });

    onUpdated?.();
  };

  return (
    <div className="premium-card rounded-[1.75rem] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F172A]">Booking #{booking.id}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.customerName || "Customer"}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventDate || "TBD"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventType || "Event"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.guestCount || 0} guests</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            {booking.status || "Pending"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-sm font-semibold text-slate-700">
            {booking.paymentStatus || "Advance Pending"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <span>Package: {booking.packageName || "Standard"}</span>
        <span>Amount: ₹{booking.amount || 0}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => updateStatus("Accepted")} className="btn btn-success btn-sm type-button">
          Accept
        </button>
        <button type="button" onClick={() => updateStatus("Rejected")} className="btn btn-danger btn-sm type-button">
          Reject
        </button>
        <Link href={`/vendor/bookings/${booking.id}`} className="btn btn-outline btn-sm type-button">
          View Details
        </Link>
      </div>
    </div>
  );
}

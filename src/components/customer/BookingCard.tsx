"use client";

import Link from "next/link";
import StatusBadge from "@/components/customer/StatusBadge";

interface BookingCardProps {
  booking: {
    id: string;
    bookingId?: string;
    catererName?: string;
    eventDate?: string;
    eventType?: string;
    guests?: number;
    guestCount?: number;
    packageName?: string;
    status?: string;
    paymentStatus?: string;
  };
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <Link
      href={`/customer/bookings/${booking.id}`}
      className="premium-card block rounded-[1.75rem] p-6 transition hover:-translate-y-1"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F172A]">{booking.bookingId || `Booking #${booking.id}`}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.catererName || "Caterer"}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventDate || "TBD"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventType || "Event"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.guests || booking.guestCount || 0} guests</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <StatusBadge status={booking.status || "Pending"} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-sm font-semibold text-slate-700">
            {booking.paymentStatus || "Advance Pending"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
        <span>Package: {booking.packageName || "Standard"}</span>
        <span className="font-semibold text-slate-800">View details →</span>
      </div>
    </Link>
  );
}

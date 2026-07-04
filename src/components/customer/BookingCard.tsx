"use client";

import Link from "next/link";
import StatusBadge from "@/components/customer/StatusBadge";

interface BookingCardProps {
  booking: {
    id: string;
    catererName?: string;
    eventDate?: string;
    eventType?: string;
    guestCount?: number;
    packageName?: string;
    status?: string;
  };
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <Link
      href={`/customer/bookings/${booking.id}`}
      className="block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Booking #{booking.id}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.catererName || "Caterer"}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventDate || "TBD"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.eventType || "Event"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{booking.guestCount || 0} guests</span>
          </div>
        </div>
        <StatusBadge status={booking.status || "Pending"} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
        <span>Package: {booking.packageName || "Standard"}</span>
        <span className="font-semibold text-slate-800">View details →</span>
      </div>
    </Link>
  );
}

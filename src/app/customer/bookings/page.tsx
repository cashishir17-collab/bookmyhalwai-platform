"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import BookingCard from "@/components/customer/BookingCard";

interface BookingRecord {
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
}

export default function CustomerBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!db || !user?.uid) {
        setBookings([]);
        setIsLoading(false);
        return;
      }

      const bookingQuery = query(collection(db, "bookings"), where("customerId", "==", user.uid));
      const snapshot = await getDocs(bookingQuery);
      setBookings(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as Omit<BookingRecord, "id">;
          return { id: docSnapshot.id, ...data };
        }),
      );
      setIsLoading(false);
    };

    fetchBookings();
  }, [user?.uid]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">My Bookings</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage your event bookings</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Review every booking request and track its progress from confirmation to completion.
          </p>
        </div>

        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div className="rounded-[2.5rem] bg-white p-10 text-center shadow-xl">
              <p className="text-lg font-semibold text-slate-900">No bookings yet</p>
              <p className="mt-3 text-sm text-slate-500">Start by browsing caterers and creating your first booking request.</p>
            </div>
          ) : (
            bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          )}
        </div>
      </div>
    </div>
  );
}

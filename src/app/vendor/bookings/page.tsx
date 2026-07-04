"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import VendorBookingCard from "@/components/vendor/VendorBookingCard";

interface BookingRecord {
  id: string;
  customerName?: string;
  eventDate?: string;
  eventType?: string;
  packageName?: string;
  guestCount?: number;
  status?: string;
  amount?: number;
}

export default function VendorBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!db || !user?.uid) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    const bookingQuery = query(collection(db, "bookings"), where("vendorId", "==", user.uid));
    const snapshot = await getDocs(bookingQuery);
    setBookings(snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data() as Omit<BookingRecord, "id">;
      return { id: docSnapshot.id, ...data };
    }));
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const loadBookings = async () => {
      if (!isMounted) {
        return;
      }
      await fetchBookings();
    };

    void loadBookings();
    return () => {
      isMounted = false;
    };
  }, [fetchBookings]);

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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Booking Requests</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage customer bookings</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Review new requests, accept or reject them, and keep status updates flowing in real time.
          </p>
        </div>

        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div className="rounded-[2.5rem] bg-white p-10 text-center shadow-xl">
              <p className="text-lg font-semibold text-slate-900">No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking) => <VendorBookingCard key={booking.id} booking={booking} onUpdated={fetchBookings} />)
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import DashboardCard from "@/components/customer/DashboardCard";

interface BookingSummary {
  id: string;
  status?: string;
}

export default function CustomerDashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
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
          const data = docSnapshot.data() as Omit<BookingSummary, "id">;
          return { id: docSnapshot.id, ...data };
        }),
      );
      setIsLoading(false);
    };

    fetchBookings();
  }, [user?.uid]);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => booking.status === "Approved" || booking.status === "Pending").length;
    const pending = bookings.filter((booking) => booking.status === "Pending").length;
    const completed = bookings.filter((booking) => booking.status === "Completed").length;

    return [
      { title: "Upcoming Bookings", value: upcoming, description: "Events in progress", accent: "orange" as const },
      { title: "Pending Requests", value: pending, description: "Awaiting approval", accent: "violet" as const },
      { title: "Completed Events", value: completed, description: "Past celebrations", accent: "emerald" as const },
      { title: "Saved Caterers", value: 0, description: "Coming soon", accent: "blue" as const },
    ];
  }, [bookings]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">My Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Customer Dashboard</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Manage your booking requests, track your upcoming events, and keep your profile up to date.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Recent Activity</h2>
                <p className="mt-2 text-sm text-slate-500">A quick snapshot of your recent booking activity.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {bookings.length === 0 ? (
                <p className="text-sm text-slate-500">No activity yet.</p>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Booking #{booking.id} is currently {booking.status || "Pending"}.
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-6 space-y-3">
              <Link href="/caterers" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
                Find Caterers
              </Link>
              <Link href="/customer/bookings" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
                My Bookings
              </Link>
              <Link href="/customer/profile" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

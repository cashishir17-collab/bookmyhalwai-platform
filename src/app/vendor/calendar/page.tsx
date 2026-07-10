"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CalendarEventCard from "@/components/vendor/CalendarEventCard";

interface CalendarEvent {
  id: string;
  title?: string;
  eventDate?: string;
  status?: string;
}

export default function VendorCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!db) return;
      const snapshot = await getDocs(collection(db, "bookings"));
      setEvents(snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        title: docSnapshot.data().customerName || "Event",
        eventDate: docSnapshot.data().eventDate || "TBD",
        status: docSnapshot.data().status || "Scheduled",
      })));
    };

    fetchEvents();
  }, []);

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Calendar</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Upcoming events</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Track your upcoming bookings in a simple monthly calendar view.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <CalendarEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

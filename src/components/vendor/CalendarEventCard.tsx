"use client";

interface CalendarEventCardProps {
  event: {
    id: string;
    title?: string;
    date?: string;
    status?: string;
  };
  onSelect?: (eventId: string) => void;
}

export default function CalendarEventCard({ event, onSelect }: CalendarEventCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(event.id)}
      className="w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <p className="text-sm font-semibold text-slate-900">{event.title || "Event"}</p>
      <p className="mt-2 text-sm text-slate-500">{event.date || "TBD"}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A]">{event.status || "Scheduled"}</p>
    </button>
  );
}

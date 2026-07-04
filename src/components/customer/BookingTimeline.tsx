"use client";

interface BookingTimelineProps {
  status: string;
}

const steps = ["Requested", "Approved", "Confirmed", "Completed"];

export default function BookingTimeline({ status }: BookingTimelineProps) {
  const activeIndex = ["Pending", "Approved", "Completed", "Cancelled"].indexOf(status);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-semibold text-slate-900">Booking Timeline</h3>
      <div className="mt-5 flex flex-wrap gap-3">
        {steps.map((step, index) => {
          const isActive = index <= (status === "Cancelled" ? 0 : activeIndex);
          return (
            <div
              key={step}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                isActive ? "bg-orange-600 text-white" : "bg-white text-slate-600"
              }`}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

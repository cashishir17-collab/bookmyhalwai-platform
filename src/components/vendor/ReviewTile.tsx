"use client";

interface ReviewTileProps {
  review: {
    customerName?: string;
    rating?: number;
    review?: string;
    eventDate?: string;
  };
}

export default function ReviewTile({ review }: ReviewTileProps) {
  return (
    <div className="premium-card rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{review.customerName || "Customer"}</h3>
          <p className="mt-1 text-sm text-slate-500">{review.eventDate || "Event date"}</p>
        </div>
        <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          ⭐ {review.rating || 0}/5
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{review.review || "No review provided."}</p>
    </div>
  );
}

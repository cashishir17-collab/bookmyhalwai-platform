interface BookingSummaryProps {
  catererName: string;
  packageName: string;
  eventDate: string;
  guests: number;
  pricePerPlate: number;
  estimatedTotal: number;
}

export default function BookingSummary({
  catererName,
  packageName,
  eventDate,
  guests,
  pricePerPlate,
  estimatedTotal,
}: BookingSummaryProps) {
  const advance = Math.round(estimatedTotal * 0.2);
  const remaining = estimatedTotal - advance;

  return (
    <div className="card-info p-6">
      <h2 className="text-xl font-semibold text-slate-900">Booking Summary</h2>
      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Caterer</span>
          <span>{catererName}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Package</span>
          <span>{packageName}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Event Date</span>
          <span>{eventDate || "Not selected"}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Guests</span>
          <span>{guests}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Price per plate</span>
          <span>₹{pricePerPlate}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="font-medium text-slate-800">Estimated total</span>
          <span className="font-semibold text-slate-900">₹{estimatedTotal.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
        <p className="font-semibold text-[#0F172A]">Payment split</p>
        <div className="mt-3 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span>Advance amount</span>
            <span className="font-semibold text-slate-900">₹{advance.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span>Remaining amount</span>
            <span className="font-semibold text-slate-900">₹{remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

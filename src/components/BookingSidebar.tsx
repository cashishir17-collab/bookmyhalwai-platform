"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingSidebarProps {
  catererId: string;
}

const packages = [
  { key: "silver", label: "Silver Package", price: 450 },
  { key: "gold", label: "Gold Package", price: 650 },
  { key: "royal", label: "Royal Package", price: 950 },
];

export default function BookingSidebar({ catererId }: BookingSidebarProps) {
  const router = useRouter();
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(100);
  const [selectedPackage, setSelectedPackage] = useState("gold");

  const selectedPackageData = packages.find((item) => item.key === selectedPackage) ?? packages[1];

  const estimatedPrice = useMemo(
    () => selectedPackageData.price * guestCount,
    [guestCount, selectedPackageData.price],
  );

  const handleBookNow = () => {
    const query = new URLSearchParams({
      catererId,
      packageName: selectedPackageData.label,
      pricePerPlate: String(selectedPackageData.price),
      guests: String(guestCount),
      estimatedTotal: String(estimatedPrice),
      eventDate,
    });

    router.push(`/bookings/new?${query.toString()}`);
  };

  return (
    <aside className="sticky top-6 space-y-6 rounded-[2rem] bg-white p-6 shadow-lg">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-600">Booking</p>
        <h2 className="text-2xl font-semibold text-slate-900">Reserve your date</h2>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
        <label className="block text-sm font-medium text-slate-700">
          Event Date
          <input
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Number of Guests
          <input
            type="number"
            min="1"
            value={guestCount}
            onChange={(event) => setGuestCount(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </label>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-700">Package selector</p>
        <div className="mt-3 space-y-3">
          {packages.map((pkg) => (
            <button
              key={pkg.key}
              type="button"
              onClick={() => setSelectedPackage(pkg.key)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${selectedPackage === pkg.key ?
                "border border-orange-300 bg-orange-100 text-orange-700" :
                "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
            >
              <div className="flex items-center justify-between">
                <span>{pkg.label}</span>
                <span className="font-semibold">₹{pkg.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Price per plate</span>
          <span>₹{selectedPackageData.price}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Guests</span>
          <span>{guestCount}</span>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">Estimated total</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">₹{estimatedPrice.toLocaleString()}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBookNow}
        className="w-full rounded-3xl bg-orange-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        Book Now
      </button>
    </aside>
  );
}

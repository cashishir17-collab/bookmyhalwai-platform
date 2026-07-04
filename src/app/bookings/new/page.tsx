import { Metadata } from "next";
import BookingCheckout from "@/components/BookingCheckout";

export const metadata: Metadata = {
  title: "Confirm Booking | BookMyHalwai",
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN");
}

function parseNumberParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function NewBookingPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const catererId = typeof searchParams.catererId === "string" ? searchParams.catererId : "";
  const packageName = typeof searchParams.packageName === "string" ? searchParams.packageName : "Gold Package";
  const pricePerPlate = parseNumberParam(typeof searchParams.pricePerPlate === "string" ? searchParams.pricePerPlate : null, 650);
  const guestsFromUrl = parseNumberParam(typeof searchParams.guests === "string" ? searchParams.guests : null, 100);
  const eventDate = typeof searchParams.eventDate === "string" ? searchParams.eventDate : "";
  const estimatedTotalFromUrl = parseNumberParam(
    typeof searchParams.estimatedTotal === "string" ? searchParams.estimatedTotal : null,
    pricePerPlate * guestsFromUrl,
  );

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2.5rem] bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Confirm your booking</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Review your booking details and provide customer information to create a booking request.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <BookingCheckout
              catererId={catererId}
              catererName={catererId || "Selected Caterer"}
              packageName={packageName}
              eventDate={eventDate}
              guests={guestsFromUrl}
              pricePerPlate={pricePerPlate}
              estimatedTotal={estimatedTotalFromUrl}
            />
          </div>

          <aside className="rounded-[2rem] bg-white p-8 shadow-lg">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Quick summary</h2>
              <div className="grid gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Caterer</p>
                  <p className="mt-2 font-semibold text-slate-900">{catererId || "Selected Caterer"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Package</p>
                  <p className="mt-2 font-semibold text-slate-900">{packageName}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Estimated total</p>
                  <p className="mt-2 font-semibold text-slate-900">₹{formatCurrency(estimatedTotalFromUrl)}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

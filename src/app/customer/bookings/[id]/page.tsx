"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import BookingTimeline from "@/components/customer/BookingTimeline";
import StatusBadge from "@/components/customer/StatusBadge";

interface BookingDetailsRecord {
  id?: string;
  bookingId?: string;
  catererName?: string;
  eventDate?: string;
  eventType?: string;
  guests?: number;
  guestCount?: number;
  packageName?: string;
  status?: string;
  paymentStatus?: string;
  specialInstructions?: string;
  eventAddress?: string;
  estimatedTotal?: number;
  advanceAmount?: number;
  remainingAmount?: number;
  notes?: string;
  vendorNotes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerId?: string;
  vendorId?: string;
  reviewSubmitted?: boolean;
  cancellationReason?: string;
}

export default function CustomerBookingDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetailsRecord | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!db || !params?.id) return;
      const snapshot = await getDoc(doc(db, "bookings", String(params.id)));
      if (snapshot.exists()) {
        setBooking({ id: snapshot.id, ...(snapshot.data() as BookingDetailsRecord) });
      }
    };

    fetchBooking();
  }, [params?.id]);

  const handlePayAdvance = async () => {
    setPaymentMessage("Secure online payments are being activated. No amount has been charged.");
  };

  const requestCancellation = async () => {
    if (!db || !booking?.id || !cancellationReason.trim()) return;
    await updateDoc(doc(db, "bookings", booking.id), { status: "Cancellation Requested", cancellationReason: cancellationReason.trim(), cancellationRequestedAt: serverTimestamp(), updatedAt: serverTimestamp() });
    setBooking((current) => current ? { ...current, status: "Cancellation Requested", cancellationReason } : current);
  };

  const submitReview = async () => {
    if (!db || !booking?.id || !user || !review.trim()) return;
    await addDoc(collection(db, "reviews"), { bookingId: booking.id, customerId: user.uid, customerName: user.displayName || booking.customerName || "Customer", vendorId: booking.vendorId || "", rating, review: review.trim(), eventDate: booking.eventDate || "", verified: true, createdAt: serverTimestamp() });
    await updateDoc(doc(db, "bookings", booking.id), { reviewSubmitted: true, updatedAt: serverTimestamp() });
    setBooking((current) => current ? { ...current, reviewSubmitted: true } : current);
  };

  if (!booking) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-7xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const invoiceNumber = booking.bookingId ? `INV-${booking.bookingId.slice(0, 8).toUpperCase()}` : "INV-000000";

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Booking Details</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{booking.catererName || "Caterer"}</h1>
              <p className="mt-2 text-sm text-slate-500">{booking.bookingId || booking.id}</p>
            </div>
            <div className="flex flex-col gap-2">
              <StatusBadge status={booking.status || "Pending"} />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-sm font-semibold text-slate-700">
                {booking.paymentStatus || "Advance Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Booking Summary</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Event Date</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.eventDate || "TBD"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Event Address</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.eventAddress || "TBD"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Guests</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.guests || booking.guestCount || 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Package</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.packageName || "Standard"}</p>
                </div>
              </div>
            </div>

            <BookingTimeline status={booking.status || "Pending"} />
          </div>

          <div className="space-y-6">
            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Payment Summary</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Estimated Total</span>
                  <span>₹{booking.estimatedTotal || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance Amount</span>
                  <span>₹{booking.advanceAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Amount</span>
                  <span>₹{booking.remainingAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span>{booking.paymentStatus || "Advance Pending"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePayAdvance}
                disabled={booking.paymentStatus === "Advance Paid"}
                className="btn btn-primary btn-md type-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {booking.paymentStatus === "Advance Paid" ? "Advance Paid" : "Pay Advance Securely"}
              </button>
              {paymentMessage ? <p className="mt-3 text-sm text-emerald-700">{paymentMessage}</p> : null}
            </div>

            {!(["Completed", "Cancelled", "Cancellation Requested"].includes(booking.status || "")) ? <div className="section-shell rounded-[2rem] p-8"><h2 className="text-2xl font-semibold text-slate-900">Cancellation</h2><textarea value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} rows={3} placeholder="Tell us why you need to cancel" className="form-control mt-4"/><button type="button" onClick={requestCancellation} className="btn btn-outline btn-sm mt-4">Request cancellation</button></div> : null}

            {booking.status === "Completed" && !booking.reviewSubmitted ? <div className="section-shell rounded-[2rem] p-8"><h2 className="text-2xl font-semibold text-slate-900">Verified review</h2><select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="form-control mt-4">{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select><textarea value={review} onChange={(event) => setReview(event.target.value)} rows={4} placeholder="Share your experience" className="form-control mt-3"/><button type="button" onClick={submitReview} className="btn btn-primary btn-sm mt-4">Publish verified review</button></div> : null}

            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Invoice</h2>
              <p className="mt-4 text-sm text-slate-600">Invoice Number: {invoiceNumber}</p>
              <button type="button" className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-[#0F172A]">
                Download Invoice (Coming Soon)
              </button>
            </div>

            <div className="section-shell rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Contact & Notes</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Customer:</span> {booking.customerName || "Guest"}</p>
                <p><span className="font-semibold text-slate-800">Phone:</span> {booking.customerPhone || "—"}</p>
                <p><span className="font-semibold text-slate-800">Email:</span> {booking.customerEmail || "—"}</p>
                <p><span className="font-semibold text-slate-800">Special instructions:</span> {booking.specialInstructions || "No special instructions provided."}</p>
                <p><span className="font-semibold text-slate-800">Vendor notes:</span> {booking.vendorNotes || "No vendor notes yet."}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-shell rounded-[2rem] p-8">
          <Link href="/customer/bookings" className="text-sm font-semibold text-[#0F172A]">
            ← Back to bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

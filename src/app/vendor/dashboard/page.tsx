"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import VendorDashboardCard from "@/components/vendor/VendorDashboardCard";

interface BookingSummary {
  id: string;
  customerName?: string;
  eventDate?: string;
  status?: string;
  amount?: number;
}

interface VendorApplication {
  id: string;
  businessName?: string;
  verificationStatus?: string;
  profileCompletion?: number;
  leadStage?: string;
  documents?: {
    kitchenPhotos?: string[];
    foodPhotos?: string[];
    staffPhotos?: string[];
    logo?: string | null;
    menuPdf?: string | null;
    fssai?: string | null;
    gst?: string | null;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    googleBusinessProfile?: string;
    googleReviewLink?: string;
  };
}

export default function VendorDashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [vendorApplication, setVendorApplication] = useState<VendorApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!db || !user?.uid) {
        setBookings([]);
        setVendorApplication(null);
        setIsLoading(false);
        return;
      }

      const bookingQuery = query(collection(db, "bookings"), where("vendorId", "==", user.uid));
      const vendorQuery = query(collection(db, "vendors"), where("userId", "==", user.uid));
      const [bookingSnapshot, vendorSnapshot] = await Promise.all([getDocs(bookingQuery), getDocs(vendorQuery)]);

      setBookings(bookingSnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<BookingSummary, "id">),
      })));

      const vendorDoc = vendorSnapshot.docs[0];
      setVendorApplication(vendorDoc ? { id: vendorDoc.id, ...(vendorDoc.data() as Omit<VendorApplication, "id">) } : null);
      setIsLoading(false);
    };

    fetchData();
  }, [user?.uid]);

  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "Pending" || booking.status === "Accepted").length;
    const completed = bookings.filter((booking) => booking.status === "Completed").length;
    const revenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

    return {
      pending,
      completed,
      revenue,
      total: bookings.length,
    };
  }, [bookings]);

  const checklist = [
    {
      label: "Upload more photos",
      done: Boolean(vendorApplication?.documents?.kitchenPhotos?.length || vendorApplication?.documents?.foodPhotos?.length || vendorApplication?.documents?.staffPhotos?.length),
    },
    {
      label: "Complete menu",
      done: Boolean(vendorApplication?.documents?.menuPdf),
    },
    {
      label: "Add social links",
      done: Boolean(vendorApplication?.social?.instagram || vendorApplication?.social?.facebook || vendorApplication?.social?.website),
    },
    {
      label: "Verify FSSAI",
      done: Boolean(vendorApplication?.documents?.fssai),
    },
  ];

  const completionPercent = vendorApplication?.profileCompletion ?? 25;
  const verificationStatus = vendorApplication?.verificationStatus || "Pending";
  const pendingDocuments = [
    !vendorApplication?.documents?.fssai && "FSSAI",
    !vendorApplication?.documents?.gst && "GST",
    !vendorApplication?.documents?.menuPdf && "Menu PDF",
    !(vendorApplication?.documents?.kitchenPhotos?.length || vendorApplication?.documents?.foodPhotos?.length || vendorApplication?.documents?.staffPhotos?.length) && "Photos",
  ].filter(Boolean) as string[];

  if (loading || isLoading) {
    return (
      <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell mx-auto max-w-6xl rounded-[2rem] p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading your kitchen operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Vendor Operations Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, {user?.displayName || "vendor"}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Keep bookings moving, manage your premium profile, and track customer enquiries from one streamlined workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/vendor/bookings" className="btn btn-primary btn-md type-button">Review Bookings</Link>
            <Link href="/vendor/menus" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-[#0F172A]">Update Menus</Link>
            <Link href="/vendor/reviews" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-[#0F172A]">View Reviews</Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="section-shell rounded-[2rem] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Application Status</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{vendorApplication?.businessName || "Your application"}</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">✓ Registration Received</span>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Application status</p>
                  <p className="mt-1 text-sm text-slate-600">Documents uploaded • Verification pending</p>
                </div>
                <div className="rounded-full bg-[#F5F3FF] px-3 py-1 text-sm font-semibold text-[#0F172A]">{verificationStatus}</div>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-slate-200">
                <div className="h-2.5 rounded-full bg-[#0F172A]" style={{ width: `${completionPercent}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">Profile completion {completionPercent}%</p>
            </div>

            <div className="mt-6 space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.done ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-300 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">KYC follow-up</p>
                  <p className="mt-1 text-sm text-slate-600">{pendingDocuments.length ? `Pending: ${pendingDocuments.join(", ")}` : "All requested documents are in place."}</p>
                </div>
                <Link href="/vendor/dashboard#verification" className="btn btn-primary btn-sm type-button">Review status</Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
            <VendorDashboardCard title="Active Requests" value={stats.pending} description="Bookings needing attention" accent="orange" />
            <VendorDashboardCard title="Completed Orders" value={stats.completed} description="Events delivered successfully" accent="emerald" />
            <VendorDashboardCard title="Revenue" value={`₹${stats.revenue}`} description="Collected from confirmed jobs" accent="blue" />
          </div>
        </div>

        <div id="verification" className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Verification status</h2>
              <p className="mt-2 text-sm text-slate-500">Keep your KYC profile current so your listing can move forward smoothly.</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Current status</p>
                <p className="mt-1 text-sm text-slate-600">{verificationStatus}</p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">{completionPercent}% complete</div>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-slate-200">
              <div className="h-2.5 rounded-full bg-[#0F172A]" style={{ width: `${completionPercent}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/vendor/menus" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Upload menu</Link>
              <Link href="/vendor/register" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Update documents</Link>
            </div>
          </div>
        </div>

        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recent bookings</h2>
              <p className="mt-2 text-sm text-slate-500">Track the latest customer requests and important updates.</p>
            </div>
            <Link href="/vendor/bookings" className="text-sm font-semibold text-[#0F172A]">View all</Link>
          </div>

          <div className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">No bookings have been received for your kitchen yet.</div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{booking.customerName || "Customer"}</p>
                    <p className="mt-1 text-sm text-slate-600">{booking.eventDate || "TBD"}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">{booking.status || "Pending"}</span>
                    <span className="text-sm font-semibold text-slate-700">₹{booking.amount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

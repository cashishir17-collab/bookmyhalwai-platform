"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ReviewTile from "@/components/vendor/ReviewTile";

interface ReviewRecord {
  customerName?: string;
  rating?: number;
  review?: string;
  eventDate?: string;
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!db) return;
      const snapshot = await getDocs(collection(db, "reviews"));
      setReviews(snapshot.docs.map((docSnapshot) => docSnapshot.data() as ReviewRecord));
    };

    fetchReviews();
  }, []);

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Reviews</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Customer feedback</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            See how guests rate your service and keep improving your experience.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Average Rating</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">⭐ {averageRating}/5</p>
        </div>

        <div className="grid gap-6">
          {reviews.length === 0 ? (
            <div className="section-shell rounded-[2rem] p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review, index) => <ReviewTile key={`${review.customerName}-${index}`} review={review} />)
          )}
        </div>
      </div>
    </div>
  );
}

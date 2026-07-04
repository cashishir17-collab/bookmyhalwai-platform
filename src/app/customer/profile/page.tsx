"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import ProfileForm from "@/components/customer/ProfileForm";

interface ProfileRecord {
  displayName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  preferredCity?: string | null;
  preferredCuisine?: string | null;
}

export default function CustomerProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileRecord | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!db || !user?.uid) return;
      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (snapshot.exists()) {
        setProfile(snapshot.data() as ProfileRecord);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Customer Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Update your details</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Keep your profile details current so vendors can reach you easily for upcoming events.
          </p>
        </div>

        {user ? (
          <ProfileForm
            user={user}
            initialData={profile || undefined}
          />
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { seedVendorData } from "@/lib/seedVendorData";

interface SeedDemoVendorsButtonProps {
  onCompleted?: () => void;
}

export default function SeedDemoVendorsButton({ onCompleted }: SeedDemoVendorsButtonProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setIsSeeding(true);
    setMessage("");
    try {
      const result = await seedVendorData();
      setMessage(result.skipped ? "Demo vendors already exist in Firestore." : `Seeded ${result.created} demo vendors.`);
      onCompleted?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to seed demo vendors.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button type="button" onClick={handleSeed} disabled={isSeeding} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {isSeeding ? "Seeding demo vendors..." : "Seed Demo Vendors"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { seedDemoDataIfNeeded } from "@/lib/demoData";

export default function DemoSeedLoader() {
  useEffect(() => {
    seedDemoDataIfNeeded().catch(() => undefined);
  }, []);

  return null;
}

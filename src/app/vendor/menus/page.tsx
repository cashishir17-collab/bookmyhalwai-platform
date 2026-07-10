"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MenuEditor from "@/components/vendor/MenuEditor";

interface MenuRecord {
  id?: string;
  packageName: string;
  welcomeDrink: string;
  starters: string;
  mainCourse: string;
  dessert: string;
  liveCounter: string;
  foodType: string;
  pricePerPlate: string;
}

export default function VendorMenusPage() {
  const [menus, setMenus] = useState<MenuRecord[]>([]);

  const fetchMenus = useCallback(async () => {
    if (!db) return;
    const snapshot = await getDocs(collection(db, "menus"));
    setMenus(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...(docSnapshot.data() as MenuRecord) })));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadMenus = async () => {
      if (!isMounted) {
        return;
      }
      await fetchMenus();
    };

    void loadMenus();
    return () => {
      isMounted = false;
    };
  }, [fetchMenus]);

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="section-shell rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Menus</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create and manage menu packages</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Design Silver, Gold, and Royal packages so customers can see your offerings clearly.
          </p>
        </div>

        <MenuEditor initialMenus={menus} onUpdated={fetchMenus} />
      </div>
    </div>
  );
}

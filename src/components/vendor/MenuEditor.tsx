"use client";

import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuItem {
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

interface MenuEditorProps {
  initialMenus?: MenuItem[];
  onUpdated?: () => void;
}

const emptyMenu = {
  packageName: "Silver",
  welcomeDrink: "",
  starters: "",
  mainCourse: "",
  dessert: "",
  liveCounter: "",
  foodType: "Veg",
  pricePerPlate: "",
};

export default function MenuEditor({ initialMenus = [], onUpdated }: MenuEditorProps) {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [draft, setDraft] = useState<MenuItem>(emptyMenu);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!db) return;

    try {
      if (draft.id) {
        await updateDoc(doc(db, "menus", draft.id), {
          ...draft,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "menus"), {
          ...draft,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      setDraft(emptyMenu);
      setMessage("Menu saved successfully.");
      onUpdated?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save menu.");
    }
  };

  const handleDelete = async (menuId?: string) => {
    if (!db || !menuId) return;
    await deleteDoc(doc(db, "menus", menuId));
    setMessage("Menu removed.");
    onUpdated?.();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Create / Edit Menu</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Package
            <select
              value={draft.packageName}
              onChange={(event) => setDraft((current) => ({ ...current, packageName: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <option>Silver</option>
              <option>Gold</option>
              <option>Royal</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Price Per Plate
            <input
              value={draft.pricePerPlate}
              onChange={(event) => setDraft((current) => ({ ...current, pricePerPlate: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Welcome Drink
            <input
              value={draft.welcomeDrink}
              onChange={(event) => setDraft((current) => ({ ...current, welcomeDrink: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Starters
            <input
              value={draft.starters}
              onChange={(event) => setDraft((current) => ({ ...current, starters: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Main Course
            <input
              value={draft.mainCourse}
              onChange={(event) => setDraft((current) => ({ ...current, mainCourse: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Dessert
            <input
              value={draft.dessert}
              onChange={(event) => setDraft((current) => ({ ...current, dessert: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Live Counter
            <input
              value={draft.liveCounter}
              onChange={(event) => setDraft((current) => ({ ...current, liveCounter: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Food Type
            <select
              value={draft.foodType}
              onChange={(event) => setDraft((current) => ({ ...current, foodType: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Veg & Non-Veg</option>
            </select>
          </label>
        </div>

        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

        <button type="button" onClick={handleSave} className="mt-6 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
          Save Menu
        </button>
      </div>

      <div className="grid gap-4">
        {menus.map((menu) => (
          <div key={menu.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{menu.packageName}</h4>
                <p className="mt-1 text-sm text-slate-500">{menu.foodType} • ₹{menu.pricePerPlate}/plate</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDraft(menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(menu.id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <p><span className="font-semibold text-slate-800">Welcome Drink:</span> {menu.welcomeDrink}</p>
              <p><span className="font-semibold text-slate-800">Starters:</span> {menu.starters}</p>
              <p><span className="font-semibold text-slate-800">Main Course:</span> {menu.mainCourse}</p>
              <p><span className="font-semibold text-slate-800">Dessert:</span> {menu.dessert}</p>
              <p><span className="font-semibold text-slate-800">Live Counter:</span> {menu.liveCounter}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

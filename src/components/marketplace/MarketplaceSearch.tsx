"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { INDIA_STATES } from "@/data/indiaLocations";
import { MARKETPLACE_SERVICES } from "@/data/marketplace";

export function MarketplaceSearch() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const selectedState = useMemo(
    () => INDIA_STATES.find((item) => item.code === stateCode) ?? null,
    [stateCode],
  );

  const search = () => {
    const params = new URLSearchParams();
    if (service) params.set("category", service);
    if (selectedState) params.set("state", selectedState.name);
    if (city) params.set("city", city);
    if (date) params.set("date", date);
    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <div className="rounded-[1.75rem] border border-white/20 bg-[#07162B]/88 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="grid gap-2 lg:grid-cols-[1.15fr_0.85fr_0.95fr_0.8fr_auto]">
        <label className="rounded-2xl bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#566A80]">
          Service
          <select value={service} onChange={(event) => setService(event.target.value)} className="mt-1 block w-full bg-transparent text-sm font-semibold normal-case tracking-normal text-[#0B1830] outline-none">
            <option value="">All event services</option>
            {MARKETPLACE_SERVICES.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
          </select>
        </label>
        <label className="rounded-2xl bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#566A80]">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> State</span>
          <select value={stateCode} onChange={(event) => { setStateCode(event.target.value); setCity(""); }} className="mt-1 block w-full bg-transparent text-sm font-semibold normal-case tracking-normal text-[#0B1830] outline-none">
            <option value="">All India</option>
            {INDIA_STATES.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
          </select>
        </label>
        <label className="rounded-2xl bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#566A80]">
          City / Town
          <select value={city} disabled={!selectedState} onChange={(event) => setCity(event.target.value)} className="mt-1 block w-full bg-transparent text-sm font-semibold normal-case tracking-normal text-[#0B1830] outline-none disabled:text-slate-400">
            <option value="">{selectedState ? "All cities & towns" : "Select state first"}</option>
            {selectedState?.cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="rounded-2xl bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#566A80]">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Event date</span>
          <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="mt-1 block w-full bg-transparent text-sm font-semibold normal-case tracking-normal text-[#0B1830] outline-none" />
        </label>
        <button type="button" onClick={search} className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#C7A667] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#0B1830] transition hover:bg-[#E0C488]">
          <Search className="h-5 w-5" /> Search
        </button>
      </div>
    </div>
  );
}

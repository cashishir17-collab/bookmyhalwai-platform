"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import CatererCard, { type Caterer } from "@/components/CatererCard";
import { caterers } from "@/data/caterers";

const foodTypeOptions = ["All", "Veg", "Non-Veg"] as const;
const budgetOptions = ["Any Budget", "Under ₹500", "₹500–₹700", "Above ₹700"] as const;

function matchesBudget(price: number, budgetFilter: (typeof budgetOptions)[number]) {
  if (budgetFilter === "Under ₹500") return price < 500;
  if (budgetFilter === "₹500–₹700") return price >= 500 && price <= 700;
  if (budgetFilter === "Above ₹700") return price > 700;
  return true;
}

export default function CatererMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFoodType, setSelectedFoodType] = useState<(typeof foodTypeOptions)[number]>("All");
  const [selectedBudget, setSelectedBudget] = useState<(typeof budgetOptions)[number]>("Any Budget");

  const cityOptions = useMemo(
    () => ["All Cities", ...Array.from(new Set(caterers.map((item) => item.city))).sort((a, b) => a.localeCompare(b))],
    [],
  );

  const filteredCaterers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return (caterers as Caterer[]).filter((caterer) => {
      const searchableFields = [
        caterer.name,
        caterer.city,
        caterer.location,
        caterer.foodType || "",
        caterer.cuisines.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableFields.includes(query);
      const matchesCity = selectedCity === "All Cities" || caterer.city === selectedCity;
      const matchesFoodType = selectedFoodType === "All" || caterer.foodType === selectedFoodType;
      const matchesPrice = matchesBudget(caterer.price, selectedBudget);

      return matchesSearch && matchesCity && matchesFoodType && matchesPrice;
    });
  }, [searchTerm, selectedCity, selectedFoodType, selectedBudget]);

  return (
    <main className="page-shell min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="section-shell rounded-[2rem] p-7 sm:p-10">
          <p className="type-label text-[#0F6456]">Customer Marketplace</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B1830] sm:text-5xl">
            Find the right caterer for your celebration
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#3A4D64] sm:text-base">
            Search verified halwais and catering partners by city, cuisine style, food preference, and budget range for weddings,
            birthdays, festive functions, and corporate events.
          </p>

          <div className="mt-7 grid gap-3 rounded-3xl border border-[#DCCDB2] bg-[#FFF8EA] p-4 md:grid-cols-[1.3fr_0.7fr_0.6fr_0.8fr]">
            <label className="relative block text-sm font-semibold text-[#1C3350]">
              Search
              <Search className="pointer-events-none absolute left-3 top-[2.35rem] h-4 w-4 text-[#4B5F76]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="text"
                placeholder="Caterer, city, location, cuisine or event type"
                className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white pl-9 pr-3 text-sm text-slate-800 shadow-sm"
              />
            </label>

            <label className="block text-sm font-semibold text-[#1C3350]">
              City
              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm text-slate-800 shadow-sm"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#1C3350]">
              Food Type
              <select
                value={selectedFoodType}
                onChange={(event) => setSelectedFoodType(event.target.value as (typeof foodTypeOptions)[number])}
                className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm text-slate-800 shadow-sm"
              >
                {foodTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#1C3350]">
              Budget
              <select
                value={selectedBudget}
                onChange={(event) => setSelectedBudget(event.target.value as (typeof budgetOptions)[number])}
                className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm text-slate-800 shadow-sm"
              >
                {budgetOptions.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#0B1830] px-4 py-3 text-sm text-[#F7F1E4]">
            <p className="font-semibold">{filteredCaterers.length} verified caterer{filteredCaterers.length === 1 ? "" : "s"} found</p>
            <Link href="/customer/dashboard" className="rounded-full border border-[#C7A667] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition hover:bg-[#122748]">
              Go to Dashboard
            </Link>
          </div>
        </section>

        {filteredCaterers.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCaterers.map((caterer) => (
              <CatererCard key={caterer.id} caterer={caterer} />
            ))}
          </section>
        ) : (
          <section className="section-shell rounded-[2rem] p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#0B1830]">No caterers match these filters</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#51657D]">
              Try broadening your city, budget, or food type selection. You can also search by a cuisine or event keyword like Wedding,
              Corporate, Sweets, or Live Counters.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

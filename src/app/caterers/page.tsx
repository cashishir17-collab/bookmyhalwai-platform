"use client";

import { useMemo, useState } from "react";
import { caterers } from "@/data/caterers";
import CatererCard from "@/components/CatererCard";

const cuisineOptions = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Live Counter",
  "Vegetarian",
  "Wedding",
];

const priceRanges = [
  { label: "₹200-₹400", min: 200, max: 400 },
  { label: "₹401-₹600", min: 401, max: 600 },
  { label: "₹601-₹800", min: 601, max: 800 },
  { label: "₹801+", min: 801, max: Infinity },
];

const ratingOptions = ["4.5+", "4.0+", "3.5+"];

export default function CaterersPage() {
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [foodType, setFoodType] = useState("");
  const [showLiveCounter, setShowLiveCounter] = useState(false);
  const [showOutdoor, setShowOutdoor] = useState(false);

  const parsedBudget = useMemo(() => {
    const numbers = budget.replace(/,/g, "").match(/\d+/g)?.map(Number) ?? [];
    if (numbers.length === 0) return null;
    if (numbers.length === 1) {
      return { min: 0, max: numbers[0] };
    }
    return { min: Math.min(...numbers), max: Math.max(...numbers) };
  }, [budget]);

  const filteredCaterers = useMemo(() => {
    return caterers.filter((item) => {
      if (city && !`${item.city} ${item.location}`.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }

      if (
        eventType &&
        !item.cuisines.some((cuisine) => cuisine.toLowerCase().includes(eventType.toLowerCase()))
      ) {
        return false;
      }

      if (parsedBudget) {
        if (item.price < parsedBudget.min || item.price > parsedBudget.max) {
          return false;
        }
      }

      if (selectedCuisines.length > 0) {
        if (!selectedCuisines.some((cuisine) => item.cuisines.includes(cuisine))) {
          return false;
        }
      }

      if (selectedPriceRange) {
        const range = priceRanges.find((entry) => entry.label === selectedPriceRange);
        if (range && (item.price < range.min || item.price > range.max)) {
          return false;
        }
      }

      if (selectedRating) {
        const requiredRating = Number(selectedRating.replace("+", ""));
        if (item.rating < requiredRating) {
          return false;
        }
      }

      if (foodType) {
        if (item.foodType?.toLowerCase() !== foodType.toLowerCase()) {
          return false;
        }
      }

      if (showLiveCounter && !item.liveCounter) {
        return false;
      }

      if (showOutdoor && !item.outdoorCatering) {
        return false;
      }

      return true;
    });
  }, [city, eventType, parsedBudget, selectedCuisines, selectedPriceRange, selectedRating, foodType, showLiveCounter, showOutdoor]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((current) =>
      current.includes(cuisine) ? current.filter((item) => item !== cuisine) : [...current, cuisine],
    );
  };

  const clearFilters = () => {
    setCity("");
    setEventType("");
    setGuestCount("");
    setBudget("");
    setSelectedCuisines([]);
    setSelectedPriceRange("");
    setSelectedRating("");
    setFoodType("");
    setShowLiveCounter(false);
    setShowOutdoor(false);
  };

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2.5rem] bg-white p-8 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
                Find Verified Caterers Near You
              </p>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                Find Verified Caterers Near You
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Compare verified caterers across price, rating, cuisine and event
                experience to plan your next event with confidence.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-sm font-medium text-slate-700">
                  City
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    type="text"
                    placeholder="Enter city"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Event Type
                  <input
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                    type="text"
                    placeholder="Wedding, Birthday..."
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Guest Count
                  <input
                    value={guestCount}
                    onChange={(event) => setGuestCount(event.target.value)}
                    type="number"
                    min="1"
                    placeholder="200"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Budget
                  <input
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    type="text"
                    placeholder="₹300-₹700"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-1 inline-flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 sm:col-span-2 lg:col-span-2"
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  className="mt-1 inline-flex h-full items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:col-span-2 lg:col-span-1"
                >
                  Search Caterers
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-[2rem] bg-white p-6 shadow-lg">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
              <p className="mt-2 text-sm text-slate-500">
                Narrow down caterers by preference.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Cuisine</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cuisineOptions.map((item) => {
                    const active = selectedCuisines.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleCuisine(item)}
                        className={`rounded-full px-4 py-2 text-sm transition ${active ?
                          "border border-orange-300 bg-orange-100 text-orange-700" :
                          "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Price Range</p>
                  <span className="text-sm text-slate-500">{selectedPriceRange || "Any"}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => setSelectedPriceRange(range.label)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${selectedPriceRange === range.label ?
                        "border border-orange-300 bg-orange-100 text-orange-700" :
                        "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Rating</p>
                  <span className="text-sm text-slate-500">{selectedRating || "Any"}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {ratingOptions.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(selectedRating === rating ? "" : rating)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${selectedRating === rating ?
                        "border border-orange-300 bg-orange-100 text-orange-700" :
                        "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Amenities</p>
                <div className="mt-3 space-y-3">
                  <button
                    type="button"
                    onClick={() => setFoodType(foodType === "Veg" ? "" : "Veg")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${foodType === "Veg" ?
                      "border border-orange-300 bg-orange-100 text-orange-700" :
                      "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                  >
                    Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodType(foodType === "Non-Veg" ? "" : "Non-Veg")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${foodType === "Non-Veg" ?
                      "border border-orange-300 bg-orange-100 text-orange-700" :
                      "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                  >
                    Non-Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLiveCounter((current) => !current)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${showLiveCounter ?
                      "border border-orange-300 bg-orange-100 text-orange-700" :
                      "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                  >
                    Live Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOutdoor((current) => !current)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${showOutdoor ?
                      "border border-orange-300 bg-orange-100 text-orange-700" :
                      "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}
                  >
                    Outdoor Catering
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-600">Available Caterers</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">Top Verified Choices</h2>
                </div>
                <p className="text-sm text-slate-500">Showing {filteredCaterers.length} caterers near you</p>
              </div>
            </div>

            {filteredCaterers.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-12 text-center shadow-lg">
                <p className="text-lg font-semibold text-slate-900">No caterers found</p>
                <p className="mt-3 text-sm text-slate-500">
                  Try adjusting your city, budget, or filters to find the right match.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCaterers.map((caterer) => (
                  <CatererCard key={caterer.id} caterer={caterer} />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

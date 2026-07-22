"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BadgeCheck, MapPin, Search, Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { MARKETPLACE_SERVICES, getMarketplaceService, serviceForProviderCategory } from "@/data/marketplace";
import { isPublicVendor, mapVendorDocumentToMarketplaceVendor } from "@/lib/vendorRecords";

interface VendorListing {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  state: string;
  city: string;
  description: string;
  image: string;
  rating: number;
  completedEvents: number;
  startingPrice: number;
}

interface VendorMarketplaceProps {
  initialCategory?: string;
  initialState?: string;
  initialCity?: string;
}

function toListing(id: string, row: Record<string, unknown>): VendorListing {
  const vendor = mapVendorDocumentToMarketplaceVendor(id, row);
  const providerCategory = vendor.primaryCategory;
  const service = serviceForProviderCategory(providerCategory);
  return {
    id,
    name: vendor.businessName,
    category: providerCategory,
    categoryLabel: service?.label || String(row.providerCategoryLabel || row.category || "Event Service"),
    state: vendor.state,
    city: vendor.city,
    description: vendor.description,
    image: vendor.image,
    rating: vendor.rating,
    completedEvents: vendor.completedEvents,
    startingPrice: vendor.startingPrice,
  };
}

export function VendorMarketplace({ initialCategory = "", initialState = "", initialCity = "" }: VendorMarketplaceProps) {
  const [vendors, setVendors] = useState<VendorListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [cityFilter, setCityFilter] = useState(initialCity);

  useEffect(() => {
    let active = true;
    async function loadVendors() {
      if (!db) {
        setLoadError("Marketplace data is temporarily unavailable.");
        setLoading(false);
        return;
      }
      try {
        const [publishedSnapshot, legacySnapshot] = await Promise.all([
          getDocs(query(
            collection(db, "vendors"),
            where("publicationStatus", "==", "Published"),
            where("verificationStatus", "in", ["Approved", "Verified"]),
          )),
          getDocs(query(collection(db, "vendors"), where("verificationStatus", "==", "Published"))),
        ]);
        if (active) {
          const uniqueDocuments = new Map([...publishedSnapshot.docs, ...legacySnapshot.docs].map((item) => [item.id, item]));
          setVendors(Array.from(uniqueDocuments.values())
            .filter((item) => isPublicVendor(mapVendorDocumentToMarketplaceVendor(item.id, item.data())))
            .map((item) => toListing(item.id, item.data())));
        }
      } catch (error) {
        console.error("Unable to load approved vendors", error);
        if (active) setLoadError("Approved vendors could not be loaded. Please try again shortly.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadVendors();
    return () => { active = false; };
  }, []);

  const selectedService = getMarketplaceService(categorySlug);
  const states = useMemo(() => Array.from(new Set(vendors.map((vendor) => vendor.state).filter(Boolean))).sort(), [vendors]);
  const cities = useMemo(() => Array.from(new Set(vendors.filter((vendor) => !stateFilter || vendor.state === stateFilter).map((vendor) => vendor.city).filter(Boolean))).sort(), [vendors, stateFilter]);
  const filteredVendors = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return vendors
      .filter((vendor) => !selectedService || vendor.category === selectedService.providerCategory)
      .filter((vendor) => !stateFilter || vendor.state === stateFilter)
      .filter((vendor) => !cityFilter || vendor.city === cityFilter)
      .filter((vendor) => !search || [vendor.name, vendor.categoryLabel, vendor.city, vendor.state, vendor.description].join(" ").toLowerCase().includes(search))
      .sort((a, b) => (b.rating * 10 + b.completedEvents) - (a.rating * 10 + a.completedEvents));
  }, [cityFilter, searchTerm, selectedService, stateFilter, vendors]);

  return (
    <main className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="section-shell rounded-[2rem] p-7 sm:p-10">
          <p className="type-label text-[#0F6456]">India&apos;s Event Marketplace</p>
          <h1 className="type-h1 mt-3 text-[#0B1830]">{selectedService ? `Find verified ${selectedService.label}` : "Find every service your event needs"}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#3A4D64] sm:text-base">Compare approved event professionals by service and location. Only profiles cleared through the BookMyHalwai verification process appear here.</p>

          <div className="mt-7 grid gap-3 rounded-3xl border border-[#DCCDB2] bg-[#FFF8EA] p-4 md:grid-cols-[1.25fr_0.9fr_0.8fr_0.8fr]">
            <label className="relative text-sm font-semibold text-[#1C3350]">Search
              <Search className="pointer-events-none absolute left-3 top-[2.35rem] h-4 w-4 text-[#4B5F76]" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Vendor, service or location" className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white pl-9 pr-3 text-sm" />
            </label>
            <label className="text-sm font-semibold text-[#1C3350]">Service
              <select value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm">
                <option value="">All services</option>
                {MARKETPLACE_SERVICES.map((service) => <option key={service.slug} value={service.slug}>{service.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-[#1C3350]">State
              <select value={stateFilter} onChange={(event) => { setStateFilter(event.target.value); setCityFilter(""); }} className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm">
                <option value="">All states</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-[#1C3350]">City / Town
              <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-[#DCCDB2] bg-white px-3 text-sm">
                <option value="">All locations</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#0B1830] px-5 py-3 text-sm text-white">
            <p className="font-semibold">{filteredVendors.length} approved partner{filteredVendors.length === 1 ? "" : "s"} found</p>
            <Link href="/vendor/register" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E7D4AC] hover:text-white">List your business</Link>
          </div>
        </section>

        {loading ? (
          <section className="section-shell rounded-[2rem] p-12 text-center text-[#51657D]">Loading approved event partners…</section>
        ) : loadError ? (
          <section className="section-shell rounded-[2rem] p-12 text-center text-[#AD3E47]">{loadError}</section>
        ) : filteredVendors.length ? (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <article key={vendor.id} className="premium-card overflow-hidden rounded-3xl">
                <div className="relative h-56 overflow-hidden">
                  <Image src={vendor.image} alt={`${vendor.name} portfolio`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" unoptimized={vendor.image.startsWith("http")} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07162B]/90 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#F7F1E4] px-3 py-1 text-xs font-bold text-[#0B1830]"><BadgeCheck className="h-4 w-4 text-[#0F6456]" /> Verified</span>
                  <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">{vendor.categoryLabel}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div><h2 className="text-xl font-semibold text-[#0B1830]">{vendor.name}</h2><p className="mt-1 flex items-center gap-1 text-sm text-[#5A6E84]"><MapPin className="h-4 w-4" /> {vendor.city}{vendor.state ? `, ${vendor.state}` : ""}</p></div>
                    {vendor.rating > 0 ? <span className="flex items-center gap-1 rounded-full bg-[#FFF4D8] px-3 py-1 text-sm font-semibold text-[#7B571A]"><Star className="h-4 w-4 fill-current" /> {vendor.rating.toFixed(1)}</span> : null}
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#51657D]">{vendor.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#3A4D64]">
                    {vendor.completedEvents > 0 ? <span className="rounded-full bg-[#EEF5F3] px-3 py-1">{vendor.completedEvents} events</span> : null}
                    {vendor.startingPrice > 0 ? <span className="rounded-full bg-[#F5EFE2] px-3 py-1">Starts at ₹{vendor.startingPrice.toLocaleString("en-IN")}</span> : null}
                  </div>
                  <Link href={`/enquiries/new?vendorId=${encodeURIComponent(vendor.id)}&vendorName=${encodeURIComponent(vendor.name)}`} className="btn btn-primary btn-lg mt-6 w-full">Request quotation</Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="section-shell rounded-[2rem] p-12 text-center">
            <h2 className="type-h3 text-[#0B1830]">No approved partners match these filters yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#51657D]">New profiles will appear automatically after admin verification. Try another service or location.</p>
          </section>
        )}
      </div>
    </main>
  );
}

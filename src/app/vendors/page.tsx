import type { Metadata } from "next";
import { VendorMarketplace } from "@/components/marketplace/VendorMarketplace";

export const metadata: Metadata = {
  title: "Find Verified Event Vendors Across India | BookMyHalwai",
  description: "Discover approved caterers, venues, decorators, DJs, photography and videography teams, makeup artists and more across India.",
};

interface VendorsPageProps {
  searchParams: Promise<{ category?: string; state?: string; city?: string }>;
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const filters = await searchParams;
  return <VendorMarketplace initialCategory={filters.category || ""} initialState={filters.state || ""} initialCity={filters.city || ""} />;
}

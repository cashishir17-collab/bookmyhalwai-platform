import type { Metadata } from "next";
import CatererMarketplace from "@/components/customer/CatererMarketplace";

export const metadata: Metadata = {
  title: "Find Verified Caterers | BookMyHalwai",
  description: "Discover and compare verified halwais and caterers for weddings, birthdays, corporate events and celebrations.",
};

export default function CaterersPage() {
  return <CatererMarketplace />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorMarketplace } from "@/components/marketplace/VendorMarketplace";
import { getMarketplaceService, MARKETPLACE_SERVICES } from "@/data/marketplace";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return MARKETPLACE_SERVICES.map((service) => ({ category: service.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const service = getMarketplaceService(category);
  if (!service) return {};
  return {
    title: `Find Verified ${service.label} | BookMyHalwai`,
    description: `${service.description} Search approved BookMyHalwai partners across India.`,
  };
}

export default async function VendorCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!getMarketplaceService(category)) notFound();
  return <VendorMarketplace initialCategory={category} />;
}

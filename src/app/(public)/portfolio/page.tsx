import type { Metadata } from "next";
import { getPublishedPortfolioItems } from "@/lib/queries/portfolio";
import { PortfolioPageClient } from "./portfolio-client";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse my portfolio of professional makeup artistry work.",
};

export const revalidate = 3600;

export default async function PortfolioPage() {
  const items = await getPublishedPortfolioItems();
  return <PortfolioPageClient items={items} />;
}

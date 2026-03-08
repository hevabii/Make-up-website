import { PortfolioItem } from "@/types/database";
import { mockPortfolioItems } from "@/lib/mock-data";

export async function getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
  return mockPortfolioItems
    .filter((item) => item.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
  return mockPortfolioItems
    .filter((item) => item.is_published && item.is_featured)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 6);
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  return mockPortfolioItems.find((item) => item.slug === slug && item.is_published) || null;
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  return mockPortfolioItems.sort((a, b) => a.display_order - b.display_order);
}

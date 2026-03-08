import { PortfolioItem } from "@/types/database";
import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order");
    if (error) {
      console.error("[portfolio] getPublishedPortfolioItems failed:", error.message);
      return [];
    }
    return (data ?? []) as PortfolioItem[];
  } catch (error) {
    console.error("[portfolio] getPublishedPortfolioItems exception:", error);
    return [];
  }
}

export async function getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order")
      .limit(6);
    if (error) {
      console.error("[portfolio] getFeaturedPortfolioItems failed:", error.message);
      return [];
    }
    return (data ?? []) as PortfolioItem[];
  } catch (error) {
    console.error("[portfolio] getFeaturedPortfolioItems exception:", error);
    return [];
  }
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (error) {
      console.error("[portfolio] getPortfolioItemBySlug failed:", error.message);
      return null;
    }
    return (data ?? null) as PortfolioItem | null;
  } catch (error) {
    console.error("[portfolio] getPortfolioItemBySlug exception:", error);
    return null;
  }
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order");
    if (error) {
      console.error("[portfolio] getAllPortfolioItems failed:", error.message);
      return [];
    }
    return (data ?? []) as PortfolioItem[];
  } catch (error) {
    console.error("[portfolio] getAllPortfolioItems exception:", error);
    return [];
  }
}

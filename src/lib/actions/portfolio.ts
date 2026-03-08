"use server";

import { revalidatePath } from "next/cache";

export async function createPortfolioItem(data: {
  title: string;
  description?: string;
  category: string;
  cover_image_url?: string;
  images?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
}) {
  console.log("[MOCK] createPortfolioItem:", data);
  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}

export async function updatePortfolioItem(
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    cover_image_url?: string;
    images?: string[];
    is_featured?: boolean;
    is_published?: boolean;
    display_order?: number;
  }
) {
  console.log("[MOCK] updatePortfolioItem:", id, data);
  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}

export async function deletePortfolioItem(id: string) {
  console.log("[MOCK] deletePortfolioItem:", id);
  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}

export async function togglePortfolioPublish(id: string, isPublished: boolean) {
  console.log("[MOCK] togglePortfolioPublish:", id, !isPublished);
  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}

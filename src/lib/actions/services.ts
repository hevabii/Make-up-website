"use server";

import { revalidatePath } from "next/cache";

export async function createService(data: {
  name: string;
  description?: string;
  price?: number;
  price_note?: string;
  duration?: string;
  category: string;
  display_order?: number;
  is_active?: boolean;
}) {
  console.log("[MOCK] createService:", data);
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function updateService(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number | null;
    price_note?: string | null;
    duration?: string | null;
    category?: string;
    display_order?: number;
    is_active?: boolean;
  }
) {
  console.log("[MOCK] updateService:", id, data);
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  console.log("[MOCK] deleteService:", id);
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

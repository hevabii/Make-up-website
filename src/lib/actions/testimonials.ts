"use server";

import { revalidatePath } from "next/cache";

export async function createTestimonial(data: {
  client_name: string;
  content: string;
  service_type?: string;
  rating?: number;
  is_featured?: boolean;
  is_published?: boolean;
}) {
  console.log("[MOCK] createTestimonial:", data);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  data: {
    client_name?: string;
    content?: string;
    service_type?: string | null;
    rating?: number | null;
    is_featured?: boolean;
    is_published?: boolean;
  }
) {
  console.log("[MOCK] updateTestimonial:", id, data);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  console.log("[MOCK] deleteTestimonial:", id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

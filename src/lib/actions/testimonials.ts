"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createTestimonial(data: {
  client_name: string;
  content: string;
  image_url?: string;
  service_type?: string;
  rating?: number;
  is_featured?: boolean;
  is_published?: boolean;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").insert(data);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  data: {
    client_name?: string;
    content?: string;
    image_url?: string | null;
    service_type?: string | null;
    rating?: number | null;
    is_featured?: boolean;
    is_published?: boolean;
  }
) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").update(data).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

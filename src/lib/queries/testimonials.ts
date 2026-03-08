import { Testimonial } from "@/types/database";
import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true);
    if (error) {
      console.error("[testimonials] getFeaturedTestimonials failed:", error.message);
      return [];
    }
    return (data ?? []) as Testimonial[];
  } catch (error) {
    console.error("[testimonials] getFeaturedTestimonials exception:", error);
    return [];
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true);
    if (error) {
      console.error("[testimonials] getPublishedTestimonials failed:", error.message);
      return [];
    }
    return (data ?? []) as Testimonial[];
  } catch (error) {
    console.error("[testimonials] getPublishedTestimonials exception:", error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[testimonials] getAllTestimonials failed:", error.message);
      return [];
    }
    return (data ?? []) as Testimonial[];
  } catch (error) {
    console.error("[testimonials] getAllTestimonials exception:", error);
    return [];
  }
}

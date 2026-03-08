import { Service } from "@/types/database";
import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getActiveServices(): Promise<Service[]> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (error) {
      console.error("[services] getActiveServices failed:", error.message);
      return [];
    }
    return (data ?? []) as Service[];
  } catch (error) {
    console.error("[services] getActiveServices exception:", error);
    return [];
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");
    if (error) {
      console.error("[services] getAllServices failed:", error.message);
      return [];
    }
    return (data ?? []) as Service[];
  } catch (error) {
    console.error("[services] getAllServices exception:", error);
    return [];
  }
}

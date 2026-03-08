import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BlockedSlot } from "@/types/database";

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("blocked_slots")
      .select("id, slot_date, slot_hour, reason, created_at")
      .order("slot_date", { ascending: true })
      .order("slot_hour", { ascending: true });

    if (error) {
      console.error("[availability] getBlockedSlots failed:", error.message);
      return [];
    }

    return (data ?? []) as BlockedSlot[];
  } catch (error) {
    console.error("[availability] getBlockedSlots exception:", error);
    return [];
  }
}

export async function getAllBlockedSlots(): Promise<BlockedSlot[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blocked_slots")
      .select("id, slot_date, slot_hour, reason, created_at")
      .order("slot_date", { ascending: true })
      .order("slot_hour", { ascending: true });

    if (error) {
      // If migration is not yet applied, keep admin page usable instead of crashing.
      if (error.code === "42P01") {
        console.warn("[availability] blocked_slots table missing. Run migration 003_add_availability_slots.sql");
        return [];
      }
      throw new Error(error.message || "Failed to load availability slots");
    }

    return (data ?? []) as BlockedSlot[];
  } catch (error) {
    console.error("[availability] getAllBlockedSlots exception:", error);
    return [];
  }
}

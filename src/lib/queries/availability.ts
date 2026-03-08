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
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("id, slot_date, slot_hour, reason, created_at")
    .order("slot_date", { ascending: true })
    .order("slot_hour", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BlockedSlot[];
}

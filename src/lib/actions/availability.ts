"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createBlockedSlot(data: {
  slot_date: string;
  slot_hour: number;
  reason?: string;
}) {
  if (!data.slot_date) {
    throw new Error("Date is required");
  }
  if (Number.isNaN(data.slot_hour) || data.slot_hour < 0 || data.slot_hour > 23) {
    throw new Error("Hour must be between 0 and 23");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("blocked_slots").insert({
    slot_date: data.slot_date,
    slot_hour: data.slot_hour,
    reason: data.reason?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("This date and hour is already blocked");
    }
    throw error;
  }

  revalidatePath("/contact");
  revalidatePath("/admin/availability");
}

export async function deleteBlockedSlot(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/contact");
  revalidatePath("/admin/availability");
}

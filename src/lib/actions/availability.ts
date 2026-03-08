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
    if (error.code === "42P01") {
      throw new Error("Availability table is missing. Please run migration 003_add_availability_slots.sql in Supabase.");
    }
    throw new Error(error.message || "Failed to block slot");
  }

  revalidatePath("/contact");
  revalidatePath("/admin/availability");
}

export async function createBlockedSlotRange(data: {
  slot_date: string;
  start_hour: number;
  end_hour: number;
  reason?: string;
}) {
  if (!data.slot_date) {
    throw new Error("Date is required");
  }
  if (
    Number.isNaN(data.start_hour) ||
    Number.isNaN(data.end_hour) ||
    data.start_hour < 0 ||
    data.start_hour > 23 ||
    data.end_hour < 0 ||
    data.end_hour > 23
  ) {
    throw new Error("Hours must be between 0 and 23");
  }

  const start = Math.min(data.start_hour, data.end_hour);
  const end = Math.max(data.start_hour, data.end_hour);
  const rows = Array.from({ length: end - start + 1 }, (_, i) => ({
    slot_date: data.slot_date,
    slot_hour: start + i,
    reason: data.reason?.trim() || null,
  }));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("blocked_slots")
    .upsert(rows, { onConflict: "slot_date,slot_hour", ignoreDuplicates: true });

  if (error) {
    if (error.code === "42P01") {
      throw new Error("Availability table is missing. Please run migration 003_add_availability_slots.sql in Supabase.");
    }
    throw new Error(error.message || "Failed to block selected time range");
  }

  revalidatePath("/contact");
  revalidatePath("/admin/availability");
}

export async function deleteBlockedSlot(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  if (error) {
    if (error.code === "42P01") {
      throw new Error("Availability table is missing. Please run migration 003_add_availability_slots.sql in Supabase.");
    }
    throw new Error(error.message || "Failed to remove blocked slot");
  }

  revalidatePath("/contact");
  revalidatePath("/admin/availability");
}

"use server";

import { revalidatePath } from "next/cache";

export async function updateSettings(settings: Record<string, string>) {
  console.log("[MOCK] updateSettings:", settings);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/admin/settings");
}

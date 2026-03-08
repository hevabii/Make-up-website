import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) {
      console.error("[settings] getAllSettings failed:", error.message);
      return {};
    }
    return Object.fromEntries((data ?? []).map((s) => [s.key, s.value ?? ""]));
  } catch (error) {
    console.error("[settings] getAllSettings exception:", error);
    return {};
  }
}

export async function getSetting(key: string): Promise<string> {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    if (error) {
      console.error("[settings] getSetting failed:", error.message);
      return "";
    }
    return data?.value ?? "";
  } catch (error) {
    console.error("[settings] getSetting exception:", error);
    return "";
  }
}

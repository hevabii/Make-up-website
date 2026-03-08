import { createClient } from "@supabase/supabase-js";

export function createPublicServerSupabaseClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || process.env["SUPABASE_ANON_KEY"];

  if (!url || !key) {
    console.error("[Supabase] Missing environment variables:", { url: !!url, key: !!key });
    throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

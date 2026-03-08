import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabasePublicConfig() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || process.env["SUPABASE_ANON_KEY"];

  if (!url || !key) {
    console.error("[Supabase] Missing environment variables:", { url: !!url, key: !!key });
    throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { url, key };
}

export async function createServerSupabaseClient() {
  const { url, key } = getSupabasePublicConfig();

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // This can be ignored in Server Components
        }
      },
    },
  });
}

// Public server-side reads should use this client to avoid forcing dynamic rendering via cookies().
export function createPublicServerSupabaseClient() {
  const { url, key } = getSupabasePublicConfig();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

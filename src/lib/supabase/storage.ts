import { createClient } from "./client";

export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = createClient();
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  return getPublicUrl(path);
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) throw error;
}

export function getPublicUrl(path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

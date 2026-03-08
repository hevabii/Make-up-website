import { mockSettings } from "@/lib/mock-data";

export async function getAllSettings(): Promise<Record<string, string>> {
  return { ...mockSettings };
}

export async function getSetting(key: string): Promise<string> {
  return mockSettings[key] || "";
}

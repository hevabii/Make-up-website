import { Service } from "@/types/database";
import { mockServices } from "@/lib/mock-data";

export async function getActiveServices(): Promise<Service[]> {
  return mockServices
    .filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function getAllServices(): Promise<Service[]> {
  return mockServices.sort((a, b) => a.display_order - b.display_order);
}

import { getAllBlockedSlots } from "@/lib/queries/availability";
import { AvailabilityManager } from "./availability-manager";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const blockedSlots = await getAllBlockedSlots();
  return <AvailabilityManager initialItems={blockedSlots} />;
}

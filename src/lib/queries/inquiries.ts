import { Inquiry } from "@/types/database";
import { mockInquiries } from "@/lib/mock-data";

export async function getAllInquiries(): Promise<Inquiry[]> {
  return [...mockInquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getNewInquiryCount(): Promise<number> {
  return mockInquiries.filter((i) => i.status === "new").length;
}

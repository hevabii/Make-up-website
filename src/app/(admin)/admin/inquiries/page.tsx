import { getAllInquiries } from "@/lib/queries/inquiries";
import { InquiriesManager } from "./inquiries-manager";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();
  return <InquiriesManager initialItems={inquiries} />;
}

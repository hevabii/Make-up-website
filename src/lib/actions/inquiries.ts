"use server";

import { revalidatePath } from "next/cache";

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  service_interest?: string;
  preferred_date?: string;
  message: string;
}) {
  console.log("[MOCK] submitInquiry:", data);
  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatus(id: string, status: string) {
  console.log("[MOCK] updateInquiryStatus:", id, status);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(id: string) {
  console.log("[MOCK] deleteInquiry:", id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

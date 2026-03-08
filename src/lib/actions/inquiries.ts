"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  service_interest?: string;
  preferred_date?: string;
  preferred_time?: string;
  message: string;
}) {
  const supabase = createAdminClient();

  if (data.preferred_date && data.preferred_time) {
    const hour = Number(data.preferred_time.split(":")[0]);
    const { data: blocked, error: blockedError } = await supabase
      .from("blocked_slots")
      .select("id")
      .eq("slot_date", data.preferred_date)
      .eq("slot_hour", hour)
      .maybeSingle();

    if (blockedError) throw blockedError;
    if (blocked) {
      throw new Error("That date and time is unavailable. Please choose another slot.");
    }
  }

  const { error } = await supabase.from("inquiries").insert(data);
  if (error) throw error;

  // Send email notification
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "adayaryan@gmail.com",
      subject: `New Inquiry from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EFE4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #DC7A9D; font-size: 24px; margin-bottom: 20px;">New Contact Inquiry</h1>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #5A4049;">Name:</strong>
              <p style="margin: 5px 0; color: #7A5C68;">${data.name}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #5A4049;">Email:</strong>
              <p style="margin: 5px 0; color: #7A5C68;">${data.email}</p>
            </div>

            ${data.phone ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #5A4049;">Phone:</strong>
                <p style="margin: 5px 0; color: #7A5C68;">${data.phone}</p>
              </div>
            ` : ''}

            ${data.service_interest ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #5A4049;">Service Interest:</strong>
                <p style="margin: 5px 0; color: #7A5C68;">${data.service_interest}</p>
              </div>
            ` : ''}

            ${data.preferred_date ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #5A4049;">Preferred Date:</strong>
                <p style="margin: 5px 0; color: #7A5C68;">${data.preferred_date}</p>
              </div>
            ` : ''}

            ${data.preferred_time ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #5A4049;">Preferred Time:</strong>
                <p style="margin: 5px 0; color: #7A5C68;">${data.preferred_time}</p>
              </div>
            ` : ''}

            <div style="margin-bottom: 15px;">
              <strong style="color: #5A4049;">Message:</strong>
              <p style="margin: 5px 0; color: #7A5C68; white-space: pre-wrap;">${data.message}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #CFC5B3; margin: 20px 0;" />
            
            <p style="font-size: 12px; color: #D3ADC0; margin: 0;">
              This inquiry was submitted through your makeup artist website contact form.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Email sent successfully", !!result);
  } catch (emailError) {
    // Log email error but don't fail the inquiry submission
    console.error("Failed to send email notification:", emailError);
  }

  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

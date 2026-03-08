import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { getAllSettings } from "@/lib/queries/settings";
import { getActiveServices } from "@/lib/queries/services";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to book a makeup session or ask any questions.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getAllSettings(),
    getActiveServices(),
  ]);

  return (
    <>
      <section className="pt-32 pb-20 px-8 lg:px-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D3ADC0] mb-6">
          Let&apos;s Connect
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-[#5A4049] italic">
          Get in Touch
        </h1>
        <div className="luxury-divider mt-8" />
        <p className="mt-8 text-[14px] leading-relaxed text-[#B9869A] max-w-md mx-auto">
          Ready to book or have questions? I&apos;d love to hear from you.
        </p>
      </section>

      <section className="pb-32 px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-20 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm services={services} />
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="relative pl-8 border-l border-[#DC7A9D]/30">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#D3ADC0] mb-8">
                  Contact Details
                </p>
                <div className="space-y-8">
                  {settings.contact_email && (
                    <div className="flex items-start gap-4">
                      <Mail className="h-4 w-4 text-[#DC7A9D] mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D3ADC0] mb-1">Email</p>
                        <a
                          href={`mailto:${settings.contact_email}`}
                          className="text-[14px] text-[#5A4049] hover:text-[#DC7A9D] transition-colors duration-300"
                        >
                          {settings.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                  {settings.contact_phone && (
                    <div className="flex items-start gap-4">
                      <Phone className="h-4 w-4 text-[#DC7A9D] mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D3ADC0] mb-1">Phone</p>
                        <a
                          href={`tel:${settings.contact_phone}`}
                          className="text-[14px] text-[#5A4049] hover:text-[#DC7A9D] transition-colors duration-300"
                        >
                          {settings.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {settings.contact_location && (
                    <div className="flex items-start gap-4">
                      <MapPin className="h-4 w-4 text-[#DC7A9D] mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D3ADC0] mb-1">Location</p>
                        <p className="text-[14px] text-[#5A4049]">{settings.contact_location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response time note */}
                <div className="mt-14 pt-8 border-t border-[#CFC5B3]">
                  <p className="text-[12px] text-[#D3ADC0] leading-relaxed">
                    I typically respond within 24 hours. For urgent inquiries, please call directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

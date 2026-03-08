import type { Metadata } from "next";
import Link from "next/link";
import { getActiveServices } from "@/lib/queries/services";
import { ServiceCard } from "@/components/public/service-card";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our professional makeup services including bridal, editorial, and special occasion makeup.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await getActiveServices();

  const grouped = services.reduce((acc, service) => {
    const cat = service.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const categoryLabels: Record<string, string> = {
    bridal: "Bridal",
    editorial: "Editorial & Photoshoot",
    occasions: "Special Occasions",
    lessons: "Lessons & Workshops",
    general: "General",
  };

  return (
    <>
      <section className="pt-32 pb-20 px-8 lg:px-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A8A29E] mb-6">
          What I Offer
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-[#1C1917] italic">
          Services
        </h1>
        <div className="luxury-divider mt-8" />
        <p className="mt-8 text-[14px] leading-relaxed text-[#78716C] max-w-lg mx-auto">
          Every service is tailored to your unique vision, ensuring you look and feel extraordinary.
        </p>
      </section>

      <section className="pb-32 px-8 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-24">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-6 mb-12">
                <div className="h-px flex-1 bg-[#E7E0D8]" />
                <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#A8A29E] shrink-0">
                  {categoryLabels[category] || category}
                </h2>
                <div className="h-px flex-1 bg-[#E7E0D8]" />
              </div>
              <div className="flex flex-wrap gap-px bg-[#E7E0D8] justify-center">
                {items.map((service, index) => (
                  <div key={service.id} className="w-full sm:w-[calc(50%-0.5px)] lg:w-[calc(33.333%-0.67px)]">
                    <ServiceCard service={service} index={index} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-8 lg:px-12 bg-white text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A8A29E] mb-6">
          Ready?
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl text-[#1C1917] italic">
          Let&apos;s Create Something Beautiful
        </h2>
        <div className="mt-10">
          <Link
            href="/contact"
            className="btn-luxury group inline-flex items-center gap-3 border border-[#1C1917] px-10 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#1C1917] transition-all duration-500 hover:border-[#B8977E] hover:bg-[#B8977E] hover:text-white"
          >
            Book a Consultation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}

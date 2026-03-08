import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllSettings } from "@/lib/queries/settings";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about our professional makeup artistry services and experience.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const settings = await getAllSettings();

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-20 px-8 lg:px-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D3ADC0] mb-6">
          The Artist
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-[#5A4049] italic">
          {settings.about_title || "About Me"}
        </h1>
        <div className="luxury-divider mt-8" />
      </section>

      {/* Content */}
      <section className="pb-32 px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:gap-24 items-start lg:grid-cols-5">
            {/* Image */}
            <div className="relative lg:col-span-2">
              <div className="relative aspect-[3/4] overflow-hidden">
                {settings.about_image ? (
                  <Image
                    src={settings.about_image}
                    alt="About"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#CFC5B3] via-[#F5F0EB] to-[#CFC5B3] flex items-center justify-center">
                    <span className="font-playfair text-3xl italic text-[#DC7A9D]/30">Portrait</span>
                  </div>
                )}
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#DC7A9D]/20 -z-10" />
            </div>

            {/* Bio */}
            <div className="lg:col-span-3 lg:pt-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D3ADC0] mb-6">
                My Story
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl text-[#5A4049] mb-10">
                Dedicated to the Art of Beauty
              </h2>
              <div className="space-y-6">
                {(settings.about_bio || "Welcome to my portfolio.").split("\n").filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-[1.8] text-[#B9869A]">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-14 pt-10 border-t border-[#CFC5B3] grid grid-cols-3 gap-8">
                {[
                  { value: "8+", label: "Years Experience" },
                  { value: "500+", label: "Clients Served" },
                  { value: "100%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-playfair text-3xl text-[#DC7A9D]">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#D3ADC0]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-14">
                <Link
                  href="/contact"
                  className="btn-luxury group inline-flex items-center gap-3 border border-[#5A4049] px-10 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#5A4049] transition-all duration-500 hover:border-[#DC7A9D] hover:bg-[#DC7A9D] hover:text-white"
                >
                  Work with me
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

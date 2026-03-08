import Link from "next/link";
import { getAllSettings } from "@/lib/queries/settings";
import { getFeaturedPortfolioItems } from "@/lib/queries/portfolio";
import { getActiveServices } from "@/lib/queries/services";
import { getFeaturedTestimonials } from "@/lib/queries/testimonials";
import { Hero } from "@/components/public/hero";
import { PortfolioGrid } from "@/components/public/portfolio-grid";
import { ServiceCard } from "@/components/public/service-card";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, portfolio, services, testimonials] = await Promise.all([
    getAllSettings(),
    getFeaturedPortfolioItems(),
    getActiveServices(),
    getFeaturedTestimonials(),
  ]);

  return (
    <>
      <Hero
        title={settings.hero_title || "Beauty, Elevated"}
        subtitle={settings.hero_subtitle || "Professional makeup artistry for your most important moments"}
        imageUrl={settings.hero_image || undefined}
      />

      {/* Featured Work */}
      {portfolio.length > 0 && (
        <section className="py-32 px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A8A29E] mb-6">
                Portfolio
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-[#1C1917]">
                Featured Work
              </h2>
              <div className="luxury-divider mt-8" />
            </div>
            <PortfolioGrid items={portfolio} />
            <div className="mt-16 text-center">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#78716C] hover:text-[#B8977E] transition-colors duration-300"
              >
                Explore the collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="py-32 px-8 lg:px-12 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A8A29E] mb-6">
                What I Offer
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-[#1C1917]">
                Services
              </h2>
              <div className="luxury-divider mt-8" />
              <p className="mt-8 text-[14px] leading-relaxed text-[#78716C] max-w-lg mx-auto">
                Tailored beauty services designed to enhance your natural radiance for every occasion.
              </p>
            </div>
            <div className="grid gap-px bg-[#E7E0D8] sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#78716C] hover:text-[#B8977E] transition-colors duration-300"
              >
                View all services
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-32 px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A8A29E] mb-6">
                Testimonials
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-[#1C1917]">
                Kind Words
              </h2>
              <div className="luxury-divider mt-8" />
            </div>
            <div className="grid gap-0 divide-x divide-[#E7E0D8] md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-32 px-8 lg:px-12 bg-[#1C1917] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B8977E]/5 via-transparent to-[#B8977E]/3" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="luxury-divider mb-12" style={{ background: "rgba(184, 151, 126, 0.4)" }} />
          <h2 className="font-playfair text-4xl md:text-5xl text-white italic">
            Ready to Begin?
          </h2>
          <p className="mt-6 text-[13px] leading-relaxed text-white/40 max-w-md mx-auto">
            Let&apos;s create something beautiful together. Book a consultation to discuss your vision.
          </p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="btn-luxury inline-block border border-white/30 px-12 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 transition-all duration-500 hover:border-[#B8977E] hover:bg-[#B8977E] hover:text-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

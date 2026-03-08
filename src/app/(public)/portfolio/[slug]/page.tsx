import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPortfolioItemBySlug, getPublishedPortfolioItems } from "@/lib/queries/portfolio";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item) return { title: "Not Found" };
  return {
    title: item.title,
    description: item.description || `View ${item.title} in our portfolio.`,
    openGraph: {
      title: item.title,
      description: item.description || undefined,
      images: item.cover_image_url ? [item.cover_image_url] : undefined,
    },
  };
}

export const revalidate = 3600;

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item) notFound();

  const allItems = await getPublishedPortfolioItems();
  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <>
      {/* Back */}
      <div className="pt-28 px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#A8A29E] hover:text-[#1C1917] transition-colors duration-300"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="mt-8 mx-auto max-w-4xl px-8 lg:px-12">
        <div className="relative aspect-[3/4] w-full max-h-[600px] overflow-hidden rounded-sm bg-[#E7E0D8]">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-playfair text-4xl italic text-[#B8977E]/20">{item.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <section className="py-20 px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B8977E] mb-4">
            {item.category}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1C1917]">
            {item.title}
          </h1>
          {item.description && (
            <>
              <div className="luxury-divider mt-8" />
              <p className="mt-8 text-[15px] leading-[1.8] text-[#78716C]">
                {item.description}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Gallery */}
      {item.images && item.images.length > 0 && (
        <section className="pb-20 px-8 lg:px-12">
          <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-2">
            {item.images.map((url, index) => (
              <div key={index} className="relative aspect-[3/4] max-h-[500px] overflow-hidden rounded-sm bg-[#E7E0D8]">
                <Image
                  src={url}
                  alt={`${item.title} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next */}
      <section className="px-8 lg:px-12 pb-20">
        <div className="mx-auto max-w-5xl border-t border-[#E7E0D8] pt-12">
          <div className="flex items-center justify-between">
            {prevItem ? (
              <Link
                href={`/portfolio/${prevItem.slug}`}
                className="group flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#78716C] hover:text-[#B8977E] transition-colors duration-300"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
                {prevItem.title}
              </Link>
            ) : (
              <div />
            )}
            {nextItem ? (
              <Link
                href={`/portfolio/${nextItem.slug}`}
                className="group flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#78716C] hover:text-[#B8977E] transition-colors duration-300"
              >
                {nextItem.title}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PortfolioItem } from "@/types/database";

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        // First item spans 2 rows for editorial feel
        const isFeature = index === 0;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.8,
              delay: index * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={isFeature ? "sm:row-span-2" : ""}
          >
            <Link href={`/portfolio/${item.slug}`} className="group block h-full">
              <div className={`relative overflow-hidden bg-[#E7E0D8] ${isFeature ? "aspect-[3/5]" : "aspect-[4/5]"} h-full`}>
                {item.cover_image_url ? (
                  <Image
                    src={item.cover_image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#B8977E]/10 via-[#E7E0D8] to-[#B8977E]/5">
                    <span className="font-playfair text-2xl italic text-[#B8977E]/40">{item.title}</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-8 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B8977E]">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-playfair text-xl text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { PortfolioGrid } from "@/components/public/portfolio-grid";
import { PortfolioItem } from "@/types/database";
import { cn } from "@/lib/utils";

interface PortfolioPageClientProps {
  items: PortfolioItem[];
}

export function PortfolioPageClient({ items }: PortfolioPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))];

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="pt-32 pb-20 px-8 lg:px-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D3ADC0] mb-6">
          My Work
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-[#5A4049] italic">
          Portfolio
        </h1>
        <div className="luxury-divider mt-8" />
      </section>

      <section className="pb-32 px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            {categories.map((cat, index) => (
              <span key={cat} className="flex items-center gap-6">
                {index > 0 && <span className="text-[#CFC5B3]">|</span>}
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                    activeCategory === cat
                      ? "text-[#DC7A9D]"
                      : "text-[#D3ADC0] hover:text-[#5A4049]"
                  )}
                >
                  {cat}
                </button>
              </span>
            ))}
          </div>

          {filteredItems.length > 0 ? (
            <PortfolioGrid items={filteredItems} />
          ) : (
            <p className="text-center text-[14px] text-[#D3ADC0] py-20">
              No items in this category yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

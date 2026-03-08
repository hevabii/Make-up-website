"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Testimonial } from "@/types/database";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden"
    >
      {testimonial.image_url ? (
        <div className="relative aspect-[4/5] bg-[#CFC5B3]">
          <Image
            src={testimonial.image_url}
            alt={`Review by ${testimonial.client_name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Overlay with client info and quote */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12">
            <p className="font-playfair text-sm leading-relaxed text-white/90 italic mb-4 line-clamp-3">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-white">
              {testimonial.client_name}
            </p>
            {testimonial.service_type && (
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/70 mt-1">
                {testimonial.service_type}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="px-8 py-10">
          {/* Decorative quote */}
          <span className="absolute top-4 left-4 font-playfair text-7xl leading-none text-[#DC7A9D]/10 select-none pointer-events-none">
            &ldquo;
          </span>
          <p className="relative font-playfair text-lg leading-relaxed text-[#5A4049]/80 italic">
            {testimonial.content}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#CFC5B3]" />
            <div className="text-right">
              <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#5A4049]">
                {testimonial.client_name}
              </p>
              {testimonial.service_type && (
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#D3ADC0] mt-1">
                  {testimonial.service_type}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

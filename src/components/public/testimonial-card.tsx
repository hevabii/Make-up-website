"use client";

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
      className="relative px-8 py-10"
    >
      {/* Decorative quote */}
      <span className="absolute top-4 left-4 font-playfair text-7xl leading-none text-[#B8977E]/10 select-none pointer-events-none">
        &ldquo;
      </span>

      <p className="relative font-playfair text-lg leading-relaxed text-[#1C1917]/80 italic">
        {testimonial.content}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#E7E0D8]" />
        <div className="text-right">
          <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#1C1917]">
            {testimonial.client_name}
          </p>
          {testimonial.service_type && (
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#A8A29E] mt-1">
              {testimonial.service_type}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

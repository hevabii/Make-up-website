"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Service } from "@/types/database";

interface ServiceCardProps {
  service: Service;
  index?: number;
  disableAnimation?: boolean;
}

export function ServiceCard({ service, index = 0, disableAnimation = false }: ServiceCardProps) {
  const rootClassName =
    "group relative flex h-full flex-col bg-white p-8 transition-colors duration-300";

  const content = (
    <>
      {/* Gold top accent */}
      <div className="absolute top-0 left-8 right-8 h-px bg-[#DC7A9D]/30 group-hover:bg-[#DC7A9D] transition-colors duration-500" />

      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D3ADC0] mb-3">
        {service.category}
      </p>

      <h3 className="font-playfair text-xl text-[#5A4049]">
        {service.name}
      </h3>

      {service.description && (
        <p className="mt-4 text-[13px] leading-relaxed text-[#B9869A]">
          {service.description}
        </p>
      )}

      <div className="mt-auto pt-6 border-t border-[#CFC5B3] flex items-end justify-between">
        <div>
          {service.price && (
            <span className="font-playfair text-2xl text-[#5A4049]">
              PHP {service.price}
            </span>
          )}
          {service.price_note && (
            <span className="ml-2 text-[11px] text-[#D3ADC0] tracking-wide">{service.price_note}</span>
          )}
        </div>
        {service.duration && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#D3ADC0]">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {service.duration}
          </div>
        )}
      </div>
    </>
  );

  if (disableAnimation) {
    return <div className={rootClassName}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={rootClassName}
    >
      {content}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Service } from "@/types/database";

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-white p-8 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-8 right-8 h-px bg-[#B8977E]/30 group-hover:bg-[#B8977E] transition-colors duration-500" />

      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E] mb-3">
        {service.category}
      </p>

      <h3 className="font-playfair text-xl text-[#1C1917]">
        {service.name}
      </h3>

      {service.description && (
        <p className="mt-4 text-[13px] leading-relaxed text-[#78716C]">
          {service.description}
        </p>
      )}

      <div className="mt-8 pt-6 border-t border-[#E7E0D8] flex items-end justify-between">
        <div>
          {service.price && (
            <span className="font-playfair text-2xl text-[#1C1917]">
              ${service.price}
            </span>
          )}
          {service.price_note && (
            <span className="ml-2 text-[11px] text-[#A8A29E] tracking-wide">{service.price_note}</span>
          )}
        </div>
        {service.duration && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8A29E]">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {service.duration}
          </div>
        )}
      </div>
    </motion.div>
  );
}

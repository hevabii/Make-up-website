"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Split title for editorial typography
  const words = title.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(" ");
  const line2 = words.slice(midpoint).join(" ");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Hero background"
          fill
          className="object-cover scale-105"
          priority
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A4049] via-[#7A5C68] to-[#5A4049]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#DC7A9D]/5 via-transparent to-[#DC7A9D]/3" />
        </>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-8 text-center">
        {/* Decorative line */}
        {mounted && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto h-px bg-[#DC7A9D]/60 mb-12"
          />
        )}

        {mounted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/75 mb-8"
          >
            Professional Makeup Artistry
          </motion.p>
        )}

        {mounted && (
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-playfair leading-[0.9] tracking-tight"
          >
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white">
              {line1}
            </span>
            {line2 && (
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white/90 italic mt-2">
                {line2}
              </span>
            )}
          </motion.h1>
        )}

        {mounted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mx-auto mt-10 max-w-xl text-[13px] leading-relaxed tracking-wide text-white/80"
          >
            {subtitle}
          </motion.p>
        )}

        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-14"
          >
            <Link
              href="/contact"
              className="btn-luxury inline-block border border-white/50 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white/95 transition-all duration-500 hover:border-[#DC7A9D] hover:bg-[#DC7A9D] hover:text-white"
            >
              Book a Session
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-white/65" strokeWidth={1} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

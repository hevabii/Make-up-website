import Link from "next/link";
import { Instagram, Facebook, Music } from "lucide-react";

interface FooterProps {
  settings: Record<string, string>;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#5A4049]">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#DC7A9D] to-transparent" />

      <div className="mx-auto max-w-4xl px-8 py-20 text-center">
        {/* Brand */}
        <Link href="/" className="inline-block">
          <h3 className="text-[13px] font-medium tracking-[0.4em] uppercase text-white/90">
            Beauty Artist
          </h3>
        </Link>

        <p className="mt-6 text-[13px] leading-relaxed text-white/75 max-w-md mx-auto">
          {settings.footer_text || "Professional makeup artistry for weddings, editorials, and special occasions."}
        </p>

        {/* Navigation */}
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {[
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/portfolio", label: "Portfolio" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 hover:text-[#DC7A9D] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contact details */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[11px] text-white/75">
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="hover:text-[#DC7A9D] transition-colors">
              {settings.contact_email}
            </a>
          )}
          {settings.contact_phone && (
            <>
              <span className="text-white/10">|</span>
              <a href={`tel:${settings.contact_phone}`} className="hover:text-[#DC7A9D] transition-colors">
                {settings.contact_phone}
              </a>
            </>
          )}
          {settings.contact_location && (
            <>
              <span className="text-white/10">|</span>
              <span>{settings.contact_location}</span>
            </>
          )}
        </div>

        {/* Social */}
        <div className="mt-10 flex items-center justify-center gap-6">
          {settings.social_instagram && (
            <a
              href={settings.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 hover:text-[#DC7A9D] transition-colors duration-300"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
          )}
          {settings.social_facebook && (
            <a
              href={settings.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 hover:text-[#DC7A9D] transition-colors duration-300"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.5} />
            </a>
          )}
          {settings.social_tiktok && (
            <a
              href={settings.social_tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 hover:text-[#DC7A9D] transition-colors duration-300"
            >
              <Music className="h-4 w-4" strokeWidth={1.5} />
            </a>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/60">
            &copy; {new Date().getFullYear()} Beauty Artist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

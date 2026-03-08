"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#F5EFE4]/98 backdrop-blur-md border-b border-[#CFC5B3]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 lg:px-12">
        <Link
          href="/"
          className="relative h-12 w-12 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Beauty Artist Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link-luxury text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                isActive(link.href)
                  ? "text-[#DC7A9D] active"
                  : "text-[#B9869A] hover:text-[#5A4049]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Menu className="h-5 w-5 text-[#5A4049]" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-[#F5EFE4] border-l border-[#CFC5B3] p-0">
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-[12px] font-medium uppercase tracking-[0.25em] transition-colors duration-300",
                    isActive(link.href)
                      ? "text-[#DC7A9D]"
                      : "text-[#B9869A] hover:text-[#5A4049]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="luxury-divider mt-4" />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beauty Artist | Professional Makeup Artistry",
    template: "%s | Beauty Artist",
  },
  description:
    "Professional makeup artistry for weddings, editorials, and special occasions. Book your session today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans bg-[#F5EFE4] text-[#5A4049] antialiased selection:bg-[#DC7A9D]/20 selection:text-[#5A4049]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

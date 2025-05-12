import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GalleryProvider } from "@/context/GalleryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostmanPatisserie | Artisanal Bread",
  description: "Fresh artisanal bread delivered to your doorstep. Order our handcrafted breads made with premium ingredients.",
  keywords: "bread, patisserie, artisanal, handcrafted, organic, delivery, order bread, freshly baked",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-stone-800`}
      >
        <GalleryProvider>
          {children}
        </GalleryProvider>
      </body>
    </html>
  );
}

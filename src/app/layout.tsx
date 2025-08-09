import localFont from "next/font/local";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

/* Police locale */
const stretchPro = localFont({
  src: "./fonts/StretchPro.otf",
  display: "swap",
  weight: "400",
  style: "normal",
});

/* Polices Google (variables Tailwind déjà utilisées) */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LARTCHITECTURE",
  description: "Portfolio photo d’architecture — Pierre‑Antoine Mourault",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${stretchPro.className} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
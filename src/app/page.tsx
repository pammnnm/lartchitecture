"use client";

import React, { useMemo } from "react";

const PHOTOS = [
  { src: "/photos/IP2A0094.jpg", alt: "" },
  { src: "/photos/IP2A0096.jpg", alt: "" },
  { src: "/photos/IP2A0097.jpg", alt: "" },
  { src: "/photos/IP2A0098.jpg", alt: "" },
  { src: "/photos/IP2A0099.jpg", alt: "" },
  { src: "/photos/IP2A0100.jpg", alt: "" },
  { src: "/photos/IP2A0101.jpg", alt: "" },
  { src: "/photos/IP2A0102.jpg", alt: "" },
  { src: "/photos/IP2A0104.jpg", alt: "" },
  { src: "/photos/IP2A0105.jpg", alt: "" },
  { src: "/photos/IP2A0106.jpg", alt: "" },
  { src: "/photos/IP2A0107.jpg", alt: "" },
  { src: "/photos/IP2A0197.jpg", alt: "" },
  { src: "/photos/IP2A0201.jpg", alt: "" },
  { src: "/photos/IP2A0214.jpg", alt: "" },
  { src: "/photos/IP2A0216.jpg", alt: "" },
  { src: "/photos/IP2A0218.jpg", alt: "" },
  { src: "/photos/IP2A0222.jpg", alt: "" },
  { src: "/photos/IP2A0224.jpg", alt: "" },
  { src: "/photos/IP2A0227.jpg", alt: "" },
  { src: "/photos/IP2A0229.jpg", alt: "" },
  { src: "/photos/IP2A0233.jpg", alt: "" },
  { src: "/photos/IP2A0234.jpg", alt: "" },
  { src: "/photos/IP2A0235.jpg", alt: "" },
  { src: "/photos/IP2A0237.jpg", alt: "" },
  { src: "/photos/IP2A0238.jpg", alt: "" },
  { src: "/photos/IP2A0243.jpg", alt: "" },
  { src: "/photos/IP2A0244.jpg", alt: "" },
  { src: "/photos/IP2A0248.jpg", alt: "" },
  { src: "/photos/IP2A0250.jpg", alt: "" },
  { src: "/photos/IP2A0251.jpg", alt: "" },
  { src: "/photos/IP2A0259.jpg", alt: "" },
  { src: "/photos/IP2A0266.jpg", alt: "" },
  { src: "/photos/IP2A0271.jpg", alt: "" },
  { src: "/photos/IP2A0272.jpg", alt: "" },
  { src: "/photos/IP2A0274.jpg", alt: "" },
  { src: "/photos/IP2A0276.jpg", alt: "" },
  { src: "/photos/IP2A0278.jpg", alt: "" },
  { src: "/photos/IP2A0280.jpg", alt: "" },
  { src: "/photos/IP2A0297.jpg", alt: "" },
  { src: "/photos/IP2A0301.jpg", alt: "" },
  { src: "/photos/IP2A0303.jpg", alt: "" },
  { src: "/photos/IP2A0304.jpg", alt: "" },
  { src: "/photos/IP2A0306.jpg", alt: "" },
  { src: "/photos/IP2A0307.jpg", alt: "" },
  { src: "/photos/IP2A0314.jpg", alt: "" },
  { src: "/photos/IP2A0315.jpg", alt: "" },
  { src: "/photos/IP2A0316.jpg", alt: "" },
  { src: "/photos/IP2A0318.jpg", alt: "" },
  { src: "/photos/IP2A0319.jpg", alt: "" },
  { src: "/photos/IP2A0321.jpg", alt: "" },
  { src: "/photos/IP2A0322.jpg", alt: "" },
  { src: "/photos/IP2A0324.jpg", alt: "" },
];

function splitInTwoEven<T>(arr: T[]) {
  const left: T[] = [], right: T[] = [];
  arr.forEach((item, i) => (i % 2 === 0 ? left : right).push(item));
  return [left, right];
}

function Header() {
  return (
    <header className="px-5 sm:px-8 pt-10 pb-6 select-none">
      <h1
          className="tracking-[-0.01em] text-[26px] sm:text-3xl font-semibold text-neutral-900"
          style={{ fontFamily: "StretchPro" }}
        >
          LARTCHITECTURE
        </h1>
      <p className="mt-1 text-sm sm:text-base text-neutral-700">
        Pierre-Antoine MOURAULT
      </p>
      <p className="mt-6 text-center italic text-sm sm:text-base text-neutral-500">
        L’Architecture, c’est formuler les problèmes avec clarté. — Le Corbusier
      </p>
    </header>
  );
}

function ColumnScroller({
  photos,
  align = "left",
}: {
  photos: { src: string; alt?: string }[];
  align?: "left" | "right";
}) {
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className={align === "left" ? "pr-2 sm:pr-3" : "pl-2 sm:pl-3"}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {photos.map((p, i) => (
            <figure key={p.src + i}>
              {/* 16:9 strict, pas d'arrondis ni bordures */}
              <div className="relative w-full overflow-hidden">
                <div style={{ paddingTop: "56.25%" }} />
                <img
                  src={p.src}
                  alt={p.alt ?? "Photo"}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </figure>
          ))}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="px-5 sm:px-8 py-6 text-xs text-neutral-500">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span>© {new Date().getFullYear()} LARTCHITECTURE</span>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com/pammnnm" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:no-underline">@pammnnm</a>
          <a href="https://instagram.com/pamm_eos" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:no-underline">@pamm_eos</a>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  const [left, right] = useMemo(() => splitInTwoEven(PHOTOS), []);
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <Header />
        <main className="px-3 sm:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[calc(100vh-220px)] md:h-[calc(100vh-230px)]">
            <ColumnScroller photos={left} align="left" />
            <ColumnScroller photos={right} align="right" />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
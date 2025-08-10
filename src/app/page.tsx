"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { PHOTOS } from "../lib/photos";

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
        LARRTCHITECTUREEE
      </h1>
      <p className="mt-1 text-sm sm:text-base text-neutral-700">
        Pierre-Antoine MOURAULT
      </p>
      <p className="mt-6 text-center italic text-sm sm:text-base text-neutral-500">
        Portofolio
      </p>
    </header>
  );
}

import Image from "next/image";

function ColumnScroller({
  photos,
  align = "left",
}: {
  photos: { src: string; alt?: string; info?: string }[];
  align?: "left" | "right";
}) {
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className={align === "left" ? "pr-2 sm:pr-3" : "pl-2 sm:pl-3"}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {photos.map((p, i) => (
            <figure key={p.src + i}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                <Link href={`/photo/${encodeURIComponent(p.src.split("/").pop()!)}`}>
                  <Image
                    src={p.src}
                    alt={p.alt ?? "Photo"}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    quality={80}
                    priority={i === 0} // précharge juste la première
                    className="object-cover cursor-pointer"
                  />
                </Link>
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
          <div className="grid grid-cols-2 gap-0 h-[calc(100vh-220px)] md:h-[calc(100vh-230px)]">
            <ColumnScroller photos={left} align="left" />
            <ColumnScroller photos={right} align="right" />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
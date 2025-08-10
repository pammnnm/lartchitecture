// app/photo/[slug]/PhotoViewer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Photo } from "../../../lib/photos";

type Props = {
  photo: Photo;
  prevSlug: string;
  nextSlug: string;
};

function useLike(slug: string) {
  const KEY = "likes:v1";
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLiked(!!(JSON.parse(raw) as Record<string, boolean>)[slug]);
    } catch {}
  }, [slug]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem(KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      map[slug] = !map[slug];
      localStorage.setItem(KEY, JSON.stringify(map));
      setLiked(map[slug]);
    } catch {}
  };

  return { liked, toggle };
}

export default function PhotoViewer({ photo, prevSlug, nextSlug }: Props) {
  const router = useRouter();
  const slug = useMemo(() => photo.src.split("/").pop()!, [photo.src]);
  const { liked, toggle } = useLike(slug);

  // navigation clavier ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") router.push(`/photo/${prevSlug}`);
      if (e.key === "ArrowRight") router.push(`/photo/${nextSlug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevSlug, nextSlug]);

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        {/* HEADER fixe avec logo maison (iOS-like) + like */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-3 bg-white/80 backdrop-blur">
          {/* Logo maison -> accueil */}
          <Link
            href="/"
            aria-label="Accueil"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
          >
            {/* icône maison style iOS (monoline) */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5 10.5V20h14v-9.5" />
            </svg>
          </Link>

          {/* Like style iOS */}
          <button
            onClick={toggle}
            aria-pressed={liked}
            aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
          >
            {liked ? (
              // cœur plein
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-6.5-4.35-9.1-7.02C.5 11.5 1 7.5 4.5 6.2 6.6 5.4 8.7 6.1 10 7.6c1.3-1.5 3.4-2.2 5.5-1.4C19 7.5 19.5 11.5 21.1 14c-2.6 2.67-9.1 7-9.1 7z" />
              </svg>
            ) : (
              // cœur outline
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 12.1C22 10.3 21.6 7.7 19.7 6.5a4.8 4.8 0 0 0-6 .9L12 9l-1.7-1.6a4.8 4.8 0 0 0-6-.9C2.4 7.7 2 10.3 3.2 12.1 5.2 15 12 20 12 20s6.8-5 8.8-7.9z" />
              </svg>
            )}
          </button>
        </div>

        {/* Photo plein écran (optimisée) */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={photo.src}
            alt={photo.alt || ""}
            fill
            sizes="100vw"
            quality={85}
            priority
            className="object-contain"
          />

          {/* grandes zones cliquables gauche/droite */}
          <Link
            href={`/photo/${prevSlug}`}
            aria-label="Photo précédente"
            className="absolute inset-y-0 left-0 w-1/3"
          />
          <Link
            href={`/photo/${nextSlug}`}
            aria-label="Photo suivante"
            className="absolute inset-y-0 right-0 w-1/3"
          />

          {/* petites flèches visibles (optionnelles) */}
          <Link
            href={`/photo/${prevSlug}`}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white z-10"
          >
            ←
          </Link>
          <Link
            href={`/photo/${nextSlug}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white z-10"
          >
            →
          </Link>
        </div>

        {/* Infos sous la photo */}
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">{photo.alt || "Sans titre"}</h1>
          <p className="text-neutral-600">{photo.info || "Aucune information disponible"}</p>
        </div>
      </div>
    </div>
  );
}
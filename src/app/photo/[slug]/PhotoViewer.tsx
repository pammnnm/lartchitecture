// app/photo/[slug]/PhotoViewer.tsx  (Client Component)
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

          {/* zones cliquables + flèches */}
          <Link href={`/photo/${prevSlug}`} aria-label="Précédente" className="absolute inset-y-0 left-0 w-1/3" />
          <Link href={`/photo/${nextSlug}`} aria-label="Suivante" className="absolute inset-y-0 right-0 w-1/3" />
          <Link href={`/photo/${prevSlug}`} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white">←</Link>
          <Link href={`/photo/${nextSlug}`} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white">→</Link>

          {/* like */}
          <button
            onClick={toggle}
            aria-pressed={liked}
            aria-label="Like"
            className="absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
          >
            {liked ? "♥︎" : "♡"}
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">{photo.alt || "Sans titre"}</h1>
          <p className="text-neutral-600">{photo.info || "Aucune information disponible"}</p>
        </div>
      </div>
    </div>
  );
}

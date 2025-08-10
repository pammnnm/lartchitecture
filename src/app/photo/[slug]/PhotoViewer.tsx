// app/photo/[slug]/PhotoViewer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Photo } from "../../../lib/photos";
import type { ExifInfo } from "../../../lib/exif";

type Props = {
  photo: Photo;
  prevSlug: string;
  nextSlug: string;
  exif?: ExifInfo; // ← infos EXIF lues côté serveur et passées depuis page.tsx
};

/* UID anonyme par visiteur pour le système de like serveur */
function getUID() {
  if (typeof window === "undefined") return "";
  const k = "uid:v1";
  let u = localStorage.getItem(k);
  if (!u) {
    u = self.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    localStorage.setItem(k, u);
  }
  return u;
}

/* Hook de like connecté à /api/likes/[slug] (compteur global + état perso) */
function useLike(slug: string) {
  const [uid] = useState(getUID);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!uid) return;
    fetch(`/api/likes/${encodeURIComponent(slug)}?uid=${uid}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setCount(d.count);
        setLiked(Boolean(d.liked));
      })
      .catch(() => {});
  }, [slug, uid]);

  const toggle = async () => {
    const next = !liked;
    // maj optimiste
    setLiked(next);
    setCount((c) => (c == null ? c : c + (next ? 1 : -1)));

    try {
      const r = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, like: next }),
      });
      const d = await r.json();
      if (typeof d.count === "number") setCount(d.count);
      setLiked(Boolean(d.liked));
    } catch {
      // rollback si échec
      setLiked(!next);
      setCount((c) => (c == null ? c : c + (next ? -1 : 1)));
    }
  };

  return { liked, count, toggle };
}

export default function PhotoViewer({ photo, prevSlug, nextSlug, exif }: Props) {
  const router = useRouter();
  const slug = useMemo(() => photo.src.split("/").pop()!, [photo.src]);
  const { liked, count, toggle } = useLike(slug);

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
            {/* icône maison monoline style iOS */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5 10.5V20h14v-9.5" />
            </svg>
          </Link>

          {/* Like style iOS + compteur */}
          <div className="flex items-center gap-2">
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
            {typeof count === "number" && (
              <span className="text-sm text-neutral-600 select-none">{count}</span>
            )}
          </div>
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

          {/* zones cliquables gauche/droite */}
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

          {/* flèches visibles */}
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
        <div className="p-6 space-y-2">
          <h1 className="text-xl font-semibold">{photo.alt || "Sans titre"}</h1>
          {photo.info && <p className="text-neutral-700">{photo.info}</p>}

          {/* Bloc EXIF auto (affiche seulement ce qui existe) */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-neutral-700 pt-2">
            {exif?.camera && (
              <>
                <dt className="text-neutral-500">Appareil</dt>
                <dd>{exif.camera}</dd>
              </>
            )}
            {exif?.lens && (
              <>
                <dt className="text-neutral-500">Objectif</dt>
                <dd>{exif.lens}</dd>
              </>
            )}
            {exif?.focal && (
              <>
                <dt className="text-neutral-500">Focale</dt>
                <dd>{exif.focal}</dd>
              </>
            )}
            {exif?.exposure && (
              <>
                <dt className="text-neutral-500">Vitesse</dt>
                <dd>{exif.exposure} s</dd>
              </>
            )}
            {exif?.aperture && (
              <>
                <dt className="text-neutral-500">Ouverture</dt>
                <dd>{exif.aperture}</dd>
              </>
            )}
            {exif?.iso && (
              <>
                <dt className="text-neutral-500">ISO</dt>
                <dd>{exif.iso}</dd>
              </>
            )}
            {exif?.date && (
              <>
                <dt className="text-neutral-500">Date</dt>
                <dd>{exif.date}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
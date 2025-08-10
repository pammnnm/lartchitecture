// app/photo/[slug]/page.tsx  (Server Component)
import { notFound } from "next/navigation";
import { PHOTOS } from "../../../lib/photos";
import PhotoViewer from "./PhotoViewer";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next 15: params est un Promise

  const index = PHOTOS.findIndex((p) => p.src.endsWith(slug));
  if (index === -1) return notFound();

  const photo = PHOTOS[index];
  const prev = PHOTOS[(index - 1 + PHOTOS.length) % PHOTOS.length];
  const next = PHOTOS[(index + 1) % PHOTOS.length];

  const prevSlug = prev.src.split("/").pop()!;
  const nextSlug = next.src.split("/").pop()!;

  return <PhotoViewer photo={photo} prevSlug={prevSlug} nextSlug={nextSlug} />;
}
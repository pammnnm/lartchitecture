// app/photo/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PHOTOS } from "../../../lib/photos";
import PhotoViewer from "./PhotoViewer";
import exifMap from "../../../lib/exif-data.json";

export const dynamic = "force-static";
export const revalidate = false;
export function generateStaticParams() {
  return PHOTOS.map((p) => ({ slug: p.src.split("/").pop()! }));
}

type ExifInfo = {
  camera?: string;
  lens?: string;
  focal?: string;
  exposure?: string;
  iso?: string;
  aperture?: string;
  date?: string;
};

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const index = PHOTOS.findIndex((p) => p.src.endsWith(slug));
  if (index === -1) return notFound();

  const photo = PHOTOS[index];
  const prev = PHOTOS[(index - 1 + PHOTOS.length) % PHOTOS.length];
  const next = PHOTOS[(index + 1) % PHOTOS.length];

  const exif = (exifMap as Record<string, ExifInfo>)[slug] || {};

  return (
    <PhotoViewer
      photo={photo}
      prevSlug={prev.src.split("/").pop()!}
      nextSlug={next.src.split("/").pop()!}
      exif={exif}
    />
  );
}
// src/lib/exif.ts
import fs from "node:fs/promises";
import path from "node:path";
import * as exifr from "exifr";

export type ExifInfo = {
  camera?: string;
  lens?: string;
  focal?: string;
  exposure?: string;
  iso?: string;
  aperture?: string;
  date?: string;
};

function formatExposure(ExposureTime?: number) {
  if (!ExposureTime) return undefined;
  // ex: 0.008 -> 1/125, 0.5 -> 1/2 s, 2 -> 2 s
  if (ExposureTime >= 1) return `${ExposureTime} s`;
  const denom = Math.round(1 / ExposureTime);
  return `1/${denom}`;
}

function formatAperture(FNumber?: number) {
  if (!FNumber) return undefined;
  return `f/${Number(FNumber).toFixed(1).replace(/\.0$/, "")}`;
}

function formatFocal(FocalLength?: number) {
  if (!FocalLength) return undefined;
  return `${Math.round(FocalLength)} mm`;
}

function formatDate(DateTimeOriginal?: Date | string) {
  if (!DateTimeOriginal) return undefined;
  const d = DateTimeOriginal instanceof Date ? DateTimeOriginal : new Date(DateTimeOriginal);
  // 2024‑04‑18 14:32
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function readExifForSlug(slug: string): Promise<ExifInfo> {
  // slug = "IP2A0094.jpg"
  const filePath = path.join(process.cwd(), "public", "photos", slug);
  const buf = await fs.readFile(filePath);

  // On demande EXIF + IFD0 + XMP (pour LensModel)
  const data: any = await exifr.parse(buf, { exif: true, ifd0: true, xmp: true });

  const make = data?.Make?.toString().trim();
  const model = data?.Model?.toString().trim();
  const lens = (data?.LensModel || data?.Lens || data?.LensID || data?.lensModel)?.toString().trim();

  return {
    camera: [make, model].filter(Boolean).join(" ") || undefined,
    lens: lens || undefined,
    focal: formatFocal(data?.FocalLength),
    exposure: formatExposure(data?.ExposureTime),
    iso: data?.ISO ? `ISO ${data.ISO}` : undefined,
    aperture: formatAperture(data?.FNumber),
    date: formatDate(data?.DateTimeOriginal || data?.CreateDate),
  };
}
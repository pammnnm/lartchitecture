// src/lib/exif.ts
import fs from "node:fs/promises";
import path from "node:path";

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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function readExifForSlug(slug: string): Promise<ExifInfo> {
  const filePath = path.join(process.cwd(), "public", "photos", slug);

  // si le fichier n’existe pas, on renvoie vide
  try {
    await fs.access(filePath);
  } catch {
    return {};
  }

  // import dynamique pour éviter les soucis de build si exifr n'est pas dispo
  let exifr: any = null;
  try {
    const mod = await import("exifr");
    exifr = (mod as any).default ?? mod;
  } catch {
    return {}; // pas d'exifr => pas d'EXIF, pas d'erreur
  }

  try {
    const buf = await fs.readFile(filePath);

    // ✅ pas d’options : compatible avec les typings actuels
    const data: any = await exifr.parse(buf);

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
  } catch {
    return {};
  }
}
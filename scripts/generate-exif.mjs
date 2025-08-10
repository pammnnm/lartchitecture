// scripts/generate-exif.mjs
import fs from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";
import exifr from "exifr";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const photosDir = path.join(__dirname, "..", "public", "photos");
const outPath = path.join(__dirname, "..", "src", "lib", "exif-data.json");

function formatExposure(ExposureTime) {
  if (!ExposureTime) return undefined;
  if (ExposureTime >= 1) return `${ExposureTime} s`;
  const denom = Math.round(1 / ExposureTime);
  return `1/${denom}`;
}
function formatAperture(FNumber) {
  if (!FNumber) return undefined;
  const n = Number(FNumber);
  return `f/${(Math.round(n * 10) / 10).toString()}`;
}
function formatFocal(FocalLength) {
  if (!FocalLength) return undefined;
  return `${Math.round(FocalLength)} mm`;
}
function formatDate(DateTimeOriginal) {
  if (!DateTimeOriginal) return undefined;
  const d = DateTimeOriginal instanceof Date ? DateTimeOriginal : new Date(DateTimeOriginal);
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function main() {
  const out = {};
  const files = await fs.readdir(photosDir);
  const images = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of images) {
    try {
      const buf = await fs.readFile(path.join(photosDir, file));
      const data = await exifr.parse(buf); // pas d’options → compatible
      const make  = data?.Make?.toString().trim();
      const model = data?.Model?.toString().trim();
      const lens =
        (data?.LensModel || data?.Lens || data?.LensID || data?.lensModel)?.toString().trim();

      out[file] = {
        camera: [make, model].filter(Boolean).join(" ") || undefined,
        lens: lens || undefined,
        focal: formatFocal(data?.FocalLength),
        exposure: formatExposure(data?.ExposureTime),
        iso: data?.ISO ? `ISO ${data.ISO}` : undefined,
        aperture: formatAperture(data?.FNumber),
        date: formatDate(data?.DateTimeOriginal || data?.CreateDate),
      };
      console.log("✓ EXIF", file);
    } catch (e) {
      console.warn("… pas d’EXIF ou erreur", file);
      out[file] = {};
    }
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log("→ écrit:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
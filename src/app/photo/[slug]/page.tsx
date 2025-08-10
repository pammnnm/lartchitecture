import { notFound } from "next/navigation";
import { PHOTOS } from "../../../lib/photos";

export default function PhotoPage({ params }: { params: { slug: string } }) {
  const photo = PHOTOS.find((p) => p.src.endsWith(params.slug));
  if (!photo) return notFound();

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        {/* Photo plein écran en haut */}
        <div className="w-full">
          <img
            src={photo.src}
            alt={photo.alt || "Photo"}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Infos */}
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">
            {photo.alt || "Sans titre"}
          </h1>
          <p className="text-neutral-600">
            {photo.info || "Aucune information disponible"}
          </p>
        </div>
      </div>
    </div>
  );
}
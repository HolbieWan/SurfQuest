// """
// SurfSpotCard.js
// --------------------------
// Card component to display detailed information about a surf spot,
// including an image carousel and key attributes.
// --------------------------
//"

"use client";

import Link from "next/link";
import ImageCarousel from "@/components/SurfSpots/Carousel";

export default function SurfSpotCard({
  surfspot,
  zoneName,
  index,
  selectedSurfSpot = null,
}) {
  if (!surfspot) {
    return <div className="text-red-500">Surf spot data is unavailable.</div>;
  }

  const {
    name,
    surfzone,
    surfzone_name,
    description,
    best_months,
    wave_direction,
    best_swell_direction,
    best_swell_size_meter,
    best_tide,
    best_wind_direction,
    surf_hazards,
    surf_level,
    // selon endpoint:
    // - surfzones-detail: images: ["url", "url"]
    // - surfspots-detail: images: ["url", ...] (d'après ton exemple)
    // - ancien: spot_images: [...]
    images,
    spot_images,
  } = surfspot;

  // const zoneName =
  //   (surfzone && typeof surfzone === "object" && surfzone.name) ||
  //   surfzone_name ||
  //   "Unknown surf zone";

  const safeJoin = (arr) => (Array.isArray(arr) ? arr.join(", ") : "—");

  // normalize images for carousel: allow strings or objects with "image"
  const rawImages =
    Array.isArray(spot_images) && spot_images.length ? spot_images : images;
  const normalizedImages = Array.isArray(rawImages)
    ? rawImages
        .map((img) => {
          if (typeof img === "string") return img;
          if (img && typeof img === "object" && typeof img.image === "string")
            return img.image;
          return null;
        })
        .filter(Boolean)
    : [];

  const content = (
    <>
      <h2 className="mt-2 text-pink-400 text-2xl font-bold text-center md:text-left">
        {name || "Unnamed spot"}
      </h2>

      <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">
        {zoneName}
      </div>

      <p className="mt-2 text-sm text-gray-700 text-center md:text-left">
        {description || "—"}
      </p>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best months:{" "}
        <span className="text-cyan-500 font-bold">{safeJoin(best_months)}</span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Wave direction:{" "}
        <span className="text-cyan-500 font-bold">{wave_direction || "—"}</span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best swell direction:{" "}
        <span className="text-cyan-500 font-bold">
          {best_swell_direction || "—"}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best swell size:{" "}
        <span className="text-cyan-500 font-bold">
          {best_swell_size_meter != null ? `${best_swell_size_meter} m` : "—"}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best tide:{" "}
        <span className="text-cyan-500 font-bold">{safeJoin(best_tide)}</span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best wind direction:{" "}
        <span className="text-cyan-500 font-bold">
          {best_wind_direction || "—"}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Surf hazards:{" "}
        <span className="text-cyan-500 font-bold">
          {safeJoin(surf_hazards)}
        </span>
      </div>

      <div className="mt- mb-6 text-sm text-gray-700 text-center md:text-left">
        Surf level:{" "}
        <span className="text-cyan-500 font-bold">{safeJoin(surf_level)}</span>
      </div>
    </>
  );

  return (
    <div
      key={index}
      className="flex flex-col md:flex-row items-start justify-center space-y-10 md:space-y-0 md:space-x-12 mb-10"
    >
      {/* Image Section */}
      <div
        className="bg-black rounded-md group flex-shrink-0 w-full md:w-1/2 lg:w-2/4"
        style={{ height: "400px" }}
      >
        {normalizedImages.length > 0 ? (
          <div className="w-full h-full">
            <ImageCarousel images={normalizedImages} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-gray-700 rounded-md">
            <p className="text-gray-400 text-sm">No spot images.</p>
          </div>
        )}
      </div>

      {/* Details Card */}
      <div
        className="group bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3
                   transform transition-transform duration-500 hover:scale-110"
        style={{ height: "400px" }}
      >
        {selectedSurfSpot ? (
          content
        ) : (
          <Link
            href={`/surfspots/${encodeURIComponent(surfspot.slug || name || surfspot.id)}`}
          >
            {content}
          </Link>
        )}
      </div>
    </div>
  );
}
"use client";

import React from "react";
import Link from "next/link";

export default function SurfZoneCard({ surfzone }) {
  // Normalise l’image quel que soit le serializer
  const imageUrl =
    // ✅ Nouveau contrat (surfzones-lite / surfzones-detail): images: [ "http://..." ]
    (Array.isArray(surfzone?.images) && surfzone.images[0]) ||
    // Ancien contrat detail: zone_images: [ "http://..." ]
    (Array.isArray(surfzone?.zone_images) &&
      typeof surfzone.zone_images[0] === "string" &&
      surfzone.zone_images[0]) ||
    // Ancien contrat full: zone_images: [{ image: "http://..." }]
    (Array.isArray(surfzone?.zone_images) &&
      typeof surfzone.zone_images[0] === "object" &&
      surfzone.zone_images[0]?.image) ||
    // Ancien champ lite: main_image_url
    surfzone?.main_image_url ||
    null;

  return (
    <div className="bg-black rounded-lg relative overflow-hidden group flex items-center justify-center max-w-lg h-64">
      {/* Link overlay */}
      <Link href={`/surfzones/${surfzone.id}`} legacyBehavior>
        <a
          className="absolute inset-0 z-10"
          aria-label={`Open ${surfzone.name}`}
        />
      </Link>

      {/* Background image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={surfzone.name}
          className="inset-0 w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-125"
          loading="lazy"
        />
      ) : (
        // Fallback visuel si pas d'image
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
          No image
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center p-4 transform transition-transform duration-500 group-hover:scale-150">
        <h2 className="text-white text-2xl font-bold text-center text-shadow-md">
          {surfzone.name}
        </h2>
        <div className="mt-2 text-lg text-white text-center font-semibold text-shadow-lg">
          {surfzone.country?.name}
        </div>
      </div>
    </div>
  );
}
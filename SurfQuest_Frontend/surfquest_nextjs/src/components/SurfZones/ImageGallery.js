// """
// Component: ImageGallery
// -----------------------
// Renders a simple image gallery displaying up to two images in a vertical stack.
// Accepts an array of image URLs or objects containing image URLs.
// """

"use client";

import React, { useMemo } from "react";

export default function ImageGallery({ images = [], alt = "" }) {
  // Normalise les images :
  // - ["url", "url"]
  // - [{ image: "url" }, ...]
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    // Case 1: array of strings
    if (images.length > 0 && typeof images[0] === "string") {
      return images.filter(Boolean);
    }

    // Case 2: array of objects { image: "..." }
    if (images.length > 0 && typeof images[0] === "object") {
      return images.map((img) => img?.image).filter(Boolean);
    }

    return [];
  }, [images]);

  if (normalizedImages.length === 0) return null;

  return (
    <div className="group flex flex-col items-center justify-between w-full max-w-lg rounded-lg gap-4">
      {normalizedImages.slice(0, 2).map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${alt} – ${i + 1}`}
          className="w-full h-[300px] object-cover rounded-lg transform transition-transform duration-500 hover:scale-105 overflow-hidden"
          loading="lazy"
        />
      ))}
    </div>
  );
}

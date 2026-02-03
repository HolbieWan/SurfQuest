// """
// ImageCarousel Component
// ------------------------
// A robust image carousel that handles various input formats.
// Accepts an array of image URLs (strings) or an array of objects with an 'image' property.
// """

"use client";

// ============================
// External Dependencies
// ============================
import React, { useMemo, useState } from "react";

/**
 * ImageCarousel Component (robust)
 *
 * Accepts:
 * - ["http://...","http://..."]
 * - [{ image: "http://..." }, ...]
 */
export default function ImageCarousel({ images = [] }) {
  const normalized = useMemo(() => {
    if (!Array.isArray(images)) return [];

    // Case A: array of strings
    if (images.length > 0 && typeof images[0] === "string") {
      return images.filter((u) => typeof u === "string" && u.length);
    }

    // Case B: array of objects { image: "..." }
    if (images.length > 0 && typeof images[0] === "object") {
      return images.map((img) => img?.image).filter(Boolean);
    }

    return [];
  }, [images]);

  const [current, setCurrent] = useState(0);
  const length = normalized.length;

  if (length === 0) return null;

  const nextSlide = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrent((prev) => (prev + 1) % length);
  };

  const prevSlide = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[400px] rounded-lg overflow-hidden">
      {length > 1 && (
        <button
          className="absolute left-4 z-10 bg-black/50 p-2 rounded-full text-white"
          onClick={prevSlide}
          aria-label="Previous image"
        >
          &#8592;
        </button>
      )}

      <img
        src={normalized[current]}
        alt={`Slide ${current + 1}`}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />

      {length > 1 && (
        <button
          className="absolute right-4 z-10 bg-black/50 p-2 rounded-full text-white"
          onClick={nextSlide}
          aria-label="Next image"
        >
          &#8594;
        </button>
      )}
    </div>
  );
}

'use client';

/**
 * ImageGallery Component
 * ----------------------
 * Displays up to two images for a surf zone in a responsive gallery.
 * Each image includes hover scaling for a subtle interaction effect.
 *
 * @param {Object[]} props.images - Array of image objects.
 * @param {string} props.images[].image - URL of the image.
 * @param {string} props.alt - Alt text base for accessibility.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Component Definition
// ============================
export default function ImageGallery({ images, alt }) {
  return (
    <div className="group flex flex-col items-center justify-between w-full max-w-lg rounded-lg">
      {images.slice(0, 2).map((img, i) => (
        <img
          key={i}
          src={img.image}
          alt={`${alt} – ${i + 1}`}
          className="w-full h-[300px] object-cover rounded-lg transform transition-transform duration-500 hover:scale-105 overflow-hidden"
        />
      ))}
    </div>
  );
}
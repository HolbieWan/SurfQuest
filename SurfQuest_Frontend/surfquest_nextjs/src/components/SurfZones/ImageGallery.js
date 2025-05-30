'use client';
import React from 'react';

/**
 * Shows up to two images for a surf zone.
 */
export default function ImageGallery({ images, alt }) {
  return (
    <div className="group flex flex-col items-center justify-between w-full max-w-lg rounded-lg">
      {images.map((img, i) => (
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
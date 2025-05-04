// src/components/SurfZoneCard.jsx
"use client";

import React from 'react';
import Link from 'next/link';

export default function SurfZoneCard({ surfzone }) {
  return (
    <div className="bg-black rounded-lg p-3 relative overflow-hidden group flex items-center justify-center">
      <Link href={`/surfzones/${encodeURIComponent(surfzone.name)}`} legacyBehavior>
        <a className="absolute inset-0 z-10"></a>
      </Link>

      {surfzone.zone_images?.length > 0 && (
        <img
          src={surfzone.zone_images[0].image}
          alt={surfzone.name}
          className="inset-0 w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center p-4">
        <h2 className="text-white text-xl font-bold text-center text-shadow-md">{surfzone.name}</h2>
        <div className="mt-2 text-sm text-white text-center font-semibold text-shadow-lg">
          {surfzone.country.name}
        </div>
      </div>
    </div>
  );
}
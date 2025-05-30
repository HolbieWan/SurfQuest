'use client';
import React from 'react';
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';

/**
 * Displays a vertical list of surf spot cards.
 */
export default function SurfSpotsList({ spots, zoneName }) {
  if (!spots.length) return null;
  return (
    <div className="grid grid-cols-1 p-4 gap-10 rounded-md items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-4xl font-bold mt-6 text-center rounded-lg p-2">
          Popular Surf-spots in {zoneName}
        </h2>
      </div>
      {spots.map(spot => (
        <SurfSpotCard key={spot.id} surfspot={spot} />
      ))}
    </div>
  );
}
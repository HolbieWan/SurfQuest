'use client';

/**
 * SurfSpotsList Component
 * ------------------------
 * Renders a vertical list of surf spot cards for a selected surf zone.
 * Displays a section heading and iterates over `spots` to render each card.
 *
 * @param {Object} props
 * @param {Array<Object>} props.spots - Array of surf spot objects to display.
 * @param {string} props.zoneName - Name of the surf zone for the section heading.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';

// ============================
// Component Definition
// ============================
export default function SurfSpotsList({ spots, zoneName }) {
  // If there are no spots, render nothing
  if (!spots.length) return null;

  return (
    <div className="grid grid-cols-1 p-4 gap-10 rounded-md items-center justify-center w-full">
      {/* Section Heading */}
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-4xl font-bold mt-6 text-center rounded-lg p-2">
          <span className="text-pink-400">{zoneName}</span> Popular Surf Spots
        </h2>
      </div>

      {/* Surf Spot Cards */}
      {spots.map((spot) => (
        <SurfSpotCard key={spot.id} surfspot={spot} zoneName={zoneName} />
      ))}
    </div>
  );
}
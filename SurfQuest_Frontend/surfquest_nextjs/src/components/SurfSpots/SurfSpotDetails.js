// src/components/SurfSpots/SurfSpotDetails.jsx

'use client';

/**
 * SurfSpotDetails Component
 * -------------------------
 * Renders detailed view for a single surf spot, including:
 * - The spot’s name as a heading
 * - A SurfSpotCard summary of the spot
 * - A Reviews section for user feedback
 *
 * @param {Object} props
 * @param {Object} props.surfSpotData - The surf spot object fetched from API
 * @param {string} props.surfSpotData.name - Name of the surf spot
 * @param {number} props.surfSpotData.id - Unique identifier of the surf spot
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Local Dependencies
// ============================
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
// import Reviews from '@/components/Reviews/Reviews';

export default function SurfSpotDetails({ surfSpotData }) {
  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-screen bg-black text-white">
      {/* Spot Name */}
      <h1 className="text-4xl font-bold text-center mb-10">
        {surfSpotData.name}
      </h1>

      {/* Summary Card */}
      <SurfSpotCard
        surfspot={surfSpotData}
        selectedSurfSpot={surfSpotData.name}
      />

      {/* Reviews Section */}
      <div className="group grid grid-cols-1 rounded-md items-center justify-center mt-8">
        {/* <Reviews
          selectedSurfSpot={surfSpotData.name}
          surfSpotId={surfSpotData.id}
        /> */}
      </div>
    </div>
  );
}
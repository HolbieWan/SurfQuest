'use client';

/**
 * SurfSpotCard Component
 * ----------------------
 * Displays a summary card for a surf spot, featuring:
 * - An image carousel of the spot's photos
 * - Key spot details: name, surf zone, description, best months,
 *   wave direction, swell direction & size, tide, wind direction,
 *   hazards, and recommended surf level
 * - When `selectedSurfSpot` is falsy, the entire card is wrapped
 *   in a Next.js Link to navigate to the spot's detail page
 *
 * @param {Object} props
 * @param {Object} props.surfspot              - The surf spot data object
 * @param {string} props.surfspot.name         - Name of the surf spot
 * @param {string[]} props.surfspot.best_months- Array of best months
 * @param {string} props.surfspot.wave_direction       - Preferred wave direction
 * @param {string} props.surfspot.best_swell_direction - Preferred swell direction
 * @param {number} props.surfspot.best_swell_size_meter- Preferred swell size in meters
 * @param {string[]} props.surfspot.best_tide          - Preferred tide conditions
 * @param {string} props.surfspot.best_wind_direction  - Preferred wind direction
 * @param {string[]} props.surfspot.surf_hazards       - List of surf hazards
 * @param {string[]} props.surfspot.surf_level         - Recommended skill levels
 * @param {Object[]} props.surfspot.spot_images        - Array of image objects { image: string }
 * @param {string|null} [props.selectedSurfSpot]       - If truthy, disables the link wrapper
 */

// ============================
// External Dependencies
// ============================
import React from 'react';
import Link from 'next/link';

// ============================
// Local Dependencies
// ============================
import ImageCarousel from '@/components/SurfSpots/Carousel';

export default function SurfSpotCard({ surfspot, index, selectedSurfSpot = null }) {
  if (!surfspot) {
    return (
      <div className="text-red-500">
        Surf spot data is unavailable.
      </div>
    );
  }

  // Destructure frequently used fields
  const {
    name,
    surfzone,
    description,
    best_months,
    wave_direction,
    best_swell_direction,
    best_swell_size_meter,
    best_tide,
    best_wind_direction,
    surf_hazards,
    surf_level,
    spot_images
  } = surfspot;

  const content = (
    <>
      {/* Spot Name & Zone */}
      <h2 className="text-pink-400 text-2xl font-bold text-center md:text-left">
        {name}
      </h2>
      <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">
        {surfzone.name}
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700 text-center md:text-left">
        {description}
      </p>

      {/* Key Details */}
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best months: <span className="text-cyan-500 font-bold">{best_months.join(', ')}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Wave direction: <span className="text-cyan-500 font-bold">{wave_direction}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best swell direction: <span className="text-cyan-500 font-bold">{best_swell_direction}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best swell size: <span className="text-cyan-500 font-bold">{best_swell_size_meter} m</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best tide: <span className="text-cyan-500 font-bold">{best_tide.join(', ')}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Best wind direction: <span className="text-cyan-500 font-bold">{best_wind_direction}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Surf hazards: <span className="text-cyan-500 font-bold">{surf_hazards.join(', ')}</span>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center md:text-left">
        Surf level: <span className="text-cyan-500 font-bold">{surf_level.join(', ')}</span>
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
        style={{ height: '400px' }}
      >
        {spot_images?.length > 0 && (
          <div className="w-full h-full">
            <ImageCarousel images={spot_images} />
          </div>
        )}
      </div>

      {/* Details Card */}
      <div
        className="group bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3
                   transform transition-transform duration-500 hover:scale-110"
        style={{ height: '400px' }}
      >
        {selectedSurfSpot ? (
          content
        ) : (
          <Link href={`/surfspots/${encodeURIComponent(name)}`}>
            {content}
          </Link>
        )}
      </div>
    </div>
  );
}
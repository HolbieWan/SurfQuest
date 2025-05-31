// src/components/SurfZones/SurfZoneCard.jsx
'use client';

/**
 * SurfZoneCard Component
 * ----------------------
 * Renders a clickable card displaying a surf zone’s image, name, and country.
 * The entire card is wrapped in an invisible <Link> overlay so that clicking
 * anywhere navigates to the surf zone’s detail page.
 *
 * @param {Object} props
 * @param {Object} props.surfzone - The surf zone object containing metadata.
 * @param {string} props.surfzone.name - Name of the surf zone.
 * @param {Object[]} [props.surfzone.zone_images] - Array of image objects for the zone.
 * @param {string} props.surfzone.zone_images[].image - URL of a zone image.
 * @param {Object} props.surfzone.country - Country information for the zone.
 * @param {string} props.surfzone.country.name - Name of the country.
 *
 * @returns {JSX.Element} A styled card with a background image, overlay text,
 *                        and an invisible link that covers the entire card.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';
import Link from 'next/link';

// ============================
// SurfZoneCard Component
// ============================
export default function SurfZoneCard({ surfzone }) {
  return (
    <div className="bg-black rounded-lg relative overflow-hidden group flex items-center justify-center max-w-lg h-64">
      {/*
        Invisible link overlay:
        Clicking anywhere on the card navigates to `/surfzones/[zoneName]`.
      */}
      <Link href={`/surfzones/${encodeURIComponent(surfzone.name)}`} legacyBehavior>
        <a className="absolute inset-0 z-10" />
      </Link>

      {/*
        If the surf zone has at least one image, render it as the card background.
        The image zooms slightly on hover.
      */}
      {surfzone.zone_images?.length > 0 && (
        <img
          src={surfzone.zone_images[0].image}
          alt={surfzone.name}
          className="inset-0 w-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-125"
        />
      )}

      {/*
        Semi-transparent overlay that holds the zone name and country.
        Text remains readable against the background image.
      */}
      <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center p-4 transform transition-transform duration-500 group-hover:scale-150">
        <h2 className="text-white text-2xl font-bold text-center text-shadow-md">
          {surfzone.name}
        </h2>
        <div className="mt-2 text-lg text-white text-center font-semibold text-shadow-lg">
          {surfzone.country.name}
        </div>
      </div>
    </div>
  );
}
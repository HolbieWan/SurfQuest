'use client';

import React, {use} from 'react';
// import { useRouter } from "next/navigation"; // Optional router if redirection is needed
import SurfZoneDetails from '@/components/SurfZones/SurfZoneDetails';

/**
 * Page component to display details for a selected surf zone.
 * Receives zone data via `params`, typically passed through routing context.
 *
 * @param {Object} params - Route parameters containing surfzone data.
 * @returns {JSX.Element} - The Surf Zone detail page.
 */
export default function SurfZonePage({ params }) {
  // Extract the surfzone data from params (passed via dynamic route)
  const surfzone =  use(params)?.surfzone;

  // Debug: Log the currently selected surf zone (optional in development)
  console.log('Selected Surf Zone:', surfzone);

  // If no valid surf zone is found, show a user-friendly error
  if (!surfzone) {
    return <p className="text-red-500 text-sm">Invalid Surf Zone</p>;
  }

  // Display the surf zone details using the SurfZoneDetails component
  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-screen bg-black text-white">
      <SurfZoneDetails selectedSurfZone={surfzone} />
    </div>
  );
}
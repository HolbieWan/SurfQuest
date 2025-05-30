// src/app/surfspots/[surfspot]/page.js

'use client';

/**
 * SurfSpotDetailsPage Component
 * -----------------------------
 * Displays detailed information for a selected surf spot.
 * - Fetches all surf spots via surfspotService.
 * - Finds the one matching the URL parameter.
 * - Renders the SurfSpotDetails component.
 * - Provides a dropdown to switch between surf spots.
 * - Includes a back-link to the surf spot search page.
 *
 * @returns {JSX.Element}
 */

// ============================
// External Dependencies
// ============================
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

// ============================
// Local Dependencies
// ============================
import SurfSpotDetails from '@/components/SurfSpots/SurfSpotDetails';
import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfSpots } from '@/utils/surfspotUtils';
import API_BASE_URLS from '@/config/api';

export default function SurfSpotDetailsPage() {
  // ============================
  // Router & URL Parameter
  // ============================
  const { surfspot } = useParams();
  const decodedSurfSpot = decodeURIComponent(surfspot || '');
  const router = useRouter();

  // ============================
  // State Management
  // ============================
  const [allSpots, setAllSpots] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(decodedSurfSpot);
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================
  // Fetch Spots on Mount / Param Change
  // ============================
  useEffect(() => {
    const loadSpots = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('access_token');
        const spots = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setAllSpots(spots);

        // Derive unique spot names for dropdown
        setUniqueNames(getUniqueSurfSpots(spots));

        // Find and set the currently selected spot's data
        const match = spots.find(s => s.name === decodedSurfSpot);
        setSpotData(match || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [decodedSurfSpot]);

  // ============================
  // Handle Dropdown Change
  // ============================
  const handleSpotChange = (e) => {
    const newSpot = e.target.value;
    setSelectedSpot(newSpot);
    // Navigate to the new spot's page
    router.push(`/surfspots/${encodeURIComponent(newSpot)}`);
  };

  // ============================
  // Render States
  // ============================
  if (loading) {
    return <div className="text-white text-center mt-10">Loading surf spot...</div>;
  }
  if (error || !spotData) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error: {error || 'Surf spot not found.'}
      </div>
    );
  }

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center pt-10 min-h-screen bg-black text-white">
      {/* Back Link */}
      <div className="w-full flex justify-start mb-6">
        <div className="ml-10">
          <Link href="/surfspots">
            <h2 className="text-gray-500 text-lg hover:text-gray-300 hover:scale-105">
              👈🏻 Back to surf-spot search page
            </h2>
          </Link>
        </div>
      </div>

      {/* Surf Spot Selector */}
      <div className="w-full flex justify-center mb-8">
        <select
          className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[240px] hover:scale-105"
          value={selectedSpot}
          onChange={handleSpotChange}
        >
          {uniqueNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Spot Details */}
      <SurfSpotDetails surfSpotData={spotData} />
    </div>
  );
}
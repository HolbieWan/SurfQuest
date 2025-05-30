'use client';

/**
 * SurfZone Details Page Component for SurfQuest
 *
 * Fetches and displays detailed information about a selected surf zone:
 * - Zone info (description, nearest city/airport, etc.)
 * - Image gallery
 * - Monthly surf conditions
 * - Windy.com forecast
 * - List of popular surf spots
 * - Reviews (display and submission)
 *
 * Delegates API interactions to surfspotService and surfzoneUtils,
 * and composes smaller presentational components for clarity.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

// ============================
// Presentational Components
// ============================
import InfoCard from '@/components/SurfZones/InfoCard';
import ImageGallery from '@/components/SurfZones/ImageGallery';
import ConditionsSection from '@/components/SurfZones/ConditionsSection';
import SurfZoneForecast from '@/components/SurfZones/SurfZoneForecast/SurfZoneForecastCardWindy';
import SurfSpotsList from '@/components/SurfZones/ZoneSurfSpotsList';
import ReviewsSection from '@/components/SurfZones/ReviewsSection';

// ============================
// Services & Utilities
// ============================
import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfZones, filterSpotsByZone } from '@/utils/surfzoneUtils';
import API_BASE_URLS from '@/config/api';

// ============================
// Constants
// ============================
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Main SurfZone Details Page
 *
 * @component
 * @returns {JSX.Element}
 */
function SurfZoneDetailsPage() {
  // Retrieve the surfzone slug from the URL
  const { surfzone } = useParams();
  const decoded = decodeURIComponent(surfzone || '');

  // ============================
  // Component State
  // ============================
  const [spots, setSpots] = useState([]);       // All surf spots from API
  const [zone, setZone] = useState(decoded);    // Currently selected zone name
  const [month, setMonth] = useState(months[new Date().getMonth()]); // Filter month
  const [err, setErr] = useState('');           // Error message
  const [loading, setLoading] = useState(false);// Loading flag

  // ============================
  // Data Fetching Effect
  // ============================
  useEffect(() => {
    if (!decoded) return;

    (async () => {
      setLoading(true);
      setErr('');
      try {
        const token = Cookies.get('access_token');
        const data = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setSpots(data);
      } catch (e) {
        setErr(e.message || 'Failed to load surf spots');
      } finally {
        setLoading(false);
      }
    })();
  }, [decoded]);

  // ============================
  // Data Derivation
  // ============================
  const zones = getUniqueSurfZones(spots);                  // Unique zone names
  const filtered = filterSpotsByZone(spots, zone);         // Spots in selected zone
  const current = filtered[0] || {};                        // First spot as representative
  const cond = current.surfzone?.conditions?.find(c => c.month === month);
  const images = current.surfzone?.zone_images?.slice(0, 2) || [];
  const id = current.surfzone?.id;

  // ============================
  // Render States
  // ============================
  if (loading) return <p className="text-blue-500">Loading…</p>;
  if (err)     return <p className="text-red-500">{err}</p>;

  // ============================
  // JSX Output
  // ============================
  return (
    <>
      {/* Back Link */}
      <div className="w-full flex justify-start mb-6">
        <div className="ml-20">
          <Link href="/surfzones">
            <h2 className="text-gray-500 text-lg hover:text-gray-300 hover:scale-105">
              👈🏻 Back to surf-zone search page
            </h2>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pt-10 min-h-screen bg-black text-white">
        {/* Zone Selector */}
        <select
          className=" p-2 mb-8 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] hover:scale-105"
          value={zone}
          onChange={e => setZone(e.target.value)}
        >
          <option value="">Select Surf-zone</option>
          {zones.sort().map((z, i) => (
            <option key={i} value={z}>{z}</option>
          ))}
        </select>

        {/* Zone Details & Subsections */}
        {zone && current.surfzone && (
          <>
            {/* Zone Title */}
            <h1 className="text-white text-4xl font-bold text-center my-6">
              {current.surfzone.name}
            </h1>

            {/* Info & Images Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <InfoCard spot={current} />
              <ImageGallery images={images} alt={current.surfzone.name} />
            </div>

            {/* Monthly Conditions */}
            <ConditionsSection
              selectedMonth={month}
              onMonthChange={setMonth}
              condition={cond}
            />

            {/* Forecast */}
            <h2 className="text-white text-4xl font-bold text-center my-6">
              {current.surfzone.name} Surf Forecast
            </h2>
            <SurfZoneForecast selectedSurfZone={zone} />

            {/* Surf Spots List */}
            <SurfSpotsList spots={filtered} zoneName={zone} />

            {/* Reviews Section */}
            <ReviewsSection zoneName={zone} zoneId={id} />
          </>
        )}
      </div>
    </>
  );
}

/**
 * Page Wrapper with Suspense Fallback
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SurfZoneDetailsPage />
    </Suspense>
  );
}
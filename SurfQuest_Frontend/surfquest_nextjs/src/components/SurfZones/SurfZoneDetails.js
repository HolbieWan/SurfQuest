'use client';

/**
 * SurfZone Details Page – Refactored
 *
 * Displays detailed information, conditions, forecast, surf spots, and reviews for a selected surf zone.
 * Fetches surf spot data and filters based on the selected zone and month.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

// External Components
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
import SurfZoneForecast from '@/components/SurfZones/SurfZoneForecast/SurfZoneForecastCardWindy';
import Reviews from '@/components/Reviews/Reviews';

// Services and Utilities
import API_BASE_URLS from '@/config/api';
import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfZones, filterSpotsByZone } from '@/utils/surfzoneUtils';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function SurfZoneDetailsPage() {
  const { surfzone } = useParams();
  const decodedSurfZone = decodeURIComponent(surfzone || '');

  const [surfSpots, setSurfSpots] = useState([]);
  const [selectedSurfZone, setSelectedSurfZone] = useState(decodedSurfZone);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await (fetchSurfSpots);
        setSurfSpots(data);
      } catch (err) {
        setError(`Failed to load surf spots: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const uniqueSurfZones = getUniqueSurfZones(surfSpots);
  const filteredSpots = filterSpotsByZone(surfSpots, selectedSurfZone);
  const currentSpot = filteredSpots[0];
  const monthCondition = currentSpot?.surfzone?.conditions?.find(c => c.month === selectedMonth);
  const surfZoneImages = currentSpot?.surfzone?.zone_images?.slice(0, 2) || [];
  const surfZoneId = currentSpot?.surfzone?.id || '';

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <Link href="/surfzones">
        <h2 className="text-gray-500 text-lg hover:text-gray-300">👈🏻 Back to surf-zone search page</h2>
      </Link>

      {/* Surfzone Selector */}
      <div className="my-6">
        <select
          className="p-2 bg-blue-500 text-white rounded min-w-[200px]"
          value={selectedSurfZone}
          onChange={(e) => setSelectedSurfZone(e.target.value)}
        >
          <option value="">Select Surf-zone</option>
          {uniqueSurfZones.sort().map((zone, i) => (
            <option key={i} value={zone}>{zone}</option>
          ))}
        </select>
      </div>

      {/* Surfzone Details */}
      {selectedSurfZone && currentSpot && (
        <>
          <h1 className="text-4xl font-bold text-center my-6">{currentSpot.surfzone.name}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Info Card */}
            <div className="bg-white text-black rounded p-6">
              <p>{currentSpot.surfzone.description}</p>
              <p><strong>Nearest City:</strong> {currentSpot.surfzone.nearest_city}</p>
              <p><strong>Airport:</strong> {currentSpot.surfzone.nearest_airport}</p>
              {/* Add more fields as needed */}
            </div>

            {/* Image Card */}
            <div className="flex flex-col gap-4">
              {surfZoneImages.map((img, i) => (
                <img key={i} src={img.image} alt={currentSpot.surfzone.name} className="rounded-lg w-full h-64 object-cover" />
              ))}
            </div>
          </div>

          {/* Monthly Conditions */}
          <div className="my-10">
            <h2 className="text-2xl font-bold mb-4">Surf Conditions</h2>
            <select
              className="p-2 bg-pink-500 text-white rounded mb-4"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
            {monthCondition && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-400 p-4 rounded">Water Temp: {monthCondition.water_temp_c}°C</div>
                <div className="bg-green-400 p-4 rounded">Air Temp: {monthCondition.min_air_temp_c}°C - {monthCondition.max_air_temp_c}°C</div>
                <div className="bg-orange-400 p-4 rounded">Wind: {monthCondition.wind_direction} {monthCondition.wind_force}</div>
              </div>
            )}
          </div>

          {/* Surf Forecast */}
          <div className="my-10">
            <h2 className="text-2xl font-bold mb-4">{currentSpot.surfzone.name} Surf Forecast</h2>
            <SurfZoneForecast selectedSurfZone={selectedSurfZone} />
          </div>

          {/* SurfSpots List */}
          <div className="my-10">
            <h2 className="text-2xl font-bold mb-4">Popular Surf Spots</h2>
            <div className="grid grid-cols-1 gap-6">
              {filteredSpots.map((spot) => (
                <SurfSpotCard key={spot.id} surfspot={spot} />
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="my-10">
            <Reviews selectedSurfZone={selectedSurfZone} surfZoneId={surfZoneId} />
          </div>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurfZoneDetailsPage />
    </Suspense>
  );
}
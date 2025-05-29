'use client'; // Enables React client features like useState and useEffect

/**
 * MonthBestDestinations Component
 *
 * This component displays a grid of surf zones that are recommended
 * for the current month. It fetches data from the backend using a
 * dedicated service and filters the list based on best months.
 *
 * Dependencies:
 * - React (useState, useEffect)
 * - fetchSurfZones: API call to retrieve surf zone data
 * - PulsingHeaderLink: Decorative animated header
 * - SurfZoneCard: UI component for displaying a surf zone card
 */

import React, { useState, useEffect } from 'react';
import { fetchSurfZones } from '@/services/surfzoneService';
import PulsingHeaderLink from '@/components/HomePage/PulsingHeaderLink';
import SurfZoneCard from '@/components/SurfZones/SurfZoneCard';

export default function MonthBestDestinations() {
  // ======== State Management ========
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // ======== Get Current Month Name ========
  const currentMonthIndex = new Date().getMonth(); // 0-11
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[currentMonthIndex];

  // ======== Fetch and Filter Surf Zones on Mount ========
  useEffect(() => {
    const getData = async () => {
      setError('');
      setLoading(true);

      try {
        // Fetch all surf zones from the API
        const data = await fetchSurfZones();

        // Filter zones based on current month
        const filtered = data.filter(zone =>
          zone.best_months.includes(currentMonth)
        );

        setResponseData(filtered);
      } catch (err) {
        setError(err.message || 'Failed to load surf zones.');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // ======== Render UI ========
  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <PulsingHeaderLink />

      {responseData && (
        <h2 className="text-4xl font-bold mt-12 mb-4 text-left">
          Where to go in <span className="text-blue-300">{currentMonth}</span>?
        </h2>
      )}

      {error && (
        <p className="text-gray-500 text-md text-center">
          Please sign-up / log-in to have access to all features.
        </p>
      )}

      {loading && (
        <p className="text-blue-500 text-sm">Loading...</p>
      )}

      {responseData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2 gap-4 rounded-md">
          {responseData.map((surfzone, index) => (
            <SurfZoneCard key={index} surfzone={surfzone} />
          ))}
        </div>
      )}
    </div>
  );
}
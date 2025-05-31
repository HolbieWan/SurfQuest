'use client'; // Enables React hooks and client-side rendering capabilities

/**
 * MonthBestDestinations Component
 * -------------------------------
 * Displays a curated list of surf zones that are ideal for the current month.
 * 
 * Workflow:
 * 1. Determine the current month.
 * 2. Fetch all surf zones via the `fetchSurfZones` service.
 * 3. Filter the fetched zones to include only those whose `best_months` array
 *    contains the current month.
 * 4. Render an animated header followed by a grid of matching surf zone cards.
 * 
 * Dependencies:
 * - React (useState, useEffect)
 * - fetchSurfZones: Service function that returns an array of surf zone objects.
 * - PulsingHeaderLink: Decorative header that animates to draw user attention.
 * - SurfZoneCard: Component responsible for rendering individual surf zone details.
 */

import React, { useState, useEffect } from 'react';
import { fetchSurfZones } from '@/services/surfzoneService';
import PulsingHeaderLink from '@/components/HomePage/PulsingHeaderLink';
import SurfZoneCard from '@/components/SurfZones/SurfZoneCard';

export default function MonthBestDestinations() {
  // ============================
  // State Management
  // ============================
  // Holds any error message encountered during data fetching
  const [error, setError] = useState('');
  // Controls whether data is currently being loaded
  const [loading, setLoading] = useState(false);
  // Stores the filtered list of surf zones for the current month
  const [responseData, setResponseData] = useState(null);

  // ============================
  // Determine Current Month
  // ============================
  // JavaScript's getMonth() returns 0 for January, 1 for February, etc.
  const currentMonthIndex = new Date().getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Convert index to human-readable month name
  const currentMonth = monthNames[currentMonthIndex];

  // ============================
  // Fetch & Filter Surf Zones on Component Mount
  // ============================
  useEffect(() => {
    /**
     * Asynchronously fetches all surf zones via the service and filters
     * them based on whether their `best_months` array includes the current month.
     */
    const getData = async () => {
      setError('');      // Clear any previous error
      setLoading(true);  // Show loading indicator

      try {
        // Retrieve full list of surf zones from backend
        const data = await fetchSurfZones();

        // Filter the zones to include only those ideal for the current month
        const filtered = data.filter((zone) =>
          Array.isArray(zone.best_months) && zone.best_months.includes(currentMonth)
        );

        setResponseData(filtered);
      } catch (err) {
        // Capture any fetch/processing errors
        setError(err.message || 'Failed to load surf zones.');
      } finally {
        // Always hide loading indicator after attempt
        setLoading(false);
      }
    };

    getData();
  }, []); // Empty dependency array: run once on initial mount

  // ============================
  // Render UI
  // ============================
  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      {/* Animated header encouraging users to explore monthly destinations */}
      <PulsingHeaderLink />

      {/* Header showing current month only after data has been fetched */}
      {responseData && (
        <h2 className="text-4xl text-center font-bold mt-12 mb-4 w-full px-4">
          Where to go in <span className="text-blue-300">{currentMonth}</span>?
        </h2>
      )}

      {/* Display error message if data fetching failed */}
      {error && (
        <p className="text-gray-500 text-md text-center px-4">
          Please{' '}
          <a href="/signup" className="text-blue-400 hover:text-blue-600">
            sign up
          </a>{' '}
          or{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-600">
            log in
          </a>{' '}
          to have access to all features.
        </p>
      )}

      {/* Show loading indicator while fetching */}
      {loading && (
        <p className="text-blue-500 text-sm mt-4">Loading...</p>
      )}

      {/* Render grid of surf zones when data is available */}
      {responseData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4 rounded-md w-full">
          {responseData.map((surfzone, index) => (
            <SurfZoneCard key={index} surfzone={surfzone} />
          ))}
        </div>
      )}
    </div>
  );
}
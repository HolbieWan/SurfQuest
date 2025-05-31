// src/app/surfspots/page.js

'use client';

/**
 * SearchSurfSpotsPage Component
 * -----------------------------
 * Provides a searchable/filterable interface for surf spots.
 * Fetches all surf spots via the surfspotService, derives unique
 * lists for spot names and zones, and applies a shared filtering
 * utility to drive the UI. Results smoothly scroll into view upon
 * filter changes. Selecting a surf-spot navigates to its details page.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams, useRouter } from 'next/navigation';

// ============================
// Local Dependencies
// ============================
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfZones, getUniqueSurfSpots } from '@/utils/surfspotUtils';
import API_BASE_URLS from '@/config/api';
import { applySurfSpotFilters } from '@/utils/spotFilters';
import * as opts from '@/utils/spotsFilterOption';
import FiltersGrid from '@/components/SurfSpots/FiltersGrid';

export default function SearchSurfSpotsPage() {
  // ============================
  // Router Hook & Search Params
  // ============================
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================
  // Refs
  // ============================
  const resultsRef = useRef(null);

  // ============================
  // State Management
  // ============================
  const [hydrated, setHydrated] = useState(false);
  const [spots, setSpots] = useState([]);
  const [uniqueZones, setUniqueZones] = useState([]);
  const [uniqueSpots, setUniqueSpots] = useState([]);
  const [filters, setFilters] = useState({
    surfSpot: '',
    surfZone: '',
    breakType: '',
    waveDirection: '',
    surfLevel: '',
    bestTide: '',
    bestSwellSize: '',
    bestWindDirection: '',
    bestSwellDirection: '',
    bestMonth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============================
  // Hydration & Data Fetch
  // ============================
  useEffect(() => {
    setHydrated(true);
    const loadSpots = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('access_token');
        const data = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setSpots(data);
        setUniqueZones(getUniqueSurfZones(data));
        setUniqueSpots(getUniqueSurfSpots(data));

        // Initialize surfSpot filter from URL param if present
        const param = searchParams.get('surfspot');
        if (param) {
          setFilters(f => ({ ...f, surfSpot: param }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [searchParams]);

  // Avoid SSR mismatch
  if (!hydrated) return null;

  // ============================
  // Apply Shared Filtering Utility
  // ============================
  const filteredSpots = applySurfSpotFilters(
    spots,
    {
      name:      filters.surfSpot,
      zone:      filters.surfZone,
      breakType: filters.breakType,
      waveDir:   filters.waveDirection,
      level:     filters.surfLevel,
      tide:      filters.bestTide,
      swellSize: filters.bestSwellSize,
      windDir:   filters.bestWindDirection,
      swellDir:  filters.bestSwellDirection,
      month:     filters.bestMonth,
    },
    { swellSizeRanges: opts.swellSizeRanges }
  );

  // ============================
  // Handlers
  // ============================

  /**
   * Handles changes to any filter input.
   * - For non-spot filters, scrolls results into view.
   * - For surfSpot selection, navigates to the detail page.
   *
   * @param {string} key - The filter key in state.
   * @returns {Function}
   */
  const onFilterChange = (key) => (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, [key]: value }));

    if (key === 'surfSpot' && value) {
      router.push(`/surfspots/${encodeURIComponent(value)}`);
    } else if (key !== 'surfSpot') {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  /**
   * Resets all filter values to their defaults (empty strings).
   */
  const resetAll = () => {
    setFilters({
      surfSpot: '', surfZone: '', breakType: '', waveDirection: '',
      surfLevel: '', bestTide: '', bestSwellSize: '',
      bestWindDirection: '', bestSwellDirection: '', bestMonth: '',
    });
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-black text-white">

      {/* Filters Section (shown when no spot is selected) */}
      {!filters.surfSpot && (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center">
            Find the best spots for <span className="text-blue-500">you</span> 😎
          </h1>

          {Cookies.get('access_token') ? (
            <>
              {/* Error / Loading feedback */}
              { loading && (<p className="text-blue-500 text-center mt-10">Loading...</p>) }
              { error && (<p className="text-red-500 text-center mt-10">{error}</p>)}

              <FiltersGrid
                uniqueSpots={uniqueSpots}
                uniqueZone={uniqueZones}
                filters={filters}
                onFilterChange={onFilterChange}
                options={opts}
              />
              <button
                className="mt-8 mb-12 p-2 border border-red-500 rounded text-red-500 hover:scale-105"
                onClick={resetAll}
              >
                Reset Selection
              </button>
            </>
          ) : (
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
        </>
      )}

      {/* Results Section */}
      <div ref={resultsRef} className="w-full px-4">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {filteredSpots.map(spot => (
            <SurfSpotCard key={spot.id} surfspot={spot} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense for safety
export function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchSurfSpotsPage />
    </Suspense>
  );
}
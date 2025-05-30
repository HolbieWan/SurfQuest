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
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('access_token');
        const data = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setSpots(data);
        setUniqueZones(getUniqueSurfZones(data));
        setUniqueSpots(getUniqueSurfSpots(data));
        const param = searchParams.get('surfspot');
        if (param) setFilters(f => ({ ...f, surfSpot: param }));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  if (!hydrated) return null;
  if (loading)   return <p className="text-blue-500 text-center mt-10">Loading...</p>;
  if (error)     return <p className="text-red-500 text-center mt-10">{error}</p>;

  // ============================
  // Apply Shared Filtering Utility
  // ============================
  const filtered = applySurfSpotFilters(
    spots,
    {
      name:        filters.surfSpot,
      breakType:   filters.breakType,
      waveDir:     filters.waveDirection,
      level:       filters.surfLevel,
      tide:        filters.bestTide,
      swellSize:   filters.bestSwellSize,
      windDir:     filters.bestWindDirection,
      swellDir:    filters.bestSwellDirection,
      month:       filters.bestMonth,
    },
    { swellSizeRanges: opts.swellSizeRanges }
  );

  // ============================
  // Handlers
  // ============================
  const onFilterChange = (key) => (e) => {
    const val = e.target.value;
    setFilters(f => ({ ...f, [key]: val }));
    if (key !== 'surfSpot') {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (val) {
      router.push(`/surfspots/${encodeURIComponent(val)}`);
    }
  };

  const resetAll = () => {
    setFilters({
      surfSpot: '', breakType: '', waveDirection: '',
      surfLevel: '', bestTide: '', bestSwellSize: '',
      bestWindDirection: '', bestSwellDirection: '', bestMonth: '',
    });
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-black text-white">
      {!filters.surfSpot && (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center">
            Find the best spots for <span className="text-blue-500">you</span> 😎
          </h1>

          {Cookies.get('access_token') ? (
            <>
              <FiltersGrid
                uniqueSpots={uniqueSpots}
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
            <p className="text-gray-500 text-center">
              Please log in to enjoy surf-spot search features
            </p>
          )}
        </>
      )}

      <div ref={resultsRef} className="w-full px-4">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {filtered.map(spot => (
            <SurfSpotCard key={spot.id} surfspot={spot} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchSurfSpotsPage />
    </Suspense>
  );
}
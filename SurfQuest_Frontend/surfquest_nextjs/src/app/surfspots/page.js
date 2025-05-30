// src/app/surfspots/page.js
'use client';

/**
 * SearchSurfSpotsPage Component
 * -----------------------------
 * Provides a searchable/filterable interface for surf spots.
 * Fetches all surf spots via the surfspotService, derives unique
 * lists for zones and spot names, and allows filtering by various criteria.
 * Results smoothly scroll into view upon filter changes.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ============================
// Local Dependencies
// ============================
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfZones, getUniqueSurfSpots } from '@/utils/surfspotUtils';
import API_BASE_URLS from '@/config/api';

export default function SearchSurfSpotsPage() {
  // ============================
  // Router Hook
  // ============================
  const router = useRouter();
  // ============================
  // State Management
  // ============================
  const [hydrated, setHydrated] = useState(false);
  const [surfSpots, setSurfSpots] = useState([]);
  const [uniqueZones, setUniqueZones] = useState([]);
  const [uniqueSpots, setUniqueSpots] = useState([]);
  const [selectedSurfSpot, setSelectedSurfSpot] = useState('');
  const [selectedBreakType, setSelectedBreakType] = useState('');
  const [selectedWaveDirection, setSelectedWaveDirection] = useState('');
  const [selectedSurfLevel, setSelectedSurfLevel] = useState('');
  const [selectedBestTide, setSelectedBestTide] = useState('');
  const [selectedBestSwellSize, setSelectedBestSwellSize] = useState('');
  const [selectedBestWindDirection, setSelectedBestWindDirection] = useState('');
  const [selectedBestSwellDirection, setSelectedBestSwellDirection] = useState('');
  const [selectedBestMonths, setSelectedBestMonths] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const resultsRef = useRef(null);

  // ============================
  // Static Filter Options
  // ============================
  const breakTypeList = ['Beach break', 'Reef break', 'Point break', 'River-mouth', 'Slab'];
  const waveDirectionList = ['Left', 'Right', 'Left and right'];
  const windDirectionList = ['N','N-NE','NE','E-NE','E','E-SE','SE','S-SE','S','S-SW','SW','W-SW','W','W-NW','NW','N-NW'];
  const swellDirectionList = windDirectionList;
  const swellSizeList = ["Under 1m","1m - 1.5m","1.5m - 2m","2m - 3m","Over 3m"];
  const swellSizeRanges = {
    "Under 1m": { min: 0, max: 1 },
    "1m - 1.5m": { min: 1.1, max: 1.5 },
    "1.5m - 2m": { min: 1.6, max: 2 },
    "2m - 3m": { min: 2.1, max: 3 },
    "Over 3m": { min: 3.1, max: 30 },
  };
  const surfLevelList = ['Beginner','Intermediate','Advanced','Pro'];
  const bestTideList = ['Low','Mid','High'];
  const monthList = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // ============================
  // Data Fetch & Initialization
  // ============================
  useEffect(() => {
    setHydrated(true);
    const loadSpots = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('access_token');
        const data = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setSurfSpots(data);
        setUniqueZones(getUniqueSurfZones(data));
        setUniqueSpots(getUniqueSurfSpots(data));
        const paramSpot = searchParams.get('surfspot');
        if (paramSpot) setSelectedSurfSpot(paramSpot);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSpots();
  }, [searchParams]);

  if (!hydrated) return null;
  if (loading)   return <p className="text-blue-500 text-center mt-10">Loading...</p>;
  if (error)     return <p className="text-red-500 text-center mt-10">{error}</p>;

  // ============================
  // Filtering Logic
  // ============================
  const filteredSurfSpots = surfSpots
    .filter(s => !selectedSurfSpot || s.name === selectedSurfSpot)
    .filter(s => !selectedBreakType || s.break_type === selectedBreakType)
    .filter(s => !selectedWaveDirection || s.wave_direction === selectedWaveDirection)
    .filter(s => !selectedSurfLevel || s.surf_level.includes(selectedSurfLevel))
    .filter(s => !selectedBestTide || s.best_tide.includes(selectedBestTide))
    .filter(s => {
      if (!selectedBestSwellSize) return true;
      const { min, max } = swellSizeRanges[selectedBestSwellSize];
      return s.best_swell_size_meter >= min && s.best_swell_size_meter <= max;
    })
    .filter(s => !selectedBestWindDirection || s.best_wind_direction === selectedBestWindDirection)
    .filter(s => !selectedBestSwellDirection || s.best_swell_direction === selectedBestSwellDirection)
    .filter(s => !selectedBestMonths || s.best_months.includes(selectedBestMonths));

  // ============================
  // Helpers
  // ============================
  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleReset = () => {
    setSelectedSurfSpot('');
    setSelectedBreakType('');
    setSelectedWaveDirection('');
    setSelectedSurfLevel('');
    setSelectedBestTide('');
    setSelectedBestSwellSize('');
    setSelectedBestWindDirection('');
    setSelectedBestSwellDirection('');
    setSelectedBestMonths('');
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-black text-white">
      {!selectedSurfSpot && (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center">
            Find the best spots for <span className="text-blue-500">you</span> 😎
          </h1>

          {Cookies.get('access_token') ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4 gap-3">
                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedSurfSpot}
                  onChange={e => {
                    const spot = e.target.value;
                    setSelectedSurfSpot(spot);
                    if (spot) {
                      // navigate to the detail page
                      router.push(`/surfspots/${encodeURIComponent(spot)}`);
                    }
                  }}
                >
                  <option value="">View all surf-spots</option>
                  {uniqueSpots.sort().map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBreakType}
                  onChange={e => { setSelectedBreakType(e.target.value); scrollToResults(); }}
                >
                  <option value="">Break Type</option>
                  {breakTypeList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedWaveDirection}
                  onChange={e => { setSelectedWaveDirection(e.target.value); scrollToResults(); }}
                >
                  <option value="">Wave Direction</option>
                  {waveDirectionList.map(w => <option key={w} value={w}>{w}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedSurfLevel}
                  onChange={e => { setSelectedSurfLevel(e.target.value); scrollToResults(); }}
                >
                  <option value="">Surf Level</option>
                  {surfLevelList.map(l => <option key={l} value={l}>{l}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBestTide}
                  onChange={e => { setSelectedBestTide(e.target.value); scrollToResults(); }}
                >
                  <option value="">Best Tide</option>
                  {bestTideList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBestSwellSize}
                  onChange={e => { setSelectedBestSwellSize(e.target.value); scrollToResults(); }}
                >
                  <option value="">Best Swell Size</option>
                  {swellSizeList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBestWindDirection}
                  onChange={e => { setSelectedBestWindDirection(e.target.value); scrollToResults(); }}
                >
                  <option value="">Best Wind Direction</option>
                  {windDirectionList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBestSwellDirection}
                  onChange={e => { setSelectedBestSwellDirection(e.target.value); scrollToResults(); }}
                >
                  <option value="">Best Swell Direction</option>
                  {swellDirectionList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                  className="p-2 bg-blue-500 text-white rounded min-w-[210px] hover:scale-105"
                  value={selectedBestMonths}
                  onChange={e => setSelectedBestMonths(e.target.value)}
                >
                  <option value="">Best Months</option>
                  {monthList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <button
                className="mt-8 mb-12 p-2 border border-red-500 rounded text-red-500 hover:scale-105"
                onClick={handleReset}
              >
                Reset Selection
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-center">Please log in to enjoy surf spot search features</p>
          )}
        </>
      )}

      <div ref={resultsRef} className="w-full px-4">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {filteredSurfSpots.map(spot => (
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
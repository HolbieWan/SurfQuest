'use client';

/**
 * SurfQuest - SearchSurfZonePage
 *
 * This page displays all surf zones and allows users to filter them
 * based on general preferences (e.g. country, cost) and seasonal conditions
 * (e.g. water temperature, swell size). Filtering features are only available
 * to authenticated users. Unauthenticated users will see a message inviting
 * them to log in to use these features.
 */

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { fetchSurfZones } from '@/services/surfzoneService';
import { applySurfZoneFilters } from '@/utils/filters';

import SurfZoneCard from '@/components/SurfZones/SurfZoneCard';
import BasicFiltersGrid from '@/components/SurfZones/BasicFiltersGrid';
import AdvancedFiltersGrid from '@/components/SurfZones/AdvancedFiltersGrid';

import {
  months,
  travelerType,
  safety,
  comfort,
  mainWaveDirection,
  cost,
  waterTempRanges,
  swellSizeRanges,
  crowdFactorRanges,
  sunnyDaysRanges,
  rainyDaysRanges,
} from '@/utils/filterOptions';

export default function SearchSurfZonePage() {
  /**
   * Determines if the user is authenticated by checking for an access token in cookies.
   */
  const isAuthenticated = !!Cookies.get('access_token');

  // Prevent hydration mismatch during SSR
  const [hydrated, setHydrated] = useState(false);

  // Surf zone data and UI state
  const [surfZones, setSurfZones] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter state for user input
  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    travelerType: '',
    safety: '',
    comfort: '',
    mainWaveDirection: '',
    surfLevel: '',
    cost: '',
    waterTemp: '',
    surfRating: '',
    swellSize: '',
    crowdFactor: '',
    sunnyDays: '',
    rainyDays: '',
  });

  // UI toggles for filter sections
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Refs for scrolling
  const resultsRef = useRef(null);
  const monthSelectorsRef = useRef(null);

  // Range mappings for advanced numerical filters
  const conditionRanges = {
    waterTemp: waterTempRanges,
    swellSize: swellSizeRanges,
    crowdFactor: crowdFactorRanges,
    sunnyDays: sunnyDaysRanges,
    rainyDays: rainyDaysRanges,
  };

  // Load surf zones on mount
  useEffect(() => {
    setHydrated(true);
    const loadSurfZones = async () => {
      setLoading(true);
      try {
        const data = await fetchSurfZones();
        setSurfZones(data);
        const uniqueCountries = [...new Set(data.map((zone) => zone.country.name))];
        setCountries(uniqueCountries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSurfZones();
  }, []);

  // Avoid SSR rendering issues
  if (!hydrated) return null;

  /**
   * Scrolls to the surf zone results section.
   */
  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /**
   * Scrolls to the month filter when a new month is selected.
   */
  const scrollToMonthFilters = () => {
    setTimeout(() => monthSelectorsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /**
   * Updates the filter state and triggers scroll actions.
   * @param {string} key - The filter key to update.
   * @param {string} value - The new value to assign.
   */
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    key === 'month' ? scrollToMonthFilters() : scrollToResults();
  };

  /**
   * Resets all filters to default empty state.
   */
  const handleReset = () => {
    setSelectedFilters({
      country: '',
      month: '',
      travelerType: '',
      safety: '',
      comfort: '',
      mainWaveDirection: '',
      surfLevel: '',
      cost: '',
      waterTemp: '',
      surfRating: '',
      swellSize: '',
      crowdFactor: '',
      sunnyDays: '',
      rainyDays: '',
    });
  };

  /**
   * Filters the surf zones based on selected criteria.
   */
  const filteredSurfZones = applySurfZoneFilters(surfZones, selectedFilters, conditionRanges);

  /**
   * Responsive grid column class based on number of results.
   */
  const gridColsClass =
    filteredSurfZones.length === 1
      ? 'grid-cols-1'
      : filteredSurfZones.length === 2
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white rounded-lg">
      <h1 className="text-4xl text-center font-bold mb-8">
        Find the best destination for <span className="text-blue-500">you</span> 😎
      </h1>

      {isAuthenticated ? (
        <>
          {/* Error / Loading feedback */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {loading && <p className="text-blue-500 text-sm">Loading...</p>}

          {/* Basic filter options */}
          <BasicFiltersGrid
            selectedFilters={selectedFilters}
            countries={countries}
            travelerType={travelerType}
            safety={safety}
            comfort={comfort}
            cost={cost}
            mainWaveDirection={mainWaveDirection}
            handleFilterChange={handleFilterChange}
            scrollToResults={scrollToResults}
          />

          {/* Seasonal filter toggles and selectors */}
          <div ref={monthSelectorsRef} className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">
            <button
              className="p-2 mb-4 bg-gray-700 text-white rounded"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide seasonal Filters ▲' : 'Show seasonal Filters ▼'}
            </button>

            {showAdvancedFilters && (
              <>
                <select
                  className="p-2 border border-black rounded bg-pink-500 text-white text-center w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedFilters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                >
                  <option value="">Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm">(Select a month to apply below filters)</p>
              </>
            )}
          </div>

          {/* Advanced filter section */}
          {showAdvancedFilters && (
            <AdvancedFiltersGrid
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              showAdvancedFilters={showAdvancedFilters}
              setShowAdvancedFilters={setShowAdvancedFilters}
              monthSelectorsRef={monthSelectorsRef}
            />
          )}

          {/* Reset filter button */}
          <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">
            <button
              className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
              onClick={handleReset}
            >
              Reset Selection
            </button>
          </div>

          {/* Filtered surf zone cards */}
          <div ref={resultsRef} className="flex flex-col items-center justify-start pt-16 w-full">
            <div className={`grid ${gridColsClass} p-4 gap-4 rounded-md mb-20`}>
              {filteredSurfZones.map((surfzone, index) => (
                <SurfZoneCard key={index} surfzone={surfzone} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">
           Please <a href="/login" className="text-blue-400 hover:text-blue-600">log in</a> to enjoy surf-places search features
        </p>
      )}
    </div>
  );
}
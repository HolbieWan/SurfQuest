'use client';

/**
 * SurfQuest - SearchSurfZonePage
 *
 * This page displays all surf zones and allows users to filter them
 * based on general preferences (e.g., country, cost) and seasonal conditions
 * (e.g., water temperature, swell size). Filtering features are only available
 * to authenticated users. Unauthenticated users will see a message inviting
 * them to log in to use these features.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// ============================
// Local Dependencies
// ============================
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

// ============================
// Main SearchSurfZonePage Component
// ============================
export default function SearchSurfZonePage() {
  // ============================
  // Authentication Check
  // ============================
  /**
   * Determines if the user is authenticated by checking for an access token in cookies.
   */
  const isAuthenticated = !!Cookies.get('access_token');

  // ============================
  // Hydration State (Avoid SSR Mismatch)
  // ============================
  const [hydrated, setHydrated] = useState(false);

  // ============================
  // Surf Zone Data & UI State
  // ============================
  const [surfZones, setSurfZones] = useState([]);       // All surf zones fetched from API
  const [zone, setZone] = useState('');                 // Currently-selected surf zone name for navigation
  const [countries, setCountries] = useState([]);       // Unique list of countries (dropdown source)
  const [error, setError] = useState('');               // Error message string
  const [loading, setLoading] = useState(false);        // Loading indicator

  // ============================
  // Filter State for User Input
  // ============================
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

  // ============================
  // Advanced Filters Toggle State
  // ============================
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // ============================
  // Refs for Scrolling
  // ============================
  const resultsRef = useRef(null);           // Ref to scroll into view when filters change
  const monthSelectorsRef = useRef(null);    // Ref to scroll to month selector when month changes

  // ============================
  // Numerical Ranges for Seasonal Filters
  // ============================
  const conditionRanges = {
    waterTemp: waterTempRanges,
    swellSize: swellSizeRanges,
    crowdFactor: crowdFactorRanges,
    sunnyDays: sunnyDaysRanges,
    rainyDays: rainyDaysRanges,
  };

  // ============================
  // Router Hook (Programmatic Navigation)
  // ============================
  const router = useRouter();

  // ============================
  // Effect: Load Surf Zones on Mount
  // ============================
  useEffect(() => {
    setHydrated(true);

    const loadSurfZones = async () => {
      setLoading(true);
      try {
        const data = await fetchSurfZones();
        setSurfZones(data);

        // Extract unique country names for BasicFiltersGrid
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

  // ============================
  // Avoid SSR Rendering Issues
  // ============================
  if (!hydrated) return null;

  // ============================
  // Scroll Helpers
  // ============================
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

  // ============================
  // Handle Filter State Changes
  // ============================
  /**
   * Updates the filter state and triggers scroll actions.
   *
   * @param {string} key - The filter key to update (e.g., 'country', 'month').
   * @param {string} value - The new value to assign to that filter key.
   */
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    key === 'month' ? scrollToMonthFilters() : scrollToResults();
  };

  // ============================
  // Reset All Filters to Defaults
  // ============================
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

  // ============================
  // Apply Shared Filtering Utility
  // ============================
  /**
   * Filters the surf zones based on selected criteria.
   */
  const filteredSurfZones = applySurfZoneFilters(surfZones, selectedFilters, conditionRanges);

  // ============================
  // Extract Unique Zone Names for Dropdown
  // ============================
  const zones = [...new Set(filteredSurfZones.map((zone) => zone.name))].sort();

  // ============================
  // Determine Grid Columns Based on Result Count
  // ============================
  const gridColsClass =
    filteredSurfZones.length === 1
      ? 'grid-cols-1'
      : filteredSurfZones.length === 2
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white rounded-lg">
      <h1 className="text-4xl text-center font-bold mb-8">
        Find the best destination for <span className="text-blue-500">you</span> 😎
      </h1>

      {isAuthenticated ? (
        <>
          {/* Error / Loading Feedback */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {loading && <p className="text-blue-500 text-sm">Loading...</p>}

          {/* Zone Selector → Redirect to detail page on change */}
          <select
            className="p-2 mb-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] hover:scale-105"
            value={zone}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setZone(selectedValue);
              // If the user picks a zone, navigate to /surfzones/[zoneName]
              if (selectedValue) {
                router.push(`/surfzones/${encodeURIComponent(selectedValue)}`);
              }
            }}
          >
            <option value="">Choose a Surf Place</option>
            {zones.map((z, i) => (
              <option key={i} value={z}>
                {z}
              </option>
            ))}
          </select>

          <p className="text-gray-500 text-sm mb-2">or</p>

          <h2 className="text-2xl font-bold text-center col-span-full">
            Filter Surf Places by
          </h2>

          {/* Basic Filter Options */}
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

          {/* Seasonal Filter Toggles and Selectors */}
          <div
            ref={monthSelectorsRef}
            className="grid grid-cols-1 gap-3 place-items-center justify-center mt-"
          >
            <button
              className="p-2  text-gray-500 rounded"
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
                <p className="text-gray-500 text-sm">
                  (Select a month to apply below filters)
                </p>
              </>
            )}
          </div>

          {/* Advanced Filter Section */}
          {showAdvancedFilters && (
            <AdvancedFiltersGrid
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              showAdvancedFilters={showAdvancedFilters}
              setShowAdvancedFilters={setShowAdvancedFilters}
              monthSelectorsRef={monthSelectorsRef}
            />
          )}

          {/* Reset Filter Button */}
          <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">
            <button
              className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
              onClick={handleReset}
            >
              Reset Selection
            </button>
          </div>

          {/* Filtered Surf Zone Cards */}
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
          Please{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-600">
            log in
          </a>{' '}
          to enjoy surf-places search features
        </p>
      )}
    </div>
  );
}
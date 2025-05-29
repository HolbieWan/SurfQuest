// src/app/search-zones/page.js

'use client';

/**
 * SurfQuest - SearchSurfZonePage
 *
 * This page displays all surf zones and allows users to filter them
 * based on general preferences (country, cost, etc.) and seasonal conditions (month, swell size, etc.).
 */

import React, { useState, useEffect, useRef } from 'react';
import { fetchSurfZones } from '@/services/surfzoneService';
import { applySurfZoneFilters } from '@/utils/filters';
import SurfZoneCard from '@/components/SurfZones/SurfZoneCard';
import BasicFiltersGrid from '@/components/SurfZones/BasicFiltersGrid';
import AdvancedFiltersGrid from '@/components/SurfZones/AdvancedFiltersGrid';

import {
  months,
  surfLevel,
  travelerType,
  safety,
  comfort,
  mainWaveDirection,
  cost,
  waterTemp_C,
  surfRating,
  swellSize,
  crowdFactor,
  sunnyDays,
  rainyDays,
  waterTempRanges,
  swellSizeRanges,
  crowdFactorRanges,
  sunnyDaysRanges,
  rainyDaysRanges,
} from '@/utils/filterOptions';


export default function SearchSurfZonePage() {
  // UI hydration state to avoid SSR mismatches
  const [hydrated, setHydrated] = useState(false);

  // Data states
  const [surfZones, setSurfZones] = useState([]);             // All surf zones
  const [countries, setCountries] = useState([]);             // Unique country names from surf zones
  const [error, setError] = useState('');                     // Error message
  const [loading, setLoading] = useState(false);              // Loading state

  // Filters selected by the user
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

  // Toggle for displaying seasonal filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Refs for scroll behavior
  const resultsRef = useRef(null);
  const monthSelectorsRef = useRef(null);

  // Mapping of filter keys to numerical or label ranges
  const conditionRanges = {
    waterTemp: waterTempRanges,
    swellSize: swellSizeRanges,
    crowdFactor: crowdFactorRanges,
    sunnyDays: sunnyDaysRanges,
    rainyDays: rainyDaysRanges,
  };

  // Load surf zones on first render
  useEffect(() => {
    setHydrated(true);
    const loadSurfZones = async () => {
      setLoading(true);
      try {
        const data = await fetchSurfZones();
        setSurfZones(data);
        setCountries([...new Set(data.map((zone) => zone.country.name))]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSurfZones();
  }, []);

  // Prevent render on server-side
  if (!hydrated) return null;

  /**
   * Scroll smoothly to the results section.
   */
  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /**
   * Scroll to month selector when month is changed.
   */
  const scrollToMonthFilters = () => {
    setTimeout(() => monthSelectorsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /**
   * Handles changes in filter values.
   * @param {string} key - The filter key to update.
   * @param {string} value - The new value for the filter.
   */
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'month') scrollToMonthFilters();
    else scrollToResults();
  };

  /**
   * Resets all filter values.
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

  // Apply all filters to the loaded surf zones
  const filteredSurfZones = applySurfZoneFilters(surfZones, selectedFilters, conditionRanges);

  // Determine grid layout class based on the number of results
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

      {/* Status Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p className="text-blue-500 text-sm">Loading...</p>}

      {/* Basic Filters Section */}
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

      {/* Toggle Advanced Filters + Month Select */}
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

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <AdvancedFiltersGrid
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          monthSelectorsRef={monthSelectorsRef}
        />
      )}

      {/* Reset Filters Button */}
      <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">
        <button
          className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
          onClick={handleReset}
        >
          Reset Selection
        </button>
      </div>

      {/* SurfZone Card Results */}
      <div ref={resultsRef} className="flex flex-col items-center justify-start pt-16 w-full">
        <div className={`grid ${gridColsClass} p-4 gap-4 rounded-md mb-20`}>
          {filteredSurfZones.map((surfzone, index) => (
            <SurfZoneCard key={index} surfzone={surfzone} />
          ))}
        </div>
      </div>
    </div>
  );
}
// src/components/SurfZones/AdvancedFiltersGrid.jsx

'use client';

/**
 * AdvancedFiltersGrid Component
 * -----------------------------
 * This UI component renders advanced seasonal filters for selecting surf zones.
 * It is displayed conditionally when the user chooses to reveal advanced filters.
 *
 * These filters depend on the selected month and include: 
 * - Surf Level
 * - Sunny Days
 * - Rainy Days
 * - Water Temperature
 * - Surf Rating
 * - Swell Size
 * - Crowd Factor
 */

import React from 'react';
import {
  surfLevel,
  sunnyDays,
  rainyDays,
  waterTemp_C,
  surfRating,
  swellSize,
  crowdFactor
} from '@/utils/filterOptions';

/**
 * Renders the advanced filtering options related to seasonal conditions.
 *
 * @param {Object} props
 * @param {Object} props.selectedFilters - Current state of selected filters.
 * @param {Function} props.handleFilterChange - Handler function for filter changes.
 * @param {boolean} props.showAdvancedFilters - Flag to determine visibility of this component.
 * @param {Function} props.setShowAdvancedFilters - State setter for toggling visibility.
 * @param {Object} props.monthSelectorsRef - Ref to the month selector block (for scrolling).
 */
export default function AdvancedFiltersGrid({
  selectedFilters,
  handleFilterChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  monthSelectorsRef
}) {
  return (
    <>
      {/* Conditionally display advanced seasonal filter selects */}
      {showAdvancedFilters && (
        <>
          {/* Grid of seasonal filter dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 place-items-center justify-center">
            {/* Surf Level Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.surfLevel}
              onChange={(e) => handleFilterChange('surfLevel', e.target.value)}
            >
              <option value="">Surf Level</option>
              {surfLevel.map((level, i) => (
                <option key={i} value={level}>{level}</option>
              ))}
            </select>

            {/* Sunny Days Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.sunnyDays}
              onChange={(e) => handleFilterChange('sunnyDays', e.target.value)}
            >
              <option value="">Sunny Days</option>
              {sunnyDays.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>

            {/* Rainy Days Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.rainyDays}
              onChange={(e) => handleFilterChange('rainyDays', e.target.value)}
            >
              <option value="">Rainy Days</option>
              {rainyDays.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>

            {/* Water Temperature Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.waterTemp}
              onChange={(e) => handleFilterChange('waterTemp', e.target.value)}
            >
              <option value="">Water Temp</option>
              {waterTemp_C.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>

            {/* Surf Rating Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.surfRating}
              onChange={(e) => handleFilterChange('surfRating', e.target.value)}
            >
              <option value="">Surf Rating</option>
              {surfRating.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>

            {/* Swell Size Selector */}
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.swellSize}
              onChange={(e) => handleFilterChange('swellSize', e.target.value)}
            >
              <option value="">Swell Size</option>
              {swellSize.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>
          </div>

          {/* Crowd Factor Selector */}
          <div className="grid grid-cols-1 place-items-center gap-3 justify-center">
            <select
              className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.crowdFactor}
              onChange={(e) => handleFilterChange('crowdFactor', e.target.value)}
            >
              <option value="">Crowd Factor</option>
              {crowdFactor.map((value, i) => (
                <option key={i} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
}
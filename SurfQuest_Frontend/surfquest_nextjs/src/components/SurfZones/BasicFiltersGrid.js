// src/components/SurfZones/BasicFiltersGrid.jsx

'use client';

/**
 * BasicFiltersGrid Component
 * ---------------------------
 * This component renders the primary non-seasonal filters used to search surf zones.
 * These filters are always visible and affect all months of the year.
 * 
 * Filters included:
 * - Country
 * - Traveler Type
 * - Safety
 * - Comfort
 * - Cost of Living
 * - Main Wave Direction
 *
 * Each change in selection triggers a scroll to the surf zone result section.
 */

import React from 'react';

/**
 * Renders a grid of basic (non-seasonal) surf zone filters.
 *
 * @param {Object} props
 * @param {Object} props.selectedFilters - Object holding the current values of all filters.
 * @param {Function} props.handleFilterChange - Callback to update filters in parent state.
 * @param {Function} props.scrollToResults - Callback to scroll to surf zone results when a filter is applied.
 * @param {string[]} [props.countries=[]] - List of available countries.
 * @param {string[]} [props.travelerType=[]] - List of traveler types (Solo, Family, etc.).
 * @param {string[]} [props.safety=[]] - List of safety levels.
 * @param {string[]} [props.comfort=[]] - List of comfort levels.
 * @param {string[]} [props.cost=[]] - List of cost levels (Cheap, Moderate, etc.).
 * @param {string[]} [props.mainWaveDirection=[]] - List of wave directions.
 */
export default function FiltersGrid({
  selectedFilters,
  handleFilterChange,
  scrollToResults,
  countries = [],
  travelerType = [],
  safety = [],
  comfort = [],
  cost = [],
  mainWaveDirection = [],
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-3 items-center justify-center">
      {/* Country Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.country}
        onChange={(e) => {
          handleFilterChange("country", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Country</option>
        {countries
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
      </select>

      {/* Traveler Type Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.travelerType}
        onChange={(e) => {
          handleFilterChange("travelerType", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Traveler Type</option>
        {travelerType.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Safety Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.safety}
        onChange={(e) => {
          handleFilterChange("safety", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Safety</option>
        {safety.map((level, index) => (
          <option key={index} value={level}>
            {level}
          </option>
        ))}
      </select>

      {/* Comfort Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.comfort}
        onChange={(e) => {
          handleFilterChange("comfort", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Comfort</option>
        {comfort.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Cost of Living Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.cost}
        onChange={(e) => {
          handleFilterChange("cost", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Cost of Living</option>
        {cost.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>

      {/* Main Wave Direction Selector */}
      <select
        className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
        value={selectedFilters.mainWaveDirection}
        onChange={(e) => {
          handleFilterChange("mainWaveDirection", e.target.value);
          scrollToResults();
        }}
      >
        <option value="">Main Wave Direction</option>
        {mainWaveDirection.map((dir, index) => (
          <option key={index} value={dir}>
            {dir}
          </option>
        ))}
      </select>
    </div>
  );
}
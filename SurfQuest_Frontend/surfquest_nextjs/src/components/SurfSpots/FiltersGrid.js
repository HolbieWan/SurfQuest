'use client';

/**
 * FiltersGrid Component
 * ---------------------
 * Renders a uniform grid of select inputs for filtering surf spots.
 * Delegates filter state updates via onFilterChange callbacks.
 *
 * @param {string[]} uniqueSpots
 * @param {Object} filters
 * @param {Function} onFilterChange
 * @param {Object} options - imported from spotFilterOptions
 */
import React from 'react';

export default function FiltersGrid({ uniqueSpots, filters, onFilterChange, options }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4 gap-4">
      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.surfSpot}
        onChange={onFilterChange('surfSpot')}
      >
        <option value="">View all surf-spots</option>
        {uniqueSpots.sort().map(spot => (
          <option key={spot} value={spot}>{spot}</option>
        ))}
      </select>
      
      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.bestMonth}
        onChange={onFilterChange('bestMonth')}
      >
        <option value="">Best Month</option>
        {options.monthList.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.surfLevel}
        onChange={onFilterChange('surfLevel')}
      >
        <option value="">Surf Level</option>
        {options.surfLevelList.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.breakType}
        onChange={onFilterChange('breakType')}
      >
        <option value="">Break Type</option>
        {options.breakTypeList.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.waveDirection}
        onChange={onFilterChange('waveDirection')}
      >
        <option value="">Wave Direction</option>
        {options.waveDirectionList.map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.bestTide}
        onChange={onFilterChange('bestTide')}
      >
        <option value="">Best Tide</option>
        {options.bestTideList.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.bestSwellSize}
        onChange={onFilterChange('bestSwellSize')}
      >
        <option value="">Best Swell Size</option>
        {options.swellSizeList.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.bestWindDirection}
        onChange={onFilterChange('bestWindDirection')}
      >
        <option value="">Best Wind Direction</option>
        {options.windDirectionList.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        className="p-2 bg-blue-500 text-white text-center rounded hover:scale-105"
        value={filters.bestSwellDirection}
        onChange={onFilterChange('bestSwellDirection')}
      >
        <option value="">Best Swell Direction</option>
        {options.swellDirectionList.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

    </div>
  );
}
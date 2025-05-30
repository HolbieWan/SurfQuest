'use client';

/**
 * ConditionsSection Component
 * ---------------------------
 * Renders seasonal surf conditions for a selected month.
 * Includes a month selector and three condition cards (Surf, Weather, Wind),
 * each displaying relevant metrics and styling.
 *
 * @param {Object} props
 * @param {string} props.selectedMonth - Currently selected month.
 * @param {Function} props.onMonthChange - Callback to update selected month.
 * @param {Object} props.condition - Condition data for the selected month.
 * @param {number} props.condition.world_surf_rating - Numeric surf rating (1–5).
 * @param {string[]} props.condition.surf_level - Recommended surf levels.
 * @param {number} props.condition.water_temp_c - Water temperature (°C).
 * @param {number} props.condition.swell_size_meter - Average swell size (m).
 * @param {number} props.condition.swell_consistency - Consistency percentage.
 * @param {string|number} props.condition.crowd - Crowd factor label or number.
 * @param {number} props.condition.min_air_temp_c - Minimum air temp (°C).
 * @param {number} props.condition.max_air_temp_c - Maximum air temp (°C).
 * @param {number} props.condition.rain_days - Rainy days per month.
 * @param {number} props.condition.sunny_days - Sunny days per month.
 * @param {string|number} props.condition.wind_force - Wind force descriptor.
 * @param {string} props.condition.wind_direction - Wind direction label.
 * @param {number} props.condition.wind_consistency - Wind consistency percentage.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Local Constants
// ============================
const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// ============================
// Component Definition
// ============================
export default function ConditionsSection({
  selectedMonth,
  onMonthChange,
  condition
}) {
  if (!condition) return null;

  // Build star rating string
  const stars = '★'.repeat(condition.world_surf_rating)
              + '☆'.repeat(5 - condition.world_surf_rating);

  // Card configurations
  const cards = [
    {
      title: 'Surf',
      bg: 'bg-blue-400',
      lines: [
        `Water temp: ${condition.water_temp_c} °c`,
        `Average swell size: ${condition.swell_size_meter} m`,
        `Swell consistency: ${condition.swell_consistency} %`,
        `Surf crowd: ${condition.crowd}`
      ]
    },
    {
      title: 'Weather',
      bg: 'bg-green-500',
      lines: [
        `Min air temp: ${condition.min_air_temp_c} °c`,
        `Max air temp: ${condition.max_air_temp_c} °c`,
        `Rainy days: ${condition.rain_days} / month`,
        `Sunny days: ${condition.sunny_days} / month`
      ]
    },
    {
      title: 'Wind',
      bg: 'bg-orange-400',
      lines: [
        `Wind force: ${condition.wind_force}`,
        `Wind direction: ${condition.wind_direction}`,
        `Wind consistency: ${condition.wind_consistency} %`
      ]
    }
  ];

  return (
    <div className="bg-black rounded-lg p-10 flex flex-col justify-center items-center overflow-hidden">
      {/* Section Header */}
      <h2 className="text-white text-4xl font-bold text-center mb-6 w-full">
        Surf Conditions
      </h2>

      {/* Month Selector */}
      <select
        className="border border-black rounded text-center bg-pink-500 text-white p-2 mb-4 min-w-[200px] hover:scale-105"
        value={selectedMonth}
        onChange={e => onMonthChange(e.target.value)}
      >
        <option value="">Select a Month</option>
        {months.map((m, i) => (
          <option key={i} value={m}>{m}</option>
        ))}
      </select>

      {/* Rating & Level */}
      <div className="bg-black rounded-lg p-4 flex flex-col justify-center overflow-hidden w-full">
        <div className="p-2 flex flex-col justify-center mb-10">
          <div className="text-lg text-white text-center">
            Surf rating: <span className="text-pink-400 font-bold">{stars}</span>
          </div>
          <div className="text-lg text-white text-center">
            Recommended surf level:{' '}
            <span className="text-pink-400 font-bold">
              {condition.surf_level.join(', ')}
            </span>
          </div>
        </div>

        {/* Condition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} group rounded-lg p-4 flex flex-col justify-center border border-gray-700 overflow-hidden transform duration-500 hover:scale-110`}
              style={{ height: '300px' }}
            >
              <div className="text-lg lg:text-xl text-white font-semibold text-center mb-10">
                {card.title}
              </div>
              {card.lines.map((line, j) => {
                const [label, value] = line.split(/:(.+)/); // split on first colon
                return (
                  <div key={j} className="text-sm text-black text-center mb-1">
                    {label}:
                    <span className="text-white font-bold">{value}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
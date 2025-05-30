'use client';
import React from 'react';

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

/**
 * Renders the seasonal conditions cards.
 */
export default function ConditionsSection({
  selectedMonth,
  onMonthChange,
  condition
}) {
  if (!condition) return null;

  const stars = '★'.repeat(condition.world_surf_rating) +
                '☆'.repeat(5 - condition.world_surf_rating);

  return (
    <div className="bg-black rounded-lg p-10 flex flex-col justify-center items-center overflow-hidden">
      <h2 className="text-white text-4xl font-bold text-center mb-6 w-full">Surf Conditions</h2>
      <select
        className="border border-black rounded bg-pink-500 text-white p-2 mb-4 min-w-[200px] hover:scale-105"
        value={selectedMonth}
        onChange={e => onMonthChange(e.target.value)}
      >
        <option value="">Select a Month</option>
        {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
      </select>

      <div className="bg-black rounded-lg p-4 flex flex-col justify-center overflow-hidden w-full">
        <div className="p-2 flex flex-col justify-center mb-10">
          <div className="text-lg text-white text-center">
            Surf rating: <span className="text-pink-400 font-bold">{stars}</span>
          </div>
          <div className="text-lg text-white text-center">
            Recommended surf level: <span className="text-pink-400 font-bold">{condition.surf_level.join(', ')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
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
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} group rounded-lg p-4 flex flex-col justify-center border border-gray-700 overflow-hidden transform duration-500 hover:scale-110`}
              style={{ height: '300px' }}
            >
              <div className="text-lg lg:text-xl text-white font-semibold text-center mb-10">
                {card.title}
              </div>
              {card.lines.map((line, j) => (
                <div key={j} className="text-sm text-black text-center mb-1">
                  {line.includes(':')
                    ? line.split(':')[0] + ':' 
                    : line}
                  <span className="text-white font-bold">
                    {line.split(':')[1]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
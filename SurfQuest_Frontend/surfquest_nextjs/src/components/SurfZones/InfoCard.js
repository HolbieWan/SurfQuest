'use client';
import React from 'react';

/**
 * Displays the main info block for a surf zone.
 */
export default function InfoCard({ spot }) {
  const { name, description, nearest_city, nearest_airport, safety,
          health_hazards, surf_hazards, traveler_type, best_months,
          confort, cost, language, currency, religion, surroundings,
          main_wave_direction } = spot.surfzone;

  return (
    <div className="group flex flex-col items-center justify-items-center w-full max-w-lg">
      <div className="bg-white rounded-lg p-10 flex flex-col justify-start border overflow-hidden w-full transform transition-transform duration-500 group-hover:scale-105">
        <h2 className="text-blue-500 text-4xl font-bold text-center lg:text-left mb-6 p-2">{name}</h2>
        <div className="mt-2 text-md text-black text-center lg:text-left font-semibold mb-4">
          {description}
        </div>
        {[
          ['Near city', nearest_city],
          ['Near airport', nearest_airport],
          ['Safety', safety],
          ['Health hazards', health_hazards.join(', ')],
          ['Surf hazards', surf_hazards.join(', ')],
          ['Traveler type', traveler_type.join(', ')],
          ['Best months', best_months.join(', ')],
          ['Comfort', confort],
          ['Cost of living', cost],
          ['Language', language],
          ['Currency', currency],
          ['Main religion', religion],
          ['Surroundings', surroundings],
          ['Main wave direction', main_wave_direction],
        ].map(([label, value], i) => (
          <div key={i} className="mt-2 text-sm text-gray-700 text-center lg:text-left">
            {label}: <span className="font-bold text-cyan-500">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

/**
 * InfoCard Component
 * ------------------
 * Presents the key information about a surf zone in a styled card.
 * Renders the zone’s name, description, and various details like
 * location, hazards, traveler tips, and amenities.
 *
 * @param {Object} props
 * @param {Object} props.spot - The surf spot object containing `surfzone` details.
 * @param {Object} props.spot.surfzone - The surf zone metadata.
 * @param {string} props.spot.surfzone.name - Name of the surf zone.
 * @param {string} props.spot.surfzone.description - Description of the surf zone.
 * @param {string} props.spot.surfzone.nearest_city - Closest city to the zone.
 * @param {string} props.spot.surfzone.nearest_airport - Closest airport to the zone.
 * @param {string} props.spot.surfzone.safety - Safety level (e.g., Low, Moderate, High).
 * @param {string[]} props.spot.surfzone.health_hazards - List of health hazard warnings.
 * @param {string[]} props.spot.surfzone.surf_hazards - List of surf hazard warnings.
 * @param {string[]} props.spot.surfzone.traveler_type - Recommended traveler types.
 * @param {string[]} props.spot.surfzone.best_months - Best months for surfing.
 * @param {string} props.spot.surfzone.confort - Comfort level category.
 * @param {string} props.spot.surfzone.cost - Cost of living indicator.
 * @param {string} props.spot.surfzone.language - Primary local language.
 * @param {string} props.spot.surfzone.currency - Local currency.
 * @param {string} props.spot.surfzone.religion - Predominant religion.
 * @param {string} props.spot.surfzone.surroundings - Description of surroundings.
 * @param {string} props.spot.surfzone.main_wave_direction - Dominant wave direction.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Component Definition
// ============================
export default function InfoCard({ surfzone }) {
  // Destructure surfzone properties for clarity
  const {
    name,
    description,
    nearest_city,
    nearest_airport,
    safety,
    health_hazards,
    surf_hazards,
    traveler_type,
    best_months,
    confort,
    cost,
    language,
    currency,
    religion,
    surroundings,
    main_wave_direction,
  } = surfzone;

  // Prepare detail rows as [label, value] pairs
  const details = [
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
  ];

  return (
    <div className="group flex flex-col items-center justify-items-center w-full max-w-lg">
      <div
        className="bg-white rounded-lg p-10 flex flex-col justify-start border overflow-hidden w-full
                   transform transition-transform duration-500 group-hover:scale-105"
      >
        {/* Zone Title */}
        <h2 className="text-blue-500 text-4xl font-bold text-center lg:text-left mb-6 p-2">
          {name}
        </h2>

        {/* Zone Description */}
        <div className="mt-2 text-md text-black text-center lg:text-left font-semibold mb-4">
          {description}
        </div>

        {/* Render each detail line */}
        {details.map(([label, value], index) => (
          <div key={index} className="mt-2 text-sm text-gray-700 text-center lg:text-left">
            {label}: <span className="font-bold text-cyan-500">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
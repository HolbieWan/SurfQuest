// "use client";

// import React from 'react';

// export default function MainFilters({
//   selectedCountry,
//   countries,
//   selectedTravelerType,
//   travelerType,
//   selectedSafety,
//   safety,
//   selectedComfort,
//   comfort,
//   selectedCost,
//   cost,
//   selectedMainWaveDirection,
//   mainWaveDirection,
//   handleCountryChange,
//   handleTravelerTypeChange,
//   handleSafetyChange,
//   handleComfortChange,
//   handleCostChange,
//   handleMainWaveDirectionChange,
// }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-3 items-center justify-center">
//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedCountry} onChange={handleCountryChange}>
//         <option value="">Country</option>
//         {countries.sort().map((country, index) => (
//           <option key={index} value={country}>{country}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedTravelerType} onChange={handleTravelerTypeChange}>
//         <option value="">Traveler Type</option>
//         {travelerType.map((type, index) => (
//           <option key={index} value={type}>{type}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedSafety} onChange={handleSafetyChange}>
//         <option value="">Safety</option>
//         {safety.map((level, index) => (
//           <option key={index} value={level}>{level}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedComfort} onChange={handleComfortChange}>
//         <option value="">Comfort</option>
//         {comfort.map((item, index) => (
//           <option key={index} value={item}>{item}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedCost} onChange={handleCostChange}>
//         <option value="">Cost</option>
//         {cost.map((c, index) => (
//           <option key={index} value={c}>{c}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedMainWaveDirection} onChange={handleMainWaveDirectionChange}>
//         <option value="">Wave Direction</option>
//         {mainWaveDirection.map((dir, index) => (
//           <option key={index} value={dir}>{dir}</option>
//         ))}
//       </select>
//     </div>
//   );
// }
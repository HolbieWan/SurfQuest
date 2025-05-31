// "use client";

// import React from 'react';

// export default function SeasonalFilters({
//   showAdvancedFilters,
//   surfLevel,
//   selectedSurfLevel,
//   handleSurfLevelChange,
//   sunnyDays,
//   selectedSunnyDays,
//   handleSunnyDaysChange,
//   rainyDays,
//   selectedRainyDays,
//   handleRainyDaysChange,
//   waterTemp_C,
//   selectedWaterTemp,
//   handleWaterTempChange,
//   surfRating,
//   selectedSurfRating,
//   handleSurfRatingChange,
//   swellSize,
//   selectedSwellSize,
//   handleSwellSizeChange,
//   crowdFactor,
//   selectedCrowdFactor,
//   handleCrowdFactorChange,
// }) {
//   if (!showAdvancedFilters) return null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 place-items-center justify-center">
//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedSurfLevel} onChange={handleSurfLevelChange}>
//         <option value="">Surf Level</option>
//         {surfLevel.map((level, index) => (
//           <option key={index} value={level}>{level}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedSunnyDays} onChange={handleSunnyDaysChange}>
//         <option value="">Sunny Days</option>
//         {sunnyDays.map((val, index) => (
//           <option key={index} value={val}>{val}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedRainyDays} onChange={handleRainyDaysChange}>
//         <option value="">Rainy Days</option>
//         {rainyDays.map((val, index) => (
//           <option key={index} value={val}>{val}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedWaterTemp} onChange={handleWaterTempChange}>
//         <option value="">Water Temp</option>
//         {waterTemp_C.map((temp, index) => (
//           <option key={index} value={temp}>{temp}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedSurfRating} onChange={handleSurfRatingChange}>
//         <option value="">Surf Rating</option>
//         {surfRating.map((r, index) => (
//           <option key={index} value={r}>{r}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedSwellSize} onChange={handleSwellSizeChange}>
//         <option value="">Swell Size</option>
//         {swellSize.map((s, index) => (
//           <option key={index} value={s}>{s}</option>
//         ))}
//       </select>

//       <select className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]" value={selectedCrowdFactor} onChange={handleCrowdFactorChange}>
//         <option value="">Crowd Factor</option>
//         {crowdFactor.map((c, index) => (
//           <option key={index} value={c}>{c}</option>
//         ))}
//       </select>
//     </div>
//   );
// }
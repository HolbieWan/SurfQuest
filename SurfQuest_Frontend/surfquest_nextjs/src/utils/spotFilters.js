/**
 * src/utils/spotFilters.js
 *
 * Shared utility to filter an array of surf spots based on user-selected criteria.
 * Each filter is applied only if its corresponding value is truthy.
 *
 * @module spotFilters
 */

/**
 * Filters a list of surf spots according to the given criteria.
 *
 * @param {Array<Object>} spots
 *   Array of surf spot objects fetched from the API.
 * @param {Object} f
 *   Filter values:
 *   - {string}   name       Exact surf-spot name to match.
 *   - {string}   breakType  Desired break type (e.g., "Beach break").
 *   - {string}   waveDir    Desired wave direction (e.g., "Left").
 *   - {string}   level      Required surfer level ("Beginner", "Pro", etc.).
 *   - {string}   tide       Preferred tide ("Low", "High", etc.).
 *   - {string}   swellSize  Category key for swell size (matches swellSizeRanges).
 *   - {string}   windDir    Preferred wind direction.
 *   - {string}   swellDir   Preferred swell direction.
 *   - {string}   month      Best months category.
 * @param {Object} ranges
 *   Object containing numeric ranges for certain filters:
 *   - {Object<string, {min: number, max: number}>} swellSizeRanges
 *
 * @returns {Array<Object>}
 *   A new array containing only spots that satisfy all active filters.
 */
export function applySurfSpotFilters(
    spots,
    f,
    { swellSizeRanges }
  ) {
    return spots
      // Exact match on name
      .filter(s => !f.name || s.name === f.name)

      // Exact match on surf zone
      .filter(s => !f.zone || s.surfzone?.name === f.zone)
  
      // Break type filter
      .filter(s => !f.breakType || s.break_type === f.breakType)
  
      // Wave direction filter
      .filter(s => !f.waveDir || s.wave_direction === f.waveDir)
  
      // Surf level inclusion
      .filter(s => !f.level || s.surf_level.includes(f.level))
  
      // Tide inclusion
      .filter(s => !f.tide || s.best_tide.includes(f.tide))
  
      // Swell size within numeric range
      .filter(s => {
        if (!f.swellSize) return true;
        const range = swellSizeRanges[f.swellSize] || {};
        return (
          s.best_swell_size_meter >= range.min &&
          s.best_swell_size_meter <= range.max
        );
      })
  
      // Exact match on wind direction
      .filter(s => !f.windDir || s.best_wind_direction === f.windDir)
  
      // Exact match on swell direction
      .filter(s => !f.swellDir || s.best_swell_direction === f.swellDir)
  
      // Month inclusion (category)
      .filter(s => !f.month || s.best_months.includes(f.month));
  }
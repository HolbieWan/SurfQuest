/**
 * SurfQuest – Surf Zone Utilities
 *
 * Utility functions for extracting and filtering surf zone data
 * from an array of surf spot objects. Used by SurfZoneDetailsPage
 * to build selectors and filter displayed spots.
 */

/**
 * Extracts a sorted list of unique surf zone names from an array of surf spots.
 *
 * @function getUniqueSurfZones
 * @param {Object[]} surfSpots - Array of surf spot objects fetched from the API.
 * @param {Object} surfSpots[].surfzone - Nested surf zone information on each spot.
 * @param {string} surfSpots[].surfzone.name - Name of the surf zone.
 * @returns {string[]} Alphabetically sorted array of unique surf zone names.
 *
 * @example
 * const uniqueZones = getUniqueSurfZones([
 *   { surfzone: { name: 'Hossegor' } },
 *   { surfzone: { name: 'Bali' } },
 *   { surfzone: { name: 'Hossegor' } },
 * ]);
 * // uniqueZones -> ['Bali', 'Hossegor']
 */
export function getUniqueSurfZones(surfSpots) {
    const names = surfSpots.map(spot => spot.surfzone.name);
    return [...new Set(names)].sort();
  }
  
  /**
   * Filters an array of surf spot objects to those belonging to a given surf zone.
   *
   * @function filterSpotsByZone
   * @param {Object[]} surfSpots - Array of surf spot objects fetched from the API.
   * @param {string} zoneName - The name of the surf zone to filter by.
   * @returns {Object[]} Subset of surfSpots where spot.surfzone.name === zoneName.
   *
   * @example
   * const allSpots = [
   *   { id: 1, surfzone: { name: 'Bali' } },
   *   { id: 2, surfzone: { name: 'Hossegor' } },
   * ];
   * const hossegorSpots = filterSpotsByZone(allSpots, 'Hossegor');
   * // hossegorSpots -> [{ id: 2, surfzone: { name: 'Hossegor' } }]
   */
  export function filterSpotsByZone(surfSpots, zoneName) {
    return surfSpots.filter(spot => spot.surfzone.name === zoneName);
  }
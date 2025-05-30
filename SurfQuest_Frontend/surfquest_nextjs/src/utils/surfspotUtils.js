/**
 * Extract unique surf zones from a list of surf spots.
 *
 * @param {Array} surfSpots
 * @returns {string[]} Sorted array of unique surf zone names.
 */
export function getUniqueSurfZones(surfSpots) {
    return [...new Set(surfSpots.map((s) => s.surfzone.name))].sort();
  }
  
  /**
   * Extract unique surf spot names from a list of surf spots.
   *
   * @param {Array} surfSpots
   * @returns {string[]} Sorted array of unique surf spot names.
   */
  export function getUniqueSurfSpots(surfSpots) {
    return [...new Set(surfSpots.map((s) => s.name))].sort();
  }

/**
 * src/utils/surfspotUtils.js
 *
 * Utility functions for extracting unique surf zone and surf spot names
 * from the array of surf spot objects.
 */

// ============================
// Public API
// ============================

/**
 * Extract unique surf zones from a list of surf spots.
 *
 * @param {Array<Object>} surfSpots
 *   Array of surf spot objects, each containing a `surfzone` property
 *   with a `name` field.
 *
 * @returns {string[]}
 *   Sorted array of unique surf zone names.
 */
export function getUniqueSurfZones(surfSpots) {
    return [...new Set(surfSpots.map((s) => s.surfzone.name))].sort();
  }
  
  /**
   * Extract unique surf spot names from a list of surf spots.
   *
   * @param {Array<Object>} surfSpots
   *   Array of surf spot objects, each containing a `name` field.
   *
   * @returns {string[]}
   *   Sorted array of unique surf spot names.
   */
  export function getUniqueSurfSpots(surfSpots) {
    return [...new Set(surfSpots.map((s) => s.name))].sort();
  }
/**
 * Extract unique surf zones from surf spots.
 */
export function getUniqueSurfZones(surfSpots) {
    return [...new Set(surfSpots.map(spot => spot.surfzone.name))];
  }
  
  /**
   * Filter surf spots by selected surf zone.
   */
  export function filterSpotsByZone(surfSpots, zoneName) {
    return surfSpots.filter(spot => spot.surfzone.name === zoneName);
  }
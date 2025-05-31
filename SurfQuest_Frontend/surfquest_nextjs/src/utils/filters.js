// src/utils/filters.js

/**
 * SurfZone Filters Utility
 * ------------------------
 * This module contains the main utility function used to filter an array of surf zones
 * based on a set of user-selected criteria.
 *
 * The filters include:
 * - Static parameters (country, travelerType, etc.)
 * - Seasonal conditions (e.g. water temperature, swell size, etc.)
 * - A “bestMonths” filter that matches zone.best_months arrays.
 */

/**
 * Filters a list of surf zones based on the selected filters and conditional ranges.
 *
 * @param {Array<Object>} surfZones       - All surf zone objects from the API.
 * @param {Object} filters                - Currently selected filters object. May contain:
 *   - country, surfLevel, travelerType, safety, comfort, mainWaveDirection,
 *     cost, waterTemp, surfRating, swellSize, crowdFactor, sunnyDays, rainyDays
 *   - month           (the “selected month” for seasonal filters)
 *   - bestMonths      (if set, must match zone.best_months)
 * @param {Object} conditionRanges        - Numeric/categorical ranges for advanced filters:
 *   { waterTemp: {...}, swellSize: {...}, crowdFactor: {...}, sunnyDays: {...}, rainyDays: {...} }
 *
 * @returns {Array<Object>} A filtered array of surf zone objects matching all active criteria.
 */
export function applySurfZoneFilters(surfZones, filters, conditionRanges) {
  return surfZones

    // 1) Filter by “bestMonths” first (if user clicked the button):
    .filter(zone => {
      // If no bestMonths filter is set, accept all zones.
      if (!filters.bestMonths) return true;

      // If zone.best_months is undefined/empty, exclude it.
      if (!Array.isArray(zone.best_months)) return false;

      // Keep only zones whose best_months array includes the chosen month.
      return zone.best_months.includes(filters.bestMonths);
    })

    // 2) Filter by static zone properties (country)
    .filter(zone => !filters.country || zone.country.name === filters.country)

    // 3) Filter by surf level condition, based on selected month
    .filter(zone =>
      !filters.surfLevel ||
      zone.conditions?.some(condition =>
        // If month is set, match that condition record
        (!filters.month || condition.month === filters.month) &&
        condition.surf_level.includes(filters.surfLevel)
      )
    )

    // 4) Other static array‐inclusion filters
    .filter(zone => !filters.travelerType || zone.traveler_type?.includes(filters.travelerType))
    .filter(zone => !filters.safety || zone.safety?.includes(filters.safety))
    .filter(zone => !filters.comfort || zone.confort?.includes(filters.comfort))
    .filter(zone => !filters.mainWaveDirection || zone.main_wave_direction?.includes(filters.mainWaveDirection))
    .filter(zone => !filters.cost || zone.cost?.includes(filters.cost))

    // 5) Water temperature range (seasonal)
    .filter(zone => {
      if (!filters.waterTemp) return true;
      const range = conditionRanges.waterTemp[filters.waterTemp];
      if (!range) return false;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.water_temp_c >= range.min &&
        condition.water_temp_c <= range.max
      );
    })

    // 6) Exact surf rating (1 to 5)
    .filter(zone => {
      if (!filters.surfRating) return true;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.world_surf_rating === Number(filters.surfRating)
      );
    })

    // 7) Swell size in meters
    .filter(zone => {
      if (!filters.swellSize) return true;
      const range = conditionRanges.swellSize[filters.swellSize];
      if (!range) return false;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.swell_size_meter >= range.min &&
        condition.swell_size_meter <= range.max
      );
    })

    // 8) Crowd factor (e.g. “Low”, “Medium”, “High”)
    .filter(zone => {
      if (!filters.crowdFactor) return true;
      const crowd = conditionRanges.crowdFactor[filters.crowdFactor];
      if (!crowd) return false;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.crowd === crowd
      );
    })

    // 9) Minimum sunny days
    .filter(zone => {
      if (!filters.sunnyDays) return true;
      const range = conditionRanges.sunnyDays[filters.sunnyDays];
      if (!range) return false;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.sunny_days >= range.min &&
        condition.sunny_days <= range.max
      );
    })

    // 10) Maximum rainy days
    .filter(zone => {
      if (!filters.rainyDays) return true;
      const range = conditionRanges.rainyDays[filters.rainyDays];
      if (!range) return false;
      return zone.conditions?.some(condition =>
        (!filters.month || condition.month === filters.month) &&
        condition.rain_days >= range.min &&
        condition.rain_days <= range.max
      );
    });
}
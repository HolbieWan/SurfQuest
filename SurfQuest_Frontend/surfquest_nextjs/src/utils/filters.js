// src/utils/filters.js

/**
 * SurfZone Filters Utility
 * ------------------------
 * This module contains the main utility function used to filter an array of surf zones
 * based on a set of user-selected criteria.
 * 
 * The filters include static parameters (country, travelerType, etc.) and seasonal conditions
 * that depend on the selected month (swell size, water temperature, sunny days, etc.).
 */

/**
 * Filters a list of surf zones based on the selected filters and conditional ranges.
 *
 * @param {Array<Object>} surfZones - List of all surf zone objects from the API.
 * @param {Object} filters - Object representing the currently selected filters.
 * @param {Object} conditionRanges - Numeric or categorical ranges for advanced seasonal filters.
 *
 * @returns {Array<Object>} - A filtered array of surf zone objects matching all selected criteria.
 */
export function applySurfZoneFilters(surfZones, filters, conditionRanges) {
    return surfZones
  
      // Filter by static zone properties
      .filter(zone => !filters.country || zone.country.name === filters.country)
  
      // Filter by surf level condition (based on month)
      .filter(zone =>
        !filters.surfLevel ||
        zone.conditions?.some(condition =>
          (!filters.month || condition.month === filters.month) &&
          condition.surf_level.includes(filters.surfLevel)
        )
      )
  
      .filter(zone => !filters.travelerType || zone.traveler_type?.includes(filters.travelerType))
      .filter(zone => !filters.safety || zone.safety?.includes(filters.safety))
      .filter(zone => !filters.comfort || zone.confort?.includes(filters.comfort))
      .filter(zone => !filters.mainWaveDirection || zone.main_wave_direction?.includes(filters.mainWaveDirection))
      .filter(zone => !filters.cost || zone.cost?.includes(filters.cost))
  
      // Filter by water temperature range (seasonal)
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
  
      // Filter by exact surf rating (1 to 5)
      .filter(zone => {
        if (!filters.surfRating) return true;
        return zone.conditions?.some(condition =>
          (!filters.month || condition.month === filters.month) &&
          condition.world_surf_rating === Number(filters.surfRating)
        );
      })
  
      // Filter by swell size (in meters)
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
  
      // Filter by crowd level (e.g., "Low", "Medium", "High")
      .filter(zone => {
        if (!filters.crowdFactor) return true;
        const crowd = conditionRanges.crowdFactor[filters.crowdFactor];
        if (!crowd) return false;
        return zone.conditions?.some(condition =>
          (!filters.month || condition.month === filters.month) &&
          condition.crowd === crowd
        );
      })
  
      // Filter by minimum number of sunny days
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
  
      // Filter by maximum number of rainy days
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
/**
 * src/utils/spotFilterOptions.js
 *
 * Centralized constant values and ranges for surf spot filtering.
 * These arrays and range maps drive the UI dropdown options and
 * filtering logic for various surf-spot attributes.
 */

// ============================
// Break Type Options
// ============================
/**
 * Types of surf breaks at a spot.
 * @type {string[]}
 */
export const breakTypeList = [
    'Beach break',
    'Reef break',
    'Point break',
    'River-mouth',
    'Slab',
  ];
  
  // ============================
  // Wave Direction Options
  // ============================
  /**
   * Primary wave direction at the spot.
   * @type {string[]}
   */
  export const waveDirectionList = [
    'Left',
    'Right',
    'Left and right',
  ];
  
  // Reuse for swell and wind directions
  /**
   * Wind direction options (same as wave directions).
   * @type {string[]}
   */
export const windDirectionList = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW'
  ];
  
  /**
   * Swell direction options (same as wave directions).
   * @type {string[]}
   */
  export const swellDirectionList = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW'
  ];
  
  // ============================
  // Swell Size Options & Ranges
  // ============================
  /**
   * Human-readable swell size categories.
   * @type {string[]}
   */
  export const swellSizeList = [
    'Under 1m',
    '1m - 1.5m',
    '1.5m - 2m',
    '2m - 3m',
    'Over 3m',
  ];
  
  /**
   * Numeric ranges (in meters) corresponding to each swell size category.
   * @type {Object<string, {min: number, max: number}>}
   */
  export const swellSizeRanges = {
    'Under 1m':    { min: 0,   max: 1   },
    '1m - 1.5m':   { min: 1.1, max: 1.5 },
    '1.5m - 2m':   { min: 1.6, max: 2   },
    '2m - 3m':     { min: 2.1, max: 3   },
    'Over 3m':     { min: 3.1, max: 30  },
  };
  
  // ============================
  // Surf Level Options
  // ============================
  /**
   * Recommended surfer ability levels.
   * @type {string[]}
   */
  export const surfLevelList = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Pro',
  ];
  
  // ============================
  // Tide Options
  // ============================
  /**
   * Ideal tide conditions.
   * @type {string[]}
   */
  export const bestTideList = [
    'Low',
    'Mid',
    'High',
  ];
  
  // ============================
  // Month Options
  // ============================
  /**
   * All calendar months for seasonal filtering.
   * @type {string[]}
   */
  export const monthList = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
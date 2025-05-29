// src/constants/filterOptions.js

/**
 * Centralized constant values and value ranges used in surf zone filtering.
 *
 * This file defines:
 * - Predefined options for select inputs in the UI (e.g., surf levels, months)
 * - Corresponding numerical or categorical ranges used for advanced filtering
 *
 * These values are shared between the frontend UI and filtering logic.
 */

// -----------------------------------------------------------------------------
// Selectable options for UI dropdowns (used in filter selects)
// -----------------------------------------------------------------------------

/**
 * List of all 12 months used for seasonal filtering.
 */
export const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  /**
   * Surf level options for different experience levels.
   */
  export const surfLevel = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  
  /**
   * Traveler types for user intent filtering.
   */
  export const travelerType = ['Solo', 'Couple', 'Family', 'Group'];
  
  /**
   * Perceived safety levels of the surf zones.
   */
  export const safety = ['Low', 'Moderate', 'High'];
  
  /**
   * Accommodation comfort level options.
   */
  export const comfort = ['Simple', 'Comfortable', 'Premium'];
  
  /**
   * Primary wave direction at the spot.
   */
  export const mainWaveDirection = ['Left', 'Right', 'Left and right'];
  
  /**
   * Relative cost of living for a surf destination.
   */
  export const cost = ['Cheap', 'Moderate', 'Expensive'];
  
  /**
   * General categories of water temperature in °C.
   */
  export const waterTemp_C = ['Freezing', 'Cold', 'Cool', 'Temperate', 'Warm', 'Hot'];
  
  /**
   * Global surf rating from 1 to 5.
   */
  export const surfRating = [1, 2, 3, 4, 5];
  
  /**
   * Ranges of average swell size in meters.
   */
  export const swellSize = ['Under 1m', '1m - 1.5m', '1.5m - 2m', '2m - 3m', 'Over 3m'];
  
  /**
   * Crowd density levels for surf conditions.
   */
  export const crowdFactor = ['Few people', 'Moderate', 'Crowded', 'Packed'];
  
  /**
   * Minimum number of sunny days per month.
   */
  export const sunnyDays = ['min 5', 'min 10', 'min 15', 'min 20', 'min 25'];
  
  /**
   * Maximum number of rainy days per month.
   */
  export const rainyDays = ['max 5', 'max 10', 'max 15', 'max 20', 'max 25'];
  
  // -----------------------------------------------------------------------------
  // Numerical/Categorical range definitions for filtering logic
  // -----------------------------------------------------------------------------
  
  /**
   * Water temperature ranges (°C) mapped from category labels.
   */
  export const waterTempRanges = {
    Freezing: { min: 0, max: 9 },
    Cold: { min: 10, max: 15 },
    Cool: { min: 16, max: 19 },
    Temperate: { min: 20, max: 23 },
    Warm: { min: 24, max: 27 },
    Hot: { min: 28, max: 30 },
  };
  
  /**
   * Swell size ranges (in meters) mapped from category labels.
   */
  export const swellSizeRanges = {
    'Under 1m': { min: 0, max: 1 },
    '1m - 1.5m': { min: 1.1, max: 1.5 },
    '1.5m - 2m': { min: 1.6, max: 2 },
    '2m - 3m': { min: 2.1, max: 3 },
    'Over 3m': { min: 3.1, max: 30 }, // Consider 30m as an upper limit
  };
  
  /**
   * Crowd factor mapping from UI labels to internal database values.
   */
  export const crowdFactorRanges = {
    'Few people': 'Low',
    'Moderate': 'Medium',
    'Crowded': 'High',
    'Packed': 'Very High',
  };
  
  /**
   * Minimum sunny days ranges per month.
   */
  export const sunnyDaysRanges = {
    'min 5': { min: 5, max: 31 },
    'min 10': { min: 10, max: 31 },
    'min 15': { min: 15, max: 31 },
    'min 20': { min: 20, max: 31 },
    'min 25': { min: 25, max: 31 },
  };
  
  /**
   * Maximum rainy days ranges per month.
   */
  export const rainyDaysRanges = {
    'max 5': { min: 0, max: 5 },
    'max 10': { min: 0, max: 10 },
    'max 15': { min: 0, max: 15 },
    'max 20': { min: 0, max: 20 },
    'max 25': { min: 0, max: 25 },
  };
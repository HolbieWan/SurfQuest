/**
 * Centralized constant values and ranges for surf spot filtering.
 */
export const breakTypeList        = ['Beach break','Reef break','Point break','River-mouth','Slab'];
export const waveDirectionList    = ['Left','Right','Left and right'];
export const windDirectionList    = waveDirectionList;
export const swellDirectionList   = waveDirectionList;
export const swellSizeList        = ['Under 1m','1m - 1.5m','1.5m - 2m','2m - 3m','Over 3m'];
export const swellSizeRanges      = {
  'Under 1m': { min:0,   max:1 },
  '1m - 1.5m': { min:1.1, max:1.5 },
  '1.5m - 2m': { min:1.6, max:2   },
  '2m - 3m': { min:2.1, max:3   },
  'Over 3m': { min:3.1, max:30  },
};
export const surfLevelList        = ['Beginner','Intermediate','Advanced','Pro'];
export const bestTideList         = ['Low','Mid','High'];
export const monthList            = ['January','February','March','April','May','June','July','August','September','October','November','December'];
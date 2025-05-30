/**
 * Filters a list of surf spots according to the given criteria.
 *
 * @param {Array} spots
 * @param {Object} f - filter values { name, breakType, waveDir, level, tide, swellSize, windDir, swellDir, month }
 * @param {Object} ranges - numeric ranges (e.g. swellSizeRanges)
 * @returns {Array}
 */
export function applySurfSpotFilters(spots, f, { swellSizeRanges }) {
    return spots
      .filter(s => !f.name          || s.name === f.name)
      .filter(s => !f.breakType     || s.break_type === f.breakType)
      .filter(s => !f.waveDir       || s.wave_direction === f.waveDir)
      .filter(s => !f.level         || s.surf_level.includes(f.level))
      .filter(s => !f.tide          || s.best_tide.includes(f.tide))
      .filter(s => {
        if (!f.swellSize) return true;
        const { min, max } = swellSizeRanges[f.swellSize] || {};
        return s.best_swell_size_meter >= min && s.best_swell_size_meter <= max;
      })
      .filter(s => !f.windDir       || s.best_wind_direction === f.windDir)
      .filter(s => !f.swellDir      || s.best_swell_direction === f.swellDir)
      .filter(s => !f.month         || s.best_months.includes(f.month));
  }
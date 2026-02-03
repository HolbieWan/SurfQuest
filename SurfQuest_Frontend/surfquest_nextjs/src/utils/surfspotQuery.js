/**
 * buildSurfSpotQuery
 * ------------------
 * Maps UI filters to backend query params for:
 * GET /api/v1/surfspots-lite/?...
 *
 * Backend supports:
 * - surfzone_slug
 * - best_month
 * - surf_level
 * - best_tide
 * - break_type
 * - wave_direction
 * - best_wind_direction
 * - best_swell_direction
 * - best_swell_size_meter_min / best_swell_size_meter_max
 */

export function buildSurfSpotQuery(filters, opts) {
  const p = new URLSearchParams();

  // zone (slug)
  if (filters.surfZone) p.set("surfzone_slug", filters.surfZone);

  // array filters (backend does __contains=[value])
  if (filters.bestMonth) p.set("best_month", filters.bestMonth);
  if (filters.surfLevel) p.set("surf_level", filters.surfLevel);
  if (filters.bestTide) p.set("best_tide", filters.bestTide);

  // exact match fields
  if (filters.breakType) p.set("break_type", filters.breakType);
  if (filters.waveDirection) p.set("wave_direction", filters.waveDirection);
  if (filters.bestWindDirection)
    p.set("best_wind_direction", filters.bestWindDirection);
  if (filters.bestSwellDirection)
    p.set("best_swell_direction", filters.bestSwellDirection);

  // swell size buckets -> min/max meters
  if (filters.bestSwellSize) {
    const r = opts?.swellSizeRanges?.[filters.bestSwellSize];
    if (r) {
      p.set("best_swell_size_meter_min", String(r.min));
      p.set("best_swell_size_meter_max", String(r.max));
    }
  }

  return p;
}

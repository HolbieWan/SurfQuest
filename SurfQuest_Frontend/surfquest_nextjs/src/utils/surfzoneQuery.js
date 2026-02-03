/**
 * Build query params for SurfZoneLiteListAPIView
 * based on selectedFilters + UI ranges.
 */

export function buildSurfZoneQuery(filters, ranges) {
  const p = new URLSearchParams();

  // ----------------------------
  // SurfZone-level filters
  // ----------------------------
  if (filters.country) p.set("country_slug", filters.country);
  if (filters.travelerType) p.set("traveler_type", filters.travelerType);
  if (filters.safety) p.set("safety", filters.safety);
  if (filters.comfort) p.set("confort", filters.comfort); // ✅ backend key
  if (filters.cost) p.set("cost", filters.cost);
  if (filters.mainWaveDirection)
    p.set("main_wave_direction", filters.mainWaveDirection);

  // ----------------------------
  // Condition (month-based) filters
  // Only apply if a month is selected
  // ----------------------------
  const month = filters.month || "";
  const wantsConditionFilters = Boolean(
    filters.surfLevel ||
    filters.sunnyDays ||
    filters.rainyDays ||
    filters.waterTemp ||
    filters.surfRating ||
    filters.swellSize ||
    filters.crowdFactor,
  );

  // ✅ If no month selected, we DO NOT send any condition params
  if (!month) {
    // You still can apply basic filters without month
    return p;
  }

  // Month selected => we can send condition filters
  // Always include month if user is using any seasonal filter
  // (and it also makes sense even if they only select month)
  p.set("month", month);

  if (filters.surfLevel) p.set("surf_level", filters.surfLevel);

  if (filters.waterTemp) {
    const r = ranges.waterTemp?.[filters.waterTemp];
    if (r) {
      p.set("water_temp_c_min", String(r.min));
      p.set("water_temp_c_max", String(r.max));
    }
  }

  if (filters.swellSize) {
    const r = ranges.swellSize?.[filters.swellSize];
    if (r) {
      p.set("swell_size_meter_min", String(r.min));
      p.set("swell_size_meter_max", String(r.max));
    }
  }

  if (filters.sunnyDays) {
    const r = ranges.sunnyDays?.[filters.sunnyDays];
    if (r) {
      p.set("sunny_days_min", String(r.min));
      p.set("sunny_days_max", String(r.max));
    }
  }

  if (filters.rainyDays) {
    const r = ranges.rainyDays?.[filters.rainyDays];
    if (r) {
      p.set("rain_days_min", String(r.min));
      p.set("rain_days_max", String(r.max));
    }
  }

  // Backend supports only MIN
  if (filters.surfRating) {
    p.set("surf_rating_min", String(filters.surfRating));
  }

  if (filters.crowdFactor) {
    const crowd = ranges.crowdFactor?.[filters.crowdFactor];
    if (crowd) p.set("crowd", crowd);
  }

  return p;
}
/**
 * reviewService.js
 * ----------------
 * Public reviews fetcher (no auth required).
 * Backend should support query params:
 * - surf_zone_id=<uuid>
 * - surf_spot_id=<uuid>
 */

import { API } from "@/config/api";

export async function fetchReviews({ surfZoneId, surfSpotId } = {}) {
  const base = API.public.reviews;
  if (!base) throw new Error("Missing reviews API base URL.");

  const params = new URLSearchParams();
  if (surfZoneId) params.set("surf_zone_id", surfZoneId);
  if (surfSpotId) params.set("surf_spot_id", surfSpotId);

  const url = params.toString() ? `${base}?${params.toString()}` : base;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Failed to fetch reviews.";
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) msg = text.slice(0, 200);
    }
    throw new Error(msg);
  }

  return res.json();
}

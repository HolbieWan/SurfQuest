/**
 * SurfZones Search Page (SSR + Client filters)
 * -------------------------------------------
 * - SSR: fetch initial surfzones-lite list for fast first paint + SEO
 * - Client: interactive filters with debounced refetch
 */

import { API } from "@/config/api";
import { fetchSurfZones } from "@/services/surfzoneService";
// import SearchSurfZoneClient from "@/components/SurfZones/SearchSurfZoneClient";
import SearchSurfZoneClient from "@/components/SurfZones/SearchSurfZoneClient";

function extractCountries(zones) {
  const map = new Map();

  (Array.isArray(zones) ? zones : []).forEach((z) => {
    const c = z?.country;
    if (!c) return;

    const label = c?.name || "Unknown";
    const value = c?.slug || c?.code || "";
    if (!value) return;

    if (!map.has(value)) map.set(value, { label, value });
  });

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export default async function SurfZonesPage() {
  const url = API.server.surfzones; // /api/v1/surfzones-lite/
  if (!url) {
    throw new Error(
      "Missing API base URL (NEXT_PUBLIC_API_BASE_URL / API_INTERNAL_BASE_URL)."
    );
  }

  // SSR: initial list, no-store for dev freshness
  let initialZones = [];
  try {
    const data = await fetchSurfZones(url, { cache: "no-store" });
    initialZones = Array.isArray(data) ? data : [];
  } catch {
    initialZones = [];
  }

  const initialCountries = extractCountries(initialZones);

  return (
    <SearchSurfZoneClient
      initialZones={initialZones}
      initialCountries={initialCountries}
    />
  );
}
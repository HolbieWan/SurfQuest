/**
 * SurfSpots Search Page (SSR)
 */

import { Suspense } from "react";
import { API } from "@/config/api";
import SearchSurfSpotsClient from "@/components/SurfSpots/SearchSurfSpotsClient";

async function fetchInitialSpots() {
  const url = API.server.surfspots;
  if (!url) throw new Error("Missing API base URL.");
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchZonesForDropdown() {
  const url = API.server.surfzones;
  if (!url) return [];
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Page() {
  const [initialSpots, initialZones] = await Promise.all([
    fetchInitialSpots(),
    fetchZonesForDropdown(),
  ]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white">
      <Suspense fallback={<div className="text-white pt-20">Loading…</div>}>
        <SearchSurfSpotsClient
          initialSpots={Array.isArray(initialSpots) ? initialSpots : []}
          initialZones={Array.isArray(initialZones) ? initialZones : []}
        />
      </Suspense>
    </div>
  );
}

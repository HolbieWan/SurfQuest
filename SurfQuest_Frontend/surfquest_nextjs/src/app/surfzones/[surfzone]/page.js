// """Page component for displaying surf zone details with SSR data fetching."""
// ============================
// External Dependencies
// ============================
import React from "react";

import SurfZoneDetails from "@/components/SurfZones/SurfZoneDetails";
import { API } from "@/config/api";

/**
 * SSR fetch surfzone detail
 * - In Docker SSR: use INTERNAL url (backend:8000)
 * - In browser/client: use PUBLIC url (localhost:8000 or deployed domain)
 */
async function fetchSurfZoneDetail(id) {
  // Supporte plusieurs noms selon ton config actuel
  const baseUrl = API.server.surfzonesDetail;

  if (!baseUrl) {
    throw new Error(
      "Missing SURFZONES_DETAIL base URL. Define it in config/api.js env vars.",
    );
  }

  const url = `${baseUrl}${id}/`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error("Surfzone detail fetch failed", res.status, url);
    return null;
  }
  return res.json();
}

// (optionnel mais utile SEO) : metadata dynamique par surfzone
export async function generateMetadata({ params }) {
  const id = params.surfzone;
  const surfzone = await fetchSurfZoneDetail(id);

  if (!surfzone) {
    return {
      title: "Surf zone not found - SurfQuest",
      description: "Surf zone not found.",
    };
  }

  return {
    title: `${surfzone.name} - SurfQuest`,
    description:
      surfzone.description || `Surf zone details for ${surfzone.name}`,
  };
}

export default async function SurfZonePage({ params }) {
  const id = params.surfzone;
  const surfzone = await fetchSurfZoneDetail(id);

  if (!surfzone) {
    return <p className="text-red-500 text-sm">Surf zone not found</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-screen bg-black text-white">
      <SurfZoneDetails surfzone={surfzone} />
    </div>
  );
}

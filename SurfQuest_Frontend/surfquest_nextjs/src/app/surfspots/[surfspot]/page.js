/**
 * SurfSpot Details Page (SSR)
 * - Fetch /surfspots-lite/ to build dropdown + slug->id
 * - Fetch /surfspots-detail/<id>/ for the selected spot
 */

import { notFound } from "next/navigation";
import { API } from "@/config/api";
import SurfSpotDetailsClient from "@/components/SurfSpots/SurfSpotDetailsClient";

async function fetchLiteSpots() {
  const url = API.server.surfspots;
  if (!url) throw new Error("Missing API base URL.");

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return [];
  return res.json();
}

async function fetchSpotDetail(id) {
  const base = API.server.surfspotsDetail;
  if (!base) throw new Error("Missing API base URL.");

  const res = await fetch(`${base}${id}/`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }) {
  const slug = decodeURIComponent(params.surfspot || "");

  const liteSpots = await fetchLiteSpots();
  const match = Array.isArray(liteSpots)
    ? liteSpots.find((s) => s.slug === slug)
    : null;

  if (!match) notFound();

  const spotData = await fetchSpotDetail(match.id);
  if (!spotData) notFound();

  // sort dropdown once on the server
  const sortedLite = Array.isArray(liteSpots)
    ? [...liteSpots].sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
    : [];

  return (
    <div className="flex flex-col items-center pt-10 min-h-screen bg-black text-white">
      <SurfSpotDetailsClient
        initialLiteSpots={sortedLite}
        initialSpot={spotData}
        initialSlug={slug}
      />
    </div>
  );
}
"use client";

/**
 * SurfSpotDetailsClient
 * - Receives SSR data (no bounce)
 * - Dropdown navigation
 * - Renders SurfSpotDetails
 */

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SurfSpotDetails from "@/components/SurfSpots/SurfSpotDetails";

export default function SurfSpotDetailsClient({
  initialLiteSpots = [],
  initialSpot = null,
  initialSlug = "",
}) {
  const router = useRouter();

  const [liteSpots] = useState(
    Array.isArray(initialLiteSpots) ? initialLiteSpots : [],
  );
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [spotData, setSpotData] = useState(initialSpot);

  // keep state in sync if route changes (client nav)
  useEffect(() => {
    setSelectedSlug(initialSlug);
    setSpotData(initialSpot);
  }, [initialSlug, initialSpot]);

  const handleSpotChange = (e) => {
    const newSlug = e.target.value;
    setSelectedSlug(newSlug);
    router.push(`/surfspots/${encodeURIComponent(newSlug)}`);
  };

  return (
    <>
      {/* Back link */}
      <div className="w-full flex justify-start mb-6">
        <div className="ml-10">
          <Link href="/surfspots">
            <h2 className="text-gray-500 text-lg hover:text-gray-300 hover:scale-105">
              👈🏻 Back to surf-spot search page
            </h2>
          </Link>
        </div>
      </div>

      {/* Surf spot selector */}
      <div className="w-full flex justify-center mb-8">
        <select
          className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[240px] hover:scale-105"
          value={selectedSlug}
          onChange={handleSpotChange}
        >
          {liteSpots.map((spot) => (
            <option key={spot.id} value={spot.slug}>
              {spot.name}
            </option>
          ))}
        </select>
      </div>

      {/* Spot details (SSR data -> no null) */}
      <SurfSpotDetails surfSpotData={spotData} />
    </>
  );
}

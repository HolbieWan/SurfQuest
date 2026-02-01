"use client";

/**
 * MonthBestDestinations (Client UI)
 *
 * Receives pre-filtered surf zones from the server (SSR) and displays them.
 * No client-side fetch is performed here (better performance and SEO).
 */

import React from "react";
import PulsingHeaderLink from "@/components/HomePage/PulsingHeaderLink";
import SurfZoneCard from "@/components/SurfZones/SurfZoneCard";

export default function MonthBestDestinations({ currentMonth, initialZones }) {
  const zones = Array.isArray(initialZones) ? initialZones : [];

  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white w-full">
      <PulsingHeaderLink />

      <h2 className="text-4xl text-center font-bold mt-12 mb-4 w-full px-4">
        🔥 Hot destinations in <span className="text-blue-300">{currentMonth}</span> 🔥
      </h2>

      {zones.length === 0 ? (
        <p className="text-gray-500 text-md text-center px-4 mt-4">
          No destinations found for{" "}
          <span className="text-blue-300">{currentMonth}</span>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4 rounded-md w-full">
          {zones.map((surfzone) => (
            <SurfZoneCard key={surfzone.id} surfzone={surfzone} />
          ))}
        </div>
      )}
    </div>
  );
}

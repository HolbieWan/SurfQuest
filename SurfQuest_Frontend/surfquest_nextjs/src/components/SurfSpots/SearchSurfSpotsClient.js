"use client";

/**
 * SearchSurfSpotsClient
 * ---------------------
 * - Receives SSR initial lists: initialSpots + initialZones
 * - Applies backend filtering via /surfspots-lite/?...
 * - Debounced fetch on filter changes
 * - Navigates to /surfspots/[slug] when a spot is selected
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { API } from "@/config/api";
import { fetchSurfSpots } from "@/services/surfspotService";
import { buildSurfSpotQuery } from "@/utils/surfspotQuery";

import SurfSpotCard from "@/components/SurfSpots/SurfSpotCard";
import FiltersGrid from "@/components/SurfSpots/FiltersGrid";
import * as opts from "@/utils/spotsFilterOptions";

function toUniqueOptions(list, getLabel, getValue) {
  const m = new Map();
  (Array.isArray(list) ? list : []).forEach((item) => {
    const value = getValue(item);
    if (!value) return;
    if (!m.has(value)) {
      m.set(value, { label: getLabel(item) || "Unknown", value });
    }
  });
  return Array.from(m.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export default function SearchSurfSpotsClient({
  initialSpots = [],
  initialZones = [],
    }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef(null);
  const didMountRef = useRef(false);

  // SSR data already displayed immediately
  const [spots, setSpots] = useState(
    Array.isArray(initialSpots) ? initialSpots : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    surfSpot: "", // slug
    surfZone: "", // surfzone_slug
    breakType: "",
    waveDirection: "",
    surfLevel: "",
    bestTide: "",
    bestSwellSize: "",
    bestWindDirection: "",
    bestSwellDirection: "",
    bestMonth: "",
  });

  // Build dropdown options from SSR payloads
  const uniqueZones = useMemo(
    () =>
      toUniqueOptions(
        initialZones,
        (z) => z?.name,
        (z) => z?.slug || z?.id || "",
      ),
    [initialZones],
  );

  const [uniqueSpots, setUniqueSpots] = useState(() =>
    toUniqueOptions(
      initialSpots,
      (s) => s?.name,
      (s) => s?.slug,
    ),
  );

  // Initialize surfSpot from URL (?surfspot=slug)
  useEffect(() => {
    const param = searchParams.get("surfspot");
    if (param) {
      setFilters((f) => ({ ...f, surfSpot: param }));
    }
  }, [searchParams]);

  // Debounced backend fetch on filter changes
  useEffect(() => {
    const base = API.public.surfspots;
    if (!base) return;

     // ✅ Skip first run to avoid refetch "flash" (SSR already gave us initialSpots)
  const hasAnyFilter =
    Object.entries(filters).some(([k, v]) => k !== "surfSpot" && v) ||
    Boolean(filters.surfSpot);

  if (!didMountRef.current) {
    didMountRef.current = true;

    // Si tu as un spot dans l’URL, là oui on veut fetch
    if (!hasAnyFilter) return;
  }

    const params = buildSurfSpotQuery(filters, opts);
    const url = params.toString() ? `${base}?${params.toString()}` : base;

    const t = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSurfSpots(url);
        const arr = Array.isArray(data) ? data : [];
        setSpots(arr);

        // update spot selector options from current result set
        setUniqueSpots(
          toUniqueOptions(
            arr,
            (s) => s?.name,
            (s) => s?.slug,
          ),
        );
      } catch (err) {
        setError(err?.message || "Failed to load surf spots.");
        setSpots([]);
        setUniqueSpots([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [filters]);

  const onFilterChange = (key) => (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key === "surfSpot" && value) {
      router.push(`/surfspots/${encodeURIComponent(value)}`);
    } else if (key !== "surfSpot") {
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

  const resetAll = () => {
    setFilters({
      surfSpot: "",
      surfZone: "",
      breakType: "",
      waveDirection: "",
      surfLevel: "",
      bestTide: "",
      bestSwellSize: "",
      bestWindDirection: "",
      bestSwellDirection: "",
      bestMonth: "",
    });
  };

  return (
    <>
      {!filters.surfSpot && (
        <h1 className="text-4xl font-bold mb-8 text-center pt-20">
          Find the best spots for <span className="text-blue-500">you</span> 😎
        </h1>
      )}

      {/* {loading && <p className="text-blue-500 text-center mt-4">Loading...</p>} */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!filters.surfSpot && (
        <>
          <FiltersGrid
            uniqueSpots={uniqueSpots}
            uniqueZone={uniqueZones}
            filters={filters}
            onFilterChange={onFilterChange}
            options={opts}
          />

          <button
            className="mt-8 mb-12 p-2 border border-red-500 rounded text-red-500 hover:scale-105"
            onClick={resetAll}
          >
            Reset Selection
          </button>
        </>
      )}

      <div ref={resultsRef} className="w-full px-4">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {spots.map((spot) => (
            <SurfSpotCard key={spot.id} surfspot={spot} />
          ))}
        </div>
      </div>
    </>
  );
}

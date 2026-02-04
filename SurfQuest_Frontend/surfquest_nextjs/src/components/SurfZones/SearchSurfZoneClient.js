"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { API } from "@/config/api";
import { fetchSurfZones } from "@/services/surfzoneService";
import { buildSurfZoneQuery } from "@/utils/surfzoneQuery";

import SurfZoneCard from "@/components/SurfZones/SurfZoneCard";
import BasicFiltersGrid from "@/components/SurfZones/BasicFiltersGrid";
import AdvancedFiltersGrid from "@/components/SurfZones/AdvancedFiltersGrid";

import {
  months,
  travelerType,
  safety,
  comfort,
  mainWaveDirection,
  cost,
  waterTempRanges,
  swellSizeRanges,
  crowdFactorRanges,
  sunnyDaysRanges,
  rainyDaysRanges,
} from "@/utils/filterOptions";

export default function SearchSurfZoneClient({
  initialZones = [],
  initialCountries = [],
}) {
  const router = useRouter();

  // ----------------------------
  // Data & UI state
  // ----------------------------
  const [surfZones, setSurfZones] = useState(
    Array.isArray(initialZones) ? initialZones : [],
  );
  const [countries, setCountries] = useState(
    Array.isArray(initialCountries) ? initialCountries : [],
  );
  const [zoneId, setZoneId] = useState(""); // for navigation
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // Filters (month starts empty on purpose)
  // ----------------------------
  const [selectedFilters, setSelectedFilters] = useState({
    country: "",
    month: "", // ✅ empty initial month
    travelerType: "",
    safety: "",
    comfort: "",
    mainWaveDirection: "",
    surfLevel: "",
    cost: "",
    waterTemp: "",
    surfRating: "",
    swellSize: "",
    crowdFactor: "",
    sunnyDays: "",
    rainyDays: "",
    bestMonths: "",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const resultsRef = useRef(null);
  const monthSelectorsRef = useRef(null);

  const conditionRanges = useMemo(
    () => ({
      waterTemp: waterTempRanges,
      swellSize: swellSizeRanges,
      crowdFactor: crowdFactorRanges,
      sunnyDays: sunnyDaysRanges,
      rainyDays: rainyDaysRanges,
    }),
    [],
  );

  // ----------------------------
  // Scroll helpers
  // ----------------------------
  const scrollToResults = () => {
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const scrollToMonthFilters = () => {
    setTimeout(
      () => monthSelectorsRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    key === "month" ? scrollToMonthFilters() : scrollToResults();
  };

  const handleReset = () => {
    setSelectedFilters({
      country: "",
      month: "", // ✅ empty month reset = show all zones
      travelerType: "",
      safety: "",
      comfort: "",
      mainWaveDirection: "",
      surfLevel: "",
      cost: "",
      waterTemp: "",
      surfRating: "",
      swellSize: "",
      crowdFactor: "",
      sunnyDays: "",
      rainyDays: "",
      bestMonths: "",
    });
    setZoneId("");
  };

  // ----------------------------
  // Debounced refetch when filters change
  // ----------------------------
  useEffect(() => {
    const urlBase = API.public.surfzones; // /api/v1/surfzones-lite/
    if (!urlBase) return;

    const params = buildSurfZoneQuery(selectedFilters, conditionRanges);
    const url = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;

    const t = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSurfZones(url, { cache: "no-store" });

        // Keep the "bestMonths" behavior as a small client-side filter
        const bestOnly =
          selectedFilters.bestMonths &&
          selectedFilters.month &&
          selectedFilters.bestMonths === selectedFilters.month;

        const finalData = bestOnly
          ? Array.isArray(data)
            ? data.filter(
                (z) =>
                  Array.isArray(z.best_months) &&
                  z.best_months.includes(selectedFilters.month),
              )
            : []
          : Array.isArray(data)
            ? data
            : [];

        setSurfZones(finalData);
      } catch (err) {
        setError(err?.message || "Failed to load filtered surf zones.");
        setSurfZones([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [selectedFilters, conditionRanges]);

  // ----------------------------
  // Zone selector options (id-safe)
  // ----------------------------
  const zonesForSelect = useMemo(() => {
    return (Array.isArray(surfZones) ? surfZones : [])
      .map((z) => ({ id: z?.id, name: z?.name }))
      .filter((z) => z.id && z.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [surfZones]);

  const gridColsClass =
    surfZones.length === 1
      ? "grid-cols-1"
      : surfZones.length === 2
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white rounded-lg">
      <h1 className="text-4xl text-center font-bold mb-8">
        Find the best destination for <span className="text-blue-500">you</span>{" "}
        😎
      </h1>

      {/* Error / Loading */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {/* {loading && <p className="text-blue-500 text-sm">Loading...</p>} */}

      {/* Zone Selector (ID) */}
      <select
        className="p-2 mb-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] hover:scale-105"
        value={zoneId}
        onChange={(e) => {
          const selectedId = e.target.value;
          setZoneId(selectedId);
          if (selectedId)
            router.push(`/surfzones/${encodeURIComponent(selectedId)}`);
        }}
      >
        <option value="">Choose a Surf Place</option>
        {zonesForSelect.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>

      <p className="text-gray-500 text-sm">or</p>

      <h2 className="text-2xl font-bold text-center col-span-full">
        Filter Surf Places by
      </h2>

      {/* Basic Filters */}
      <BasicFiltersGrid
        selectedFilters={selectedFilters}
        countries={countries} // [{label,value}]
        travelerType={travelerType}
        safety={safety}
        comfort={comfort}
        cost={cost}
        mainWaveDirection={mainWaveDirection}
        handleFilterChange={handleFilterChange}
        scrollToResults={scrollToResults}
      />

      {/* Seasonal Filters toggle + month selector */}
      <div
        ref={monthSelectorsRef}
        className="grid grid-cols-1 gap-3 place-items-center justify-center"
      >
        <button
          className="p-2 text-gray-500 hover:text-gray-400"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters
            ? "Hide seasonal Filters ▲"
            : "Show seasonal Filters ▼"}
        </button>

        {showAdvancedFilters && (
          <>
            <select
              className="p-2 border border-black rounded bg-pink-500 text-white text-center w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
              value={selectedFilters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
            >
              <option value="">Month</option>
              {months.map((m, index) => (
                <option key={index} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <p className="text-gray-500 text-sm">
              (Select a month to apply below filters)
            </p>
          </>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFiltersGrid
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          monthSelectorsRef={monthSelectorsRef}
        />
      )}

      {/* Reset */}
      <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">
        <button
          className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
          onClick={handleReset}
        >
          Reset Selection
        </button>
      </div>

      {/* Results */}
      <div
        ref={resultsRef}
        className="bg-black flex flex-col items-center pt-16 w-full"
      >
        <div
          className={`grid ${gridColsClass} bg-black p-4 gap-4 rounded-md mb-20 w-full max-w-7xl mx-auto`}
        >
          {surfZones.map((surfzone, index) => (
            <SurfZoneCard key={index} surfzone={surfzone} />
          ))}
        </div>
      </div>
    </div>
  );
}

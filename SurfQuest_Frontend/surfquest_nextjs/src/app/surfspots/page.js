// // src/app/surfspots/page.js

// 'use client';

// /**
//  * SearchSurfSpotsPage Component
//  * -----------------------------
//  * Provides a searchable/filterable interface for surf spots.
//  * Fetches all surf spots via the surfspotService, derives unique
//  * lists for spot names and zones, and applies a shared filtering
//  * utility to drive the UI. Results smoothly scroll into view upon
//  * filter changes. Selecting a surf-spot navigates to its details page.
//  */

// // ============================
// // External Dependencies
// // ============================
// import React, { useState, useEffect, useRef, Suspense } from 'react';
// import Cookies from 'js-cookie';
// import { useSearchParams, useRouter } from 'next/navigation';

// // ============================
// // Local Dependencies
// // ============================
// import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
// import { fetchSurfSpots } from '@/services/surfspotService';
// import { getUniqueSurfZones, getUniqueSurfSpots } from '@/utils/surfspotUtils';
// import { API } from "@/config/api";
// import { applySurfSpotFilters } from '@/utils/spotFilters';
// import * as opts from '@/utils/spotsFilterOption';
// import FiltersGrid from '@/components/SurfSpots/FiltersGrid';

// function SearchSurfSpotsPage() {
//   // ============================
//   // Router Hook & Search Params
//   // ============================
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ============================
//   // Refs
//   // ============================
//   const resultsRef = useRef(null);

//   // ============================
//   // State Management
//   // ============================
//   const [hydrated, setHydrated] = useState(false);
//   const [spots, setSpots] = useState([]);
//   const [uniqueZones, setUniqueZones] = useState([]);
//   const [uniqueSpots, setUniqueSpots] = useState([]);
//   const [filters, setFilters] = useState({
//     surfSpot: '',
//     surfZone: '',
//     breakType: '',
//     waveDirection: '',
//     surfLevel: '',
//     bestTide: '',
//     bestSwellSize: '',
//     bestWindDirection: '',
//     bestSwellDirection: '',
//     bestMonth: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ============================
//   // Hydration & Data Fetch
//   // ============================
//   useEffect(() => {
//     setHydrated(true);
//     const loadSpots = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const token = Cookies.get('access_token');
//         const data = await fetchSurfSpots(API.SURFSPOTS, token);
//         setSpots(data);
//         setUniqueZones(getUniqueSurfZones(data));
//         setUniqueSpots(getUniqueSurfSpots(data));

//         // Initialize surfSpot filter from URL param if present
//         const param = searchParams.get('surfspot');
//         if (param) {
//           setFilters(f => ({ ...f, surfSpot: param }));
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSpots();
//   }, [searchParams]);

//   // Avoid SSR mismatch
//   if (!hydrated) return null;

//   // ============================
//   // Apply Shared Filtering Utility
//   // ============================
//   const filteredSpots = applySurfSpotFilters(
//     spots,
//     {
//       name:      filters.surfSpot,
//       zone:      filters.surfZone,
//       breakType: filters.breakType,
//       waveDir:   filters.waveDirection,
//       level:     filters.surfLevel,
//       tide:      filters.bestTide,
//       swellSize: filters.bestSwellSize,
//       windDir:   filters.bestWindDirection,
//       swellDir:  filters.bestSwellDirection,
//       month:     filters.bestMonth,
//     },
//     { swellSizeRanges: opts.swellSizeRanges }
//   );

//   // ============================
//   // Handlers
//   // ============================

//   /**
//    * Handles changes to any filter input.
//    * - For non-spot filters, scrolls results into view.
//    * - For surfSpot selection, navigates to the detail page.
//    *
//    * @param {string} key - The filter key in state.
//    * @returns {Function}
//    */
//   const onFilterChange = (key) => (e) => {
//     const value = e.target.value;
//     setFilters(prev => ({ ...prev, [key]: value }));

//     if (key === 'surfSpot' && value) {
//       router.push(`/surfspots/${encodeURIComponent(value)}`);
//     } else if (key !== 'surfSpot') {
//       setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//     }
//   };

//   /**
//    * Resets all filter values to their defaults (empty strings).
//    */
//   const resetAll = () => {
//     setFilters({
//       surfSpot: '', surfZone: '', breakType: '', waveDirection: '',
//       surfLevel: '', bestTide: '', bestSwellSize: '',
//       bestWindDirection: '', bestSwellDirection: '', bestMonth: '',
//     });
//   };

//   // ============================
//   // JSX Output
//   // ============================
//   return (
//     <div className="flex flex-col items-center pt-20 min-h-screen bg-black text-white">

//       {/* Filters Section (shown when no spot is selected) */}
//       {!filters.surfSpot && (
//         <>
//           <h1 className="text-4xl font-bold mb-8 text-center">
//             Find the best spots for <span className="text-blue-500">you</span> 😎
//           </h1>

//           {Cookies.get('access_token') ? (
//             <>
//               {/* Error / Loading feedback */}
//               { loading && (<p className="text-blue-500 text-center mt-10">Loading...</p>) }
//               { error && (<p className="text-red-500 text-center mt-10">{error}</p>)}

//               <FiltersGrid
//                 uniqueSpots={uniqueSpots}
//                 uniqueZone={uniqueZones}
//                 filters={filters}
//                 onFilterChange={onFilterChange}
//                 options={opts}
//               />
//               <button
//                 className="mt-8 mb-12 p-2 border border-red-500 rounded text-red-500 hover:scale-105"
//                 onClick={resetAll}
//               >
//                 Reset Selection
//               </button>
//             </>
//           ) : (
//             <p className="text-gray-500 text-md text-center px-4">
//               Please{' '}
//               <a href="/signup" className="text-blue-400 hover:text-blue-600">
//                 sign up
//               </a>{' '}
//               or{' '}
//               <a href="/login" className="text-blue-400 hover:text-blue-600">
//                 log in
//               </a>{' '}
//               to have access to all features.
//             </p>
//           )}
//         </>
//       )}

//       {/* Results Section */}
//       <div ref={resultsRef} className="w-full px-4">
//         <div className="grid grid-cols-1 gap-10 mb-10">
//           {filteredSpots.map(spot => (
//             <SurfSpotCard key={spot.id} surfspot={spot} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Wrap in Suspense for safety
// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading…</div>}>
//       <SearchSurfSpotsPage />
//     </Suspense>
//   );
// }

// ====================================================================================================================================================================

"use client";

/**
 * SearchSurfSpotsPage (Client)
 * ----------------------------
 * Backend filtering via GET /api/v1/surfspots-lite/?...
 * - No auth token needed
 * - Debounced fetch on filters
 * - Spot selection navigates to /surfspots/[slug]
 */

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { API } from "@/config/api";
import { fetchSurfSpots } from "@/services/surfspotService";
import { fetchSurfZones } from "@/services/surfzoneService";
import { buildSurfSpotQuery } from "@/utils/surfspotQuery";

import SurfSpotCard from "@/components/SurfSpots/SurfSpotCard";
import FiltersGrid from "@/components/SurfSpots/FiltersGrid";
import * as opts from "@/utils/spotsFilterOption";

function SearchSurfSpotsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef(null);

  const [hydrated, setHydrated] = useState(false);

  const [spots, setSpots] = useState([]);
  const [uniqueZones, setUniqueZones] = useState([]); // [{label,value}] value=slug
  const [uniqueSpots, setUniqueSpots] = useState([]); // [{label,value}] value=spot.slug

  const [filters, setFilters] = useState({
    surfSpot: "", // ✅ store slug here
    surfZone: "", // ✅ store surfzone_slug here
    breakType: "",
    waveDirection: "",
    surfLevel: "",
    bestTide: "",
    bestSwellSize: "",
    bestWindDirection: "",
    bestSwellDirection: "",
    bestMonth: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------
  // Hydration + load zones list
  // ----------------------------
  useEffect(() => {
    setHydrated(true);

    const loadZones = async () => {
      try {
        const url = API.public.surfzones;
        if (!url) throw new Error("Missing API base URL...");
        const data = await fetchSurfZones(url, { cache: "no-store" });

        const list = (Array.isArray(data) ? data : [])
          .map((z) => ({
            label: z?.name || "Unknown",
            value: z?.slug || "",
          }))
          .filter((z) => z.value);

        // unique by value
        const m = new Map();
        list.forEach((z) => {
          if (!m.has(z.value)) m.set(z.value, z);
        });

        setUniqueZones(
          Array.from(m.values()).sort((a, b) => a.label.localeCompare(b.label)),
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadZones();
  }, []);

  // ----------------------------
  // Init surfSpot from URL param (?surfspot=slug)
  // ----------------------------
  useEffect(() => {
    const param = searchParams.get("surfspot");
    if (param) {
      setFilters((f) => ({ ...f, surfSpot: param }));
    }
  }, [searchParams]);

  // ----------------------------
  // Fetch spots (debounced) on filters
  // ----------------------------
  useEffect(() => {
    if (!hydrated) return;

    const base = API.public.surfspots; // /api/v1/surfspots-lite/
    if (!base) return;

    const params = buildSurfSpotQuery(filters, opts);
    const url = params.toString() ? `${base}?${params.toString()}` : base;

    const t = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSurfSpots(url);
        const arr = Array.isArray(data) ? data : [];
        setSpots(arr);

        // Build spot selector options from current results
        const optsSpots = arr
          .map((s) => ({ label: s?.name || "Unnamed", value: s?.slug || "" }))
          .filter((s) => s.value);

        const m = new Map();
        optsSpots.forEach((s) => {
          if (!m.has(s.value)) m.set(s.value, s);
        });

        setUniqueSpots(
          Array.from(m.values()).sort((a, b) => a.label.localeCompare(b.label)),
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
  }, [filters, hydrated]);

  if (!hydrated) return null;

  // ----------------------------
  // Handlers
  // ----------------------------
  const onFilterChange = (key) => (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key === "surfSpot" && value) {
      // ✅ navigate by slug
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

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-black text-white">
      {!filters.surfSpot && (
        <h1 className="text-4xl font-bold mb-8 text-center">
          Find the best spots for <span className="text-blue-500">you</span> 😎
        </h1>
      )}

      {loading && <p className="text-blue-500 text-center mt-4">Loading...</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!filters.surfSpot && (
        <>
          <FiltersGrid
            uniqueSpots={uniqueSpots} // [{label,value}] value=slug
            uniqueZone={uniqueZones} // [{label,value}] value=surfzone_slug
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
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchSurfSpotsPage />
    </Suspense>
  );
}
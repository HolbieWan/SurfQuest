"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Reviews from "@/components/Reviews/Reviews";
import SurfSpotCard from '@/components/SurfSpots/SurfSpotCard';
import ImageCarousel from '@/components/SurfSpots/Carousel';
import SurfZoneForecast from '@/components/SurfZones/SurfZoneForecast/SurfZoneForecastCardWindy';
// import SurfZoneForecast from '../components/SurfZoneForecastCardStormglassAPI';


const surfSpotsApiUrl = process.env.NEXT_PUBLIC_SURFSPOTS_API_URL;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
const token = Cookies.get('access_token');

console.log(surfSpotsApiUrl);
console.log('Environment:', environment);
console.log(token);

function SearchSurfSpotsPage() {
  const [hydrated, setHydrated] = useState(false);

  const [uniqueSurfZonesList, setUniqueSurfZonesList] = useState([]);
  const [uniqueSurfSpotsList, setUniqueSurfSpotsList] = useState([]);
  const [selectedSurfZone, setSelectedSurfZone] = useState('');
  const [selectedSurfSpot, setSelectedSurfSpot] = useState('');
  const [selectedBreakType, setSelectedBreakType] = useState('');
  const [selectedWaveDirection, setSelectedWaveDirection] = useState('');
  const [selectedBestWindDirection, setSelectedBestWindDirection] = useState('');
  const [selectedBestSwellDirection, setSelectedBestSwellDirection] = useState('');
  const [selectedBestSwellSize, setSelectedBestSwellSize] = useState('');
  const [selectedSurfLevel, setSelectedSurfLevel] = useState('');
  const [selectedBestTide, setSelectedBestTide] = useState('');
  // const [selectedSurfHazards, setSelectedSurfHazards] = useState('');
  // const [uniqueSurfHazardsList, sethUniqueSurfHazardsList] = useState([]);
  // const [selectedBestMonths, setSelectedBestMonths] = useState('');
  // const [selectedMonth, setSelectedMonth] = useState('January');  /*new Date().toLocaleString("default", { month: "long" }) */
  const [surfSpots, setSurfSpots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const breakTypeList = ['Beach break', 'Reef break', 'Point break', 'River-mouth', 'Slab'];
  const waveDirectionList = ['Left', 'Right', 'Left and right'];
  const windDirectionList = ['N', 'N-NE', 'NE', 'E-NE', 'E', 'E-SE', 'SE', 'S-SE', 'S', 'S-SW', 'SW', 'W-SW', 'W', 'W-NW', 'NW', 'N-NW'];
  const swellDirectionList = ['N', 'N-NE', 'NE', 'E-NE', 'E', 'E-SE', 'SE', 'S-SE', 'S', 'S-SW', 'SW', 'W-SW', 'W', 'W-NW', 'NW', 'N-NW'];
  const swellSizeList = ["Under 1m", "1m - 1.5m", "1.5m - 2m", "2m - 3m", "Over 3m"];
  const swellSizeRanges = {
    "Under 1m": { min: 0, max: 1 },
    "1m - 1.5m": { min: 1.1, max: 1.5 },
    "1.5m - 2m": { min: 1.6, max: 2 },
    "2m - 3m": { min: 2.1, max: 3 },
    "Over 3m": { min: 3.1, max: 30 },
  };
  const surfLevelList = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  const bestTideList = ['Low', 'Mid', 'High'];
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // const surfHazardsList = ['Rocks', 'Reef', 'Sharks', 'Jellyfish', 'Rips', 'Undertow', 'Currents'];

  const resultsRef = useRef(null);

  useEffect(() => {
    setHydrated(true);

    // Fetch surf zones data
    const fetchAndFilterSurfSpots = async () => {
      setLoading(true);
      setError('');
      try {
        const surfSpotsResponse = await fetch(`${surfSpotsApiUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
          credentials: 'include',
        });

        if (!surfSpotsResponse.ok) {
          const errorData = await surfSpotsResponse.json();
          setError(errorData.detail || 'Request failed, please try again');
          return;
        }
        const data = await surfSpotsResponse.json();
        console.log('Response data: ', data);
        setSurfSpots(data);

        // Extract unique SurfZones from surfSpots data
        const uniqueSurfZonesList = [...new Set(data.map(item => item.surfzone.name))];
        setUniqueSurfZonesList(uniqueSurfZonesList);

        // Extract unique SurfSpots from surfSpots data
        const uniqueSurfSpotsList = [...new Set(data.map(item => item.name))];
        setUniqueSurfSpotsList(uniqueSurfSpotsList);

        // const uniqueSurfHazardsList = [...new Set(data.flatMap(item => item.surf_hazards))]
        //   // .map(hazard => `No ${hazard}`);
        // sethUniqueSurfHazardsList(uniqueSurfHazardsList);



        // Set selected SurfZone from query parameter (link clicked from SurfZones page)
        // const surfzone = searchParams.get('surfzone');
        // if (surfzone) {
        //   setSelectedSurfZone(surfzone);
        // }

        const paramSurfSpot = searchParams.get('surfspot');
        if (paramSurfSpot) {
          setSelectedSurfSpot(paramSurfSpot);
        }

      } catch (err) {
        setError(`Request failed: ${err.message}`);

      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterSurfSpots();
  }, [searchParams]);

  if (!hydrated) return null;

  const handleReset = () => {
    setSelectedSurfZone('');
    setSelectedBreakType('');
    setSelectedWaveDirection('');
    setSelectedBestWindDirection('');
    setSelectedBestSwellDirection('');
    setSelectedBestSwellSize('');
    setSelectedSurfLevel('');
    setSelectedBestTide('');
  };

  // Filter surf spot by surf zone
  const filteredSurfSpots = surfSpots
    .filter(spot => !selectedSurfSpot || spot.name === selectedSurfSpot)
    .filter(spot => !selectedSurfZone || spot.surfzone.name === selectedSurfZone)
    .filter(spot => !selectedBreakType || spot.break_type === selectedBreakType)
    .filter(spot => !selectedWaveDirection || spot.wave_direction === selectedWaveDirection)
    .filter(spot => !selectedBestWindDirection || spot.best_wind_direction === selectedBestWindDirection)
    .filter(spot => !selectedBestSwellDirection || spot.best_swell_direction === selectedBestSwellDirection)
    .filter(spot => {
      if (!selectedBestSwellSize) return true;
      const { min, max } = swellSizeRanges[selectedBestSwellSize] || {};
      return spot.best_swell_size_meter >= min && spot.best_swell_size_meter <= max
        ;
    })
    .filter(spot => !selectedSurfLevel || spot.surf_level.includes(selectedSurfLevel))
    .filter(spot => !selectedBestTide || spot.best_tide.includes(selectedBestTide))  
    // .filter(spot => !selectedSurfHazards || !spot.surf_hazards.includes(selectedSurfHazards))
    // .filter(spot => !selectedBestMonths || spot.best_months.includes(selectedBestMonths));


  console.log(surfSpots);

  // Get surfSpot object from the array of objects: surfSpots based on selectedSurfSpot
  const surfSpot = surfSpots.find(spot => spot.name === selectedSurfSpot);
  console.log("Surfspot object",surfSpot);

  // Extract surfSpotId from the selected surfSpot
  const surfSpotId = surfSpot?.id || null;
  console.log("Surf Spot ID:", surfSpotId);

  // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get Condition object from the array of objects: surfSpot.surfzone based on selected SurfZone
  // const monthCondition = surfSpot?.surfzone?.conditions.find((item) => item.month === selectedMonth);
  // console.log(monthCondition);

  // Get the surfzone image from the surfSpot object
  // const surfZoneImage = surfSpot?.surfzone?.zone_images?.[0]?.image || null;

  const scrollToResults = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white">
      {/* <h1 className="text-4xl font-bold">Surf spots</h1> */}
      {/* <p className="text-sm mt-8">Select a Surf-Zone</p> */}
      
      {!selectedSurfSpot && (
        <div>
          <h1 className="text-4xl text-center font-bold mb-8">Find the best spots for <span className="text-blue-500">you</span> 😎</h1>

          { token ? (
            <>
              {error && <div><p className="text-red-500 text-sm">Please sign-up or log-in to have access to this feature</p></div>}
              {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4 gap-3 items-center justify-center place-items-center">

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] w-auto transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedSurfSpot}
                  onChange={(e) => setSelectedSurfSpot(e.target.value)}
                >
                  <option value="">View all surf-spots</option>
                  {uniqueSurfSpotsList.sort().map((spot, index) => (
                    <option key={index} value={spot}>
                      {spot}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedSurfZone}
                  onChange={(e) => {
                    setSelectedSurfZone(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Surf Zone</option>
                  {uniqueSurfZonesList.sort().map((surf_zone, index) => (
                    <option key={index} value={surf_zone}>
                      {surf_zone}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedBreakType}
                  onChange={(e) => {
                    setSelectedBreakType(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Break Type</option>
                  {breakTypeList.sort().map((break_type, index) => (
                    <option key={index} value={break_type}>
                      {break_type}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedWaveDirection}
                  onChange={(e) => {
                    setSelectedWaveDirection(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Wave Direction</option>
                  {waveDirectionList.map((wave_direction, index) => (
                    <option key={index} value={wave_direction}>
                      {wave_direction}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedSurfLevel}
                  onChange={(e) => {
                    setSelectedSurfLevel(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Surf Level</option>
                  {surfLevelList.map((surf_level, index) => (
                    <option key={index} value={surf_level}>
                      {surf_level}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedBestTide}
                  onChange={(e) => {
                    setSelectedBestTide(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Best Tide</option>
                  {bestTideList.map((best_tide, index) => (
                    <option key={index} value={best_tide}>
                      {best_tide}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedBestSwellSize}
                  onChange={(e) => {
                    setSelectedBestSwellSize(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Best Swell Size</option>
                  {swellSizeList.map((swell_size, index) => (
                    <option key={index} value={swell_size}>
                      {swell_size}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedBestWindDirection}
                  onChange={(e) => {
                    setSelectedBestWindDirection(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Best Wind Direction</option>
                  {windDirectionList.map((wind_direction, index) => (
                    <option key={index} value={wind_direction}>
                      {wind_direction}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:border-white hover:scale-105"
                  value={selectedBestSwellDirection}
                  onChange={(e) => {
                    setSelectedBestSwellDirection(e.target.value);
                    scrollToResults();
                  }}
                >
                  <option value="">Best Swell Direction</option>
                  {swellDirectionList.map((swell_direction, index) => (
                    <option key={index} value={swell_direction}>
                      {swell_direction}
                    </option>
                  ))}
                </select>

                {/* <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:scale-105"
                  value={selectedSurfHazards}
                  onChange={(e) => setSelectedSurfHazards(e.target.value)}
                >
                  <option value="">(No) Surf Hazards </option>
                  {uniqueSurfHazardsList.sort().map((surf_hazards, index) => (
                    <option key={index} value={surf_hazards}>
                      {surf_hazards}
                    </option>
                  ))}
                </select> */}

                {/* <select
                  className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] transform transition-transform duration-200 hover:scale-105"
                  value={selectedBestMonths}
                  onChange={(e) => setSelectedBestMonths(e.target.value)}
                >
                  <option value="">Best Months</option>
                  {monthList.map((best_months, index) => (
                    <option key={index} value={best_months}>
                      {best_months}
                    </option>
                  ))}
                </select> */}

              </div>

              {/* Reset Button*/}
              <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">

                <button
                  className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
                  onClick={handleReset}
                >Reset Selection
                </button>
                
              </div>
            </>
          ) : (
              <p className="text-gray-500 text-center">Please log in to enjoy surf spot search features</p>
          )}

        </div>
      )}

      {selectedSurfZone && (
        <>
          <h1 className="text-white text-4xl font-bold text-center p-2 w-full mt-10">{selectedSurfZone} Surf Forecast</h1>

          {/* Bloc 4 : card: SURFFORECAST */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
          <div className=" items-center justify-center mt-6">
            {selectedSurfZone && <SurfZoneForecast selectedSurfZone={selectedSurfZone} />}
          </div>

          <h1 className="text-white text-4xl font-bold text-center p-2 w-full mt-10">{selectedSurfZone} Surf Spots</h1>

        </>
      )}
      

      {selectedSurfSpot &&
        <>
          <div className="w-full flex justify-start">
            <div className="ml-10 text-left ">
            <Link
              href={`/surfspots`}
              onClick={(e) => {
                e.preventDefault(); // Prevents unnecessary navigation reload
                setSelectedSurfSpot("");
              }}
            >
                <h2 className="text-gray-500 text-lg text-left hover:text-gray-300 transform transition-transform duration-300 hover:scale-105"> 👈🏻 Back to surf-spot search page</h2>
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-4xl text-center text-white font-bold mb-8">{selectedSurfSpot}</h1>
          </div>
        </>
      }

      <div ref={resultsRef} className="flex flex-col items-center justify-start pt-10 w-full">

          {/* Bloc inferieur: card: list of surf SPOTS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="grid grid-cols-1 gap-10 p-4 mb-10 rounded-md items-center justify-center w-full">

          {/* Bloc 1 : card: list of SURFSPOTS */}
          {filteredSurfSpots.map((surfspot, index) => (
            < SurfSpotCard key={index} surfspot={surfspot} selectedSurfSpot={selectedSurfSpot} />
          ))}

        </div>

          {/* Bloc 3 : card: list of REVIEWS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="group grid grid-cols-1 rounded-md items-center justify-center">
          {selectedSurfSpot && <Reviews selectedSurfSpot={selectedSurfSpot} surfSpotId={surfSpotId}/>}
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchSurfSpotsPage />
    </Suspense>
  );
}
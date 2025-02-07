"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import Reviews from "../components/Reviews";

const surfSpotsApiUrl = 'http://localhost:8000/api/surfspots/';
const token = Cookies.get('access_token');

console.log(surfSpotsApiUrl);
console.log(token);

function SurfSpotsPage() {
  const [surfZones, setSurfZones] = useState([]);
  const [uniqueSurfSpots, setuniqueSurfSpots] = useState([]);
  const [selectedSurfZone, setSelectedSurfZone] = useState('');
  const [selectedSurfSpot, setSelectedSurfSpot] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');  /*new Date().toLocaleString("default", { month: "long" }) */
  const [surfSpots, setSurfSpots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch surf zones data
    const fetchData = async () => {
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
        const uniqueSurfZones = [...new Set(data.map(item => item.surfzone.name))];
        setSurfZones(uniqueSurfZones);

        // Extract unique SurfSpots from surfSpots data
        const uniqueSurfSpotsList = [...new Set(data.map(item => item.name))];
        setuniqueSurfSpots(uniqueSurfSpotsList);

        // Set slected SurfZone from query parameter (link clicked from SurfZones page)
        const surfzone = searchParams.get('surfzone');
        if (surfzone) {
          setSelectedSurfZone(surfzone);
        }

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

    fetchData();
  }, [searchParams]);

  // Filter surf spot by surf zone
  const filteredSurfSpots = selectedSurfSpot
    ? surfSpots.filter(spot => spot.name === selectedSurfSpot)
    : surfSpots;
  
  console.log(surfSpots);

  // Get surfSpot object from the array of objects: surfSpots based on selectedSurfZone
  const surfSpot = surfSpots.find(spot => spot.name === selectedSurfSpot);
  console.log("Surfspot object",surfSpot);

  // Extract surfSpotId from the selected surfSpot
  const surfSpotId = surfSpot?.id || null;
  console.log("Surf Spot ID:", surfSpotId);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get Condition object from the array of objects: surfSpot.surfzone based on selected SurfZone
  const monthCondition = surfSpot?.surfzone?.conditions.find((item) => item.month === selectedMonth);
  console.log(monthCondition);

  //Get the surfzone image from the surfSpot object
  const surfZoneImage = surfSpot?.surfzone?.zone_images?.[0]?.image || null;

  return (
    <div className="flex flex-col items-center justify-start pt-10 h-screen bg-black text-white">
      {/* <h1 className="text-4xl font-bold">Surf spots</h1> */}
      {/* <p className="text-sm mt-8">Select a Surf-Zone</p> */}

      <select
        className="mt-4 p-2 border border-black rounded bg-blue-500 text-white text-center"
        value={selectedSurfSpot}
        onChange={(e) => setSelectedSurfSpot(e.target.value)}
      >
        <option value="">View all surf-spots</option>
        {uniqueSurfSpots.map((paramSurfSpot, index) => (
          <option key={index} value={paramSurfSpot}>
            {paramSurfSpot}
          </option>
        ))}
      </select>

      <div className="flex flex-col items-center justify-start pt-16 w-full">
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>} 

          {/* Bloc inferieur: card: list of surf SPOTS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="grid grid-cols-1 gap-10 p-4 mb-10 rounded-md items-center justify-center w-full">

          {/* Bloc 1 : card: list of SURFSPOTS */}
          {filteredSurfSpots.map((surfspot, index) => (

            <div key={index} className="flex flex-col md:flex-row items-start justify-center space-y-10 md:space-y-0 md:space-x-12">

              <div className="group bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3 transform transition-transform duration-500 hover:scale-110" style={{ height: '400px' }}>
                <h2 className="text-pink-400 text-2xl font-bold text-center md:text-left">{surfspot.name}</h2>
                <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">{surfspot.surfzone.name}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">{surfspot.description}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-black font-bold">{surfspot.best_months.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell direction: <span className="text-black font-bold">{surfspot.best_swell_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell size: <span className="text-black font-bold">{surfspot.best_swell_size} ft</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best tide: <span className="text-black font-bold">{surfspot.best_tide.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best wind direction: <span className="text-black font-bold">{surfspot.best_wind_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-black font-bold">{surfspot.surf_hazards.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf level: <span className="text-black font-bold">{surfspot.surf_level.join(', ')}</span></div>
              </div>

              <div className="bg-black rounded-md group flex-shrink-0 w-full md:w-1/2 lg:w-2/4" style={{ height: '400px' }}>
                {surfspot.spot_images && surfspot.spot_images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image.image} alt={surfspot.name} className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
                ))}
              </div>

            </div>
          ))}
        </div>

          {/* Bloc 3 : card: list of REVIEWS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="group grid grid-cols-1  rounded-md items-center justify-center">
          {selectedSurfSpot && <Reviews selectedSurfSpot={selectedSurfSpot} surfSpotId={surfSpotId}/>}
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurfSpotsPage />
    </Suspense>
  );
}
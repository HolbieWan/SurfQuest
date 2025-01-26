"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

const surfSpotsApiUrl = 'http://localhost:8000/api/surfspots/';
const token = Cookies.get('access_token');

console.log(surfSpotsApiUrl);
console.log(token);

export default function SurfSpotsPage() {
  const [surfZones, setSurfZones] = useState([]);
  const [selectedSurfZone, setSelectedSurfZone] = useState('');
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

        // Set slected SurfZone from query parameter (link clicked from SurfZones page)
        const surfzone = searchParams.get('surfzone');
        if (surfzone) {
          setSelectedSurfZone(surfzone);
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
  const filteredSurfSpots = selectedSurfZone
    ? surfSpots.filter(spot => spot.surfzone.name === selectedSurfZone)
    : surfSpots;
  
  console.log(surfSpots);

  // Get surfSpot object from the array of objects: surfSpots based on selectedSurfZone
  const surfSpot = surfSpots.find(spot => spot.surfzone.name === selectedSurfZone);
  console.log(surfSpot);

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Surf spots</h1>
      <p className="text-sm mt-8">Select Surf-Zone</p>

      <select
        className="mt-4 p-2 border border-gray-300 rounded bg-blue-400 text-black text-center"
        value={selectedSurfZone}
        onChange={(e) => setSelectedSurfZone(e.target.value)}
      >
        <option value="">All Surf-Zones</option>
        {surfZones.map((surfzone, index) => (
          <option key={index} value={surfzone}>
            {surfzone}
          </option>
        ))}
      </select>

      <div className="flex flex-col items-center justify-start pt-16 w-full">
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}

        <div className="grid grid-cols-1 p-4 gap-8 rounded-md">

          <div className="flex flex-col items-center justify-start w-full">
            {selectedSurfZone && (
              <>
                {/* <h2 className="text-2xl font-bold mt-10 mb-8 text-left">{selectedSurfZone} infos</h2> */}
                <div className="bg-white rounded-md p-4 flex flex-col justify-center border border-blue-500 overflow-hidden w-full md:w-1/2 lg:w-1/3" style={{ height: '500px' }}>
                  <h2 className="text-blue-500 text-2xl font-bold text-center mb-2 w-full">{surfSpot.surfzone.name}</h2>
                  {surfSpot && (
                    <>
                      <div className="mt-2 text-md text-gray-700 text-center mb-2"><span className="">{surfSpot.surfzone.description}</span></div>
                      <div className="mt-2 text-sm text-gray-800 text-center">Near city: <span className="text-black font-bold">{surfSpot.surfzone.nearest_city}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Near airport: <span className="text-black font-bold">{surfSpot.surfzone.nearest_airport}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Safety: <span className="text-black font-bold">{surfSpot.surfzone.safety}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Health hazards: <span className="text-black font-bold">{surfSpot.surfzone.health_hazards.join(', ')}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Surf hazards: <span className="text-black font-bold">{surfSpot.surfzone.surf_hazards.join(', ')}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Traveler type: <span className="text-black font-bold">{surfSpot.surfzone.traveler_type.join(', ')}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Best months: <span className="text-black font-bold">{surfSpot.surfzone.best_months.join(', ')}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Confort: <span className="text-black font-bold">{surfSpot.surfzone.confort}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Cost of living: <span className="text-black font-bold">{surfSpot.surfzone.cost}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">language: <span className="text-black font-bold">{surfSpot.surfzone.language}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Currency: <span className="text-black font-bold">{surfSpot.surfzone.currency}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Main religion: <span className="text-black font-bold">{surfSpot.surfzone.religion}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Surroundings: <span className="text-black font-bold">{surfSpot.surfzone.surroundings}</span></div>
                      <div className="mt-2 text-sm text-gray-700 text-center">Main waves direction: <span className="text-black font-bold">{surfSpot.surfzone.main_wave_direction}</span></div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-start justify-start lg:ml-28 w-full">
            {selectedSurfZone && (
              <>
                <h2 className="text-2xl font-bold mt-10 text-left">Popular surf spots in {selectedSurfZone}</h2>
              </>
            )}
          </div>

          {filteredSurfSpots.map((surfspot, index) => (

            <div key={index} className="flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">

              <div className="bg-black rounded-md overflow-hidden group flex-shrink-0 w-full md:w-1/2 lg:w-2/4" style={{ height: '400px' }}>
                {surfspot.spot_images && surfspot.spot_images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image.image} alt={surfspot.name} className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
                ))}
              </div>

              <div className="bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3" style={{ height: '400px' }}>
                <h2 className="text-black text-2xl font-bold text-center md:text-left">{surfspot.name}</h2>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left font-semibold">{surfspot.surfzone.name}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">{surfspot.description}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-black font-bold">{surfspot.best_months.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell direction: <span className="text-black font-bold">{surfspot.best_swell_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell size: <span className="text-black font-bold">{surfspot.best_swell_size} ft</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best tide: <span className="text-black font-bold">{surfspot.best_tide.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best wind direction: <span className="text-black font-bold">{surfspot.best_wind_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-black font-bold">{surfspot.surf_hazards.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf level: <span className="text-black font-bold">{surfspot.surf_level.join(', ')}</span></div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
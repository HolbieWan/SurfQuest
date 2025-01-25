"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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

      } catch (err) {
        setError(`Request failed: ${err.message}`);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter surf spot by surf zone
  const filteredSurfSpots = selectedSurfZone
    ? surfSpots.filter(spot => spot.surfzone.name === selectedSurfZone)
    : surfSpots;

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Surf spots</h1>
      <p className="text-lg mt-8">Select Surf-Zone</p>
      <select
        className="mt-4 p-2 border border-gray-300 rounded bg-white text-black"
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
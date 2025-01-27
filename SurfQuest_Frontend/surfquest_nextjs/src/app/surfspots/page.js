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

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get Condition object from the array of objects: surfSpot.surfzone based on selected SurfZone
  const monthCondition = surfSpot?.surfzone?.conditions.find((item) => item.month === selectedMonth);
  console.log(monthCondition);

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Surf spots</h1>
      <p className="text-sm mt-8">Select Surf-Zone</p>

      <select
        className="mt-4 p-2 border border-black rounded bg-blue-500 text-white text-center"
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

          {/* Bloc superieur: card INFOS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 rounded-md">

          <div className="flex flex-col items-center justify-start w-full">
            {selectedSurfZone && (
              <>
                <div className="bg-gray-800 rounded-xl p-16 flex flex-col justify-center borde overflow-hidden w-full" style={{ height: '700px' }}>
                  <h2 className="text-white bg-blue-500 rounded-lg text-2xl font-bold text-center mb-6 w-full p-2">Zone infos: {surfSpot.surfzone.name}</h2>
                  <div className="bg-white rounded-xl p-10 flex flex-col justify-center border border-gray-200 overflow-hidden w-full" style={{ height: '550px'}}>
                    {surfSpot && (
                      <>
                        <div className="mt-2 text-md text-gray-700 text-center md:text-center font-semibold mb-2"><span className="">{surfSpot.surfzone.description}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left ">Near city: <span className="text-black font-bold">{surfSpot.surfzone.nearest_city}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left ">Near airport: <span className="text-black font-bold">{surfSpot.surfzone.nearest_airport}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Safety: <span className="text-black font-bold">{surfSpot.surfzone.safety}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Health hazards: <span className="text-black font-bold">{surfSpot.surfzone.health_hazards.join(', ')}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-black font-bold">{surfSpot.surfzone.surf_hazards.join(', ')}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Traveler type: <span className="text-black font-bold">{surfSpot.surfzone.traveler_type.join(', ')}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-black font-bold">{surfSpot.surfzone.best_months.join(', ')}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Confort: <span className="text-black font-bold">{surfSpot.surfzone.confort}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Cost of living: <span className="text-black font-bold">{surfSpot.surfzone.cost}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">language: <span className="text-black font-bold">{surfSpot.surfzone.language}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Currency: <span className="text-black font-bold">{surfSpot.surfzone.currency}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Main religion: <span className="text-black font-bold">{surfSpot.surfzone.religion}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surroundings: <span className="text-black font-bold">{surfSpot.surfzone.surroundings}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Main waves direction: <span className="text-black font-bold">{surfSpot.surfzone.main_wave_direction}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

            {/* Bloc superieur 2: card: CONDITIONS */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
          <div className="flex flex-col items-center justify-start w-full">
            
            {selectedSurfZone && (
              <>
                <div className="bg-gray-800 rounded-xl p-16 flex flex-col justify-center overflow-hidden w-full" style={{ height: '700px' }}>
                  <h2 className="text-white bg-blue-500 rounded-lg text-2xl font-bold text-center mb-6 p-2 w-full">Surf conditions: {surfSpot.surfzone.name}</h2>
                  <div className="bg-white rounded-xl p-10 flex flex-col justify-center border border-gray-200 overflow-hidden" style={{ height: '550px' }}>

                    <select
                      className="mt-4 p-2 rounded bg-blue-500 text-white text-center w-1/4 mb-4"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Select a Month</option>
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    {selectedSurfZone && surfSpot && surfSpot.surfzone && monthCondition && (
                      <>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Water temp: <span className="text-black font-bold">{monthCondition.water_temp_c} °c</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Average swell size: <span className="text-black font-bold">{monthCondition.swell_size_meter} m</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Swell consistency: <span className="text-black font-bold">{monthCondition.swell_consistency} %</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Recomended surf level: <span className="text-black font-bold">{monthCondition.surf_level.join(', ')}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Crowds: <span className="text-black font-bold">{monthCondition.crowd}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf rating: <span className="text-black font-bold">{monthCondition.world_surf_rating} *</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Min air temp: <span className="text-black font-bold">{monthCondition.min_air_temp_c} °c</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Max air temp: <span className="text-black font-bold">{monthCondition.max_air_temp_c} °c</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Rainy days: <span className="text-black font-bold">{monthCondition.rain_days} / month</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Sunny days: <span className="text-black font-bold">{monthCondition.sunny_days} / month</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Wind force: <span className="text-black font-bold">{monthCondition.wind_force}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Wind direction: <span className="text-black font-bold">{monthCondition.wind_direction}</span></div>
                        <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Wind consistency: <span className="text-black font-bold">{monthCondition.wind_consistency} %</span></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

          {/* Bloc inferieur: card: list of surf SPOTS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center w-full">

          <div className="flex flex-col items-center justify-center w-full">
            {selectedSurfZone && (
              <>
                <h2 className="text-2xl font-bold mt-10 text-center bg-blue-500 rounded-lg p-2">Popular surf spots in {selectedSurfZone}</h2>
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
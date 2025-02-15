"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';
import { useParams } from "next/navigation"; 
import Reviews from "../components/Reviews";

const surfSpotsApiUrl = 'http://localhost:8000/api/surfspots/';
const token = Cookies.get('access_token');

console.log(surfSpotsApiUrl);
console.log(token);

function SurfZoneDetailsPage() {
  const { surfzone } = useParams();
  const decodedSurfZone = decodeURIComponent(surfzone || "");
  const [surfZones, setSurfZones] = useState([]);
  const [selectedSurfZone, setSelectedSurfZone] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('January');  /*new Date().toLocaleString("default", { month: "long" }) */
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

        // Set the selected surf zone from the URL
        if (decodedSurfZone) {
          setSelectedSurfZone(decodedSurfZone);
        }

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
  }, [decodedSurfZone]);

  // Filter surf spot by surf zone
  const filteredSurfSpots = surfSpots.filter(
    (spot) => spot.surfzone.name === selectedSurfZone
  );
  console.log(filteredSurfSpots);

  // Wait for data before filtering
  if (!surfSpots.length) return <p className="text-white">Loading surf spots...</p>;

  // Get surfSpot object from the array of objects: surfSpots based on selectedSurfZone
  const surfSpot = surfSpots.find(spot => spot.surfzone.name === selectedSurfZone);
  console.log(surfSpot);

  // Extract surfZoneId from the selected surfSpot
  const surfZoneId = surfSpot?.surfzone?.id || "No ID Available";
  console.log("Surf Zone ID:", surfZoneId);

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
        value={selectedSurfZone}
        onChange={(e) => setSelectedSurfZone(e.target.value)}
      >
        <option value="">Select Surf-zone</option>
        {surfZones.map((surfzone, index) => (
          <option key={index} value={surfzone}>
            {surfzone}
          </option>
        ))}
      </select>

      <div className="flex flex-col items-center justify-start pt-10 w-full">
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}

          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
          <div>
            {selectedSurfZone && (
              <>
                <h1 className="text-white text-4xl font-bold text-center mb-6 p-2 w-full">Zone infos</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 rounded-lg items-stretch justify-center mb-10">

                  {/* Bloc superieur: card INFOS */}
                  <div className="group flex flex-col items-center justify-start w-full max-w-lg  ">
                    <div className="bg-white rounded-lg p-10 flex flex-col justify-start border overflow-hidden w-full transform transition-transform duration-500 group-hover:scale-110" /*style={{ height: '700px' }}*/>
                      <h2 className="text-blue-500 text-4xl font-bold text-center lg:text-left mb-6 p-2">{surfSpot.surfzone.name}</h2>
                        {surfSpot && (
                          <>
                            <div className="mt-2 text-md text-black text-center lg:text-left font-semibold mb-4"><span className="">{surfSpot.surfzone.description}</span></div>

                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Near city: <span className="font-bold text-cyan-500">{surfSpot.surfzone.nearest_city}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Near airport: <span className="font-bold text-cyan-500">{surfSpot.surfzone.nearest_airport}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Safety: <span className="font-bold text-cyan-500">{surfSpot.surfzone.safety}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Health hazards: <span className="font-bold text-cyan-500">{surfSpot.surfzone.health_hazards.join(', ')}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Surf hazards: <span className="font-bold text-cyan-500">{surfSpot.surfzone.surf_hazards.join(', ')}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Traveler type: <span className="font-bold text-cyan-500">{surfSpot.surfzone.traveler_type.join(', ')}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Best months: <span className="font-bold text-cyan-500">{surfSpot.surfzone.best_months.join(', ')}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Confort: <span className="font-bold text-cyan-500">{surfSpot.surfzone.confort}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Cost of living: <span className="font-bold text-cyan-500">{surfSpot.surfzone.cost}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">language: <span className="font-bold text-cyan-500">{surfSpot.surfzone.language}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Currency: <span className="font-bold text-cyan-500">{surfSpot.surfzone.currency}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Main religion: <span className="font-bold text-cyan-500">{surfSpot.surfzone.religion}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Surroundings: <span className="font-bold text-cyan-500">{surfSpot.surfzone.surroundings}</span></div>
                            <div className="mt-2 text-sm text-gray-700 text-center lg:text-left">Main waves direction: <span className="font-bold text-cyan-500">{surfSpot.surfzone.main_wave_direction}</span></div>
                          </>
                        )}
                    </div>
                  </div>
                  
                  {/* Bloc superieur 2: card: CONDITIONS */}
                  {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
                  <div className="group flex flex-col items-center justify-start w-full max-w-lg rounded-lg">
                    
                    {selectedSurfZone  && surfSpot && surfSpot.surfzone && (
                      <>
                        <img src={surfZoneImage} alt={surfSpot.surfzone.name} className="w-full object-cover rounded-lg transform transition-transform duration-500 hover:scale-110 overflow-hidden"/>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bloc Conditions */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
          <div className="flex flex-col items-center justify-start w-full">
            
            {selectedSurfZone && (
              <>
                {/* <h1 className="text-white text-4xl font-bold text-center mb-6 p-2 w-full">Surf conditions</h1> */}
                <div className="bg-black rounded-lg p-10 flex flex-col justify-center items-center overflow-hidden" style={{ height: '700px' }}>
                <h2 className="text-white rounded-lg text-4xl font-bold text-center mb-6 p-2 w-full">Surf Conditions</h2> {/*<span className="text-blue-400 font-bold">{surfSpot.surfzone.name}</span>*/}
                  <select
                      className="ml-4 rounded bg-blue-500 text-white text-center w-60 text-2xl p-1 mb-4"
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
                  
                
                  <div className="bg-black rounded-lg p-4 flex flex-col justify-center overflow-hidden">

                    
                    {selectedSurfZone && surfSpot && surfSpot.surfzone && monthCondition && (
                      <>
                        <div className="p-2 flex flex-col justify-center mb-10 overflow-hidden">
                          <div className="mt-2 text-lg text-white text-center">Surf rating: <span className="text-pink-400 font-bold">{'★'.repeat(monthCondition.world_surf_rating)}{'☆'.repeat(5 - monthCondition.world_surf_rating)}</span></div>
                          <div className="mt-2 text-lg text-white text-center">Recomended surf level: <span className="text-pink-400 font-bold">{monthCondition.surf_level.join(', ')}</span></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 rounded-md">

                          <div className="group bg-blue-400 rounded-lg p-4 flex flex-col justify-center border border-gray-700 overflow-hidden transform transition-transform duration-500 hover:scale-110" style={{ height: '300px' }}>
                            <div className="text-lg lg:text-xl text-white font-semibold text-center mb-10">Surf</div>
                            <div className="mt-2 text-sm text-black text-center">Water temp: <span className="text-white font-bold">{monthCondition.water_temp_c} °c</span></div>
                            <div className="mt-2 text-sm text-black text-center">Average swell size: <span className="text-white font-bold">{monthCondition.swell_size_meter} m</span></div>
                            <div className="mt-2 text-sm text-black text-center">Swell consistency: <span className="text-white font-bold">{monthCondition.swell_consistency} %</span></div>
                            <div className="mt-2 text-sm text-black text-center">Surf crowd: <span className="text-white font-bold">{monthCondition.crowd}</span></div>
                          </div>

                          <div className="group bg-green-500 rounded-lg p-4 flex flex-col justify-center border border-gray-700 overflow-hidden transform transition-transform duration-500 hover:scale-110" style={{ height: '300px' }}>
                            <div className="text-lg lg:text-xl text-white font-semibold text-center mb-10">Weather</div>
                            <div className="mt-2 text-sm text-black text-center">Min air temp: <span className="text-white font-bold">{monthCondition.min_air_temp_c} °c</span></div>
                            <div className="mt-2 text-sm text-black text-center">Max air temp: <span className="text-white  font-bold">{monthCondition.max_air_temp_c} °c</span></div>
                            <div className="mt-2 text-sm text-black text-center">Rainy days: <span className="text-white  font-bold">{monthCondition.rain_days} / month</span></div>
                            <div className="mt-2 text-sm text-black text-center">Sunny days: <span className="text-white  font-bold">{monthCondition.sunny_days} / month</span></div>
                          </div>

                          <div className="group bg-orange-400 rounded-lg p-4 flex flex-col justify-center border border-gray-700 overflow-hidden transform transition-transform duration-500 hover:scale-110" style={{ height: '300px' }}>
                            <div className="text-lg lg:text-xl text-white font-semibold text-center mb-10">Wind</div>
                            <div className="mt-2 text-sm text-black text-center">Wind force: <span className="text-white  font-bold">{monthCondition.wind_force}</span></div>
                            <div className="mt-2 text-sm text-black text-center">Wind direction: <span className="text-white  font-bold">{monthCondition.wind_direction}</span></div>
                            <div className="mt-2 text-sm text-black text-center">Wind consistency: <span className="text-white  font-bold">{monthCondition.wind_consistency} %</span></div>
                            <div className="mt-2 text-sm text-orange-400 text-center">'</div>
                          </div>

                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bloc inferieur: card: list of surf SPOTS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="grid grid-cols-1 p-4 gap-10 mb-10 rounded-md items-center justify-center w-full">

          <div className="flex flex-col items-center justify-center w-full">
            {selectedSurfZone && (
              <>
                <h2 className="text-4xl font-bold mt-10 text-center rounded-lg p-2">Popular surf spots</h2>
              </>
            )}
          </div>

          {filteredSurfSpots.map((surfspot, index) => (

            <div key={index} className="flex flex-col md:flex-row items-start justify-center space-y-10 md:space-y-0 md:space-x-12">

              <div className="bg-black rounded-md group flex-shrink-0 w-full md:w-1/2 lg:w-2/4" style={{ height: '400px' }}>
                {surfspot.spot_images && surfspot.spot_images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image.image} alt={surfspot.name} className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
                ))}
              </div>

              <div className="group bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3 transform transition-transform duration-500 hover:scale-110" style={{ height: '400px' }}>
                <h2 className="text-pink-400 text-2xl font-bold text-center md:text-left">{surfspot.name}</h2>
                <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">{surfspot.surfzone.name}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">{surfspot.description}</div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-cyan-500 font-bold">{surfspot.best_months.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell direction: <span className="text-cyan-500 font-bold">{surfspot.best_swell_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell size: <span className="text-cyan-500 font-bold">{surfspot.best_swell_size} ft</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best tide: <span className="text-cyan-500 font-bold">{surfspot.best_tide.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best wind direction: <span className="text-cyan-500 font-bold">{surfspot.best_wind_direction}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-cyan-500 font-bold">{surfspot.surf_hazards.join(', ')}</span></div>
                <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf level: <span className="text-cyan-500 font-bold">{surfspot.surf_level.join(', ')}</span></div>
              </div>

            </div>
          ))}
        </div>

          {/* Bloc 3 : card: list of REVIEWS */}
          {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     */}
        <div className="group grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
          {selectedSurfZone && <Reviews selectedSurfZone={selectedSurfZone} surfZoneId={surfZoneId}/>}
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurfZoneDetailsPage />
    </Suspense>
  );
}
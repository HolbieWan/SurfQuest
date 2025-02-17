// "use client";

// import React, { useState, useEffect, Suspense } from 'react';
// import Cookies from 'js-cookie';

// const APIKey = '7ca336b0-ec84-11ef-ae24-0242ac130003-7ca3371e-ec84-11ef-ae24-0242ac130003';
// const surfForecastApiUrl = 'https://api.stormglass.io/v2/weather/point';
// const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
// const token = Cookies.get('access_token');

// function SurfZoneForecast({ selectedSurfZone }) {
//   const [surfZoneForecast, setSurfZoneForecast] = useState(null);
//   const [surfZone, setSurfZone] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSurfZoneData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const response = await fetch(`${surfZonesApiUrl}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           mode: 'cors',
//           credentials: 'include',
//         });

//         if (!response.ok) throw new Error('Failed to fetch surf zone data');
        
//         const data = await response.json();
//         const selectedZone = data.find(zone => zone.name === selectedSurfZone);
//         setSurfZone(selectedZone);

//       } catch (err) {
//         setError(err.message);

//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSurfZoneData();
//   }, [selectedSurfZone]);

//   useEffect(() => {
//     if (!surfZone) return;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchApiData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const url = `${surfForecastApiUrl}?lat=${surfZone.latitude}&lng=${surfZone.longitude}&params=waveHeight,windSpeed,windDirection,waterTemperature,swellDirection,swellHeight,swellPeriod`;
        
//         const surfForecastApiResponse = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': APIKey,
//           },
//           signal,
//         });

//         if (!surfForecastApiResponse.ok) throw new Error('Failed to fetch forecast');

//         const data = await surfForecastApiResponse.json();
//         setSurfZoneForecast(data);

//       } catch (err) {
//         if (err.name === 'AbortError') {
//           console.log('Request cancelled due to timeout');
//         } else {
//           setError(err.message);
//         }

//       } finally {
//         setLoading(false);
//       }
//     };
//     const timeoutId = setTimeout(() => controller.abort(), 5000);
//     fetchApiData();

//     return () => clearTimeout(timeoutId);
//   }, [surfZone]);

//   if (loading) return <p className="text-blue-500">Loading Surf Forecast...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="bg-black rounded-lg p-4">
//       {surfZone && (
//         <h2 className="text-white text-xl font-bold">{surfZone.name} Live Forecast</h2>
//       )}
//       {surfZoneForecast ? (
//         <ul className="text-white">
//           <li>Wave Height: {surfZoneForecast.hours[0].waveHeight?.noaa} m</li>
//           <li>Wind Speed: {surfZoneForecast.hours[0].windSpeed?.noaa} m/s</li>
//           <li>Wind Direction: {surfZoneForecast.hours[0].windDirection?.noaa}°</li>
//           <li>Water Temp: {surfZoneForecast.hours[0].waterTemperature?.noaa} °C</li>
//           <li>Swell Height: {surfZoneForecast.hours[0].swellHeight?.noaa} m</li>
//           <li>Swell Period: {surfZoneForecast.hours[0].swellPeriod?.noaa} s</li>
//           <li>Swell Direction: {surfZoneForecast.hours[0].swellDirection?.noaa}°</li>
//         </ul>
//       ) : (
//         <p>No forecast available.</p>
//       )}
//     </div>
//   );
// }

// export default function SurfZoneForecastCard({ selectedSurfZone }) {
//   return (
//     <Suspense fallback={<p className="text-blue-500">Loading Surf Forecast...</p>}>
//       <SurfZoneForecast selectedSurfZone={selectedSurfZone} />
//     </Suspense>
//   );
// }
// "use client";

// import React, { useState, useEffect, Suspense } from 'react';
// import Cookies from 'js-cookie';

// const APIKey = '7ca336b0-ec84-11ef-ae24-0242ac130003-7ca3371e-ec84-11ef-ae24-0242ac130003';
// const surfForecastApiUrl = 'https://api.stormglass.io/v2/weather/point';
// const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
// const token = Cookies.get('access_token');

// // Helper to convert a degree value into an arrow representation.
// function getDirectionArrow(deg) {
//   const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
//   const index = Math.round(deg / 45) % 8;
//   return directions[index];
// }

// function SurfZoneForecast({ selectedSurfZone }) {
//   const [surfZoneForecast, setSurfZoneForecast] = useState(null);
//   const [surfZone, setSurfZone] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // 1) Fetch surf zone details (latitude/longitude) from your API.
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

//   // 2) Once we have the surf zone’s coordinates, fetch Stormglass data.
//   useEffect(() => {
//     if (!surfZone) return;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchForecastData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         // Request waveHeight, windSpeed, windDirection, etc.
//         const url = `${surfForecastApiUrl}?lat=${surfZone.latitude}&lng=${surfZone.longitude}&params=waveHeight,windSpeed,windDirection,waterTemperature,swellDirection,swellHeight,swellPeriod`;
//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': APIKey,
//           },
//           signal,
//         });
//         if (!response.ok) throw new Error('Failed to fetch forecast');

//         const data = await response.json();

//         // Log the raw data so you can see how many data points are returned
//         console.log('Full forecast data:', data);
//         console.log('Number of hourly data points:', data.hours.length);

//         // 3) Filter to only show 3 times a day (6am, 12pm, 6pm) for the next 2 days.
//         const now = new Date();
//         const twoDaysFromNow = new Date();
//         twoDaysFromNow.setDate(now.getDate() + 2);

//         const hoursWanted = [6, 12, 18]; // 6am, 12pm, 6pm

//         const filteredHours = data.hours.filter((hour) => {
//           const dateObj = new Date(hour.time);
//           const hourVal = dateObj.getHours();
//           return (
//             hoursWanted.includes(hourVal) &&
//             dateObj >= now &&
//             dateObj < twoDaysFromNow
//           );
//         });

//         console.log('Filtered hours:', filteredHours);
//         // Overwrite the original "hours" array with our filtered subset
//         const filteredData = { ...data, hours: filteredHours };

//         setSurfZoneForecast(filteredData);
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

//     // Abort if it takes more than 5 seconds
//     const timeoutId = setTimeout(() => controller.abort(), 5000);
//     fetchForecastData();
//     return () => clearTimeout(timeoutId);
//   }, [surfZone]);

//   if (loading) return <p className="text-blue-500">Loading Surf Forecast...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!surfZoneForecast) return null;

//   // 4) Render the filtered data in a grid:
//   const hours = surfZoneForecast.hours;
//   // Build your display objects
//   const renderedDays = hours.map((hour) => {
//     const dateObj = new Date(hour.time);
//     return {
//       date: dateObj.toLocaleString('en-US', {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//         hour: 'numeric',
//       }),
//       temp: hour.waterTemperature?.noaa
//         ? hour.waterTemperature.noaa.toFixed(1)
//         : 'N/A',
//       windSpeed: hour.windSpeed?.noaa
//         ? (hour.windSpeed.noaa * 3.6).toFixed(1)
//         : 'N/A', // m/s to km/h
//       windDir: hour.windDirection?.noaa
//         ? getDirectionArrow(hour.windDirection.noaa)
//         : 'N/A',
//       cloudCover: 'N/A', // Not requested from Stormglass
//       swellHeight: hour.swellHeight?.noaa
//         ? hour.swellHeight.noaa.toFixed(1)
//         : 'N/A',
//       swellPeriod: hour.swellPeriod?.noaa
//         ? hour.swellPeriod.noaa.toFixed(1)
//         : 'N/A',
//       swellDir: hour.swellDirection?.noaa
//         ? getDirectionArrow(hour.swellDirection.noaa)
//         : 'N/A',
//     };
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 items-center justify-items-center">
//       {renderedDays.map((day, idx) => (
//         <div
//           key={idx}
//           className="bg-blue-500 p-4 rounded-lg text-center w-[160px] transform transition-transform duration-500 hover:scale-110"
//         >
//           <p className="font-semibold mb-2">{day.date}</p>
//           <p>🌡️ {day.temp}°C</p>
//           <p>💨 {day.windSpeed} km/h {day.windDir}</p>
//           <p>☁️ {day.cloudCover}</p>
//           <p>🌊 {day.swellHeight} m {day.swellDir}</p>
//           <p>⏱️ {day.swellPeriod} s</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Wrap in a Suspense boundary, if desired.
// export default function SurfZoneForecastCard({ selectedSurfZone }) {
//   return (
//     <Suspense fallback={<p className="text-blue-500">Loading Surf Forecast...</p>}>
//       <SurfZoneForecast selectedSurfZone={selectedSurfZone} />
//     </Suspense>
//   );
// }
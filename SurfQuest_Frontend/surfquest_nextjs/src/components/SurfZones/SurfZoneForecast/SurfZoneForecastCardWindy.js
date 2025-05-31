"use client";

/**
 * SurfZoneForecastCard Component
 * ------------------------------
 * Fetches and displays a multi-day surf forecast for a given surf zone
 * using the Windy.com point-forecast API. First retrieves the geographic
 * coordinates for the selected surf zone from the backend, then queries
 * Windy’s “gfs” and “gfsWave” models for weather and wave data.
 * Presents 6 unique daily summaries (temperature, wind, cloud cover,
 * swell height, swell period, and arrow direction) in a responsive grid.
 *
 * @param {Object} props
 * @param {string} props.selectedSurfZone - Name of the surf zone for which to fetch the forecast.
 * @returns {JSX.Element|null} A grid of daily forecasts, or loading/error indicators.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';

// ============================
// Configuration Constants
// ============================
// API key for Windy.com point-forecast service
const APIKey = 'UmpC41QE7vcwtTKhlLLI9DhpkVqA1hoG';
// Windy.com forecast endpoint (point-forecast v2)
const surfForecastApiUrl = 'https://api.windy.com/api/point-forecast/v2';
// Base URL for surf zone metadata (to fetch latitude/longitude)
const surfZonesApiUrl = process.env.NEXT_PUBLIC_SURFZONES_API_URL;
// JWT access token from cookies for authenticating surf zone metadata requests
const token = Cookies.get('access_token');

// ============================
// Helper Functions
// ============================
/**
 * Converts a wind/swell degree (0–360) to a compass arrow symbol.
 *
 * @param {number} deg - Wind or swell direction in degrees.
 * @returns {string} A unicode arrow representing one of 8 principal directions.
 */
function getDirectionArrow(deg) {
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/**
 * SurfZoneForecast Component
 * --------------------------
 * Orchestrates fetching surf zone coordinates, querying Windy’s API,
 * and transforming the raw data into a daily summary for rendering.
 *
 * @param {Object} props
 * @param {string} props.selectedSurfZone - The surf zone name selected by the user.
 * @returns {JSX.Element|null} A grid of daily forecast cards, or loading/error messages.
 */
function SurfZoneForecast({ selectedSurfZone }) {
  // ============================
  // Component State
  // ============================
  const [forecast, setForecast] = useState(null);     // Holds combined weather + waves data
  const [surfZone, setSurfZone] = useState(null);     // Holds the fetched surf zone metadata (including coords)
  const [error, setError] = useState('');             // Error message if any fetch fails
  const [loading, setLoading] = useState(false);      // Loading indicator for API calls

  // ============================
  // Fetch Surf Zone Metadata
  // ============================
  useEffect(() => {
    if (!selectedSurfZone) return;

    const fetchSurfZoneData = async () => {
      setLoading(true);
      try {
        // Retrieve all surf zones from backend; filter by exact match on name
        const response = await fetch(`${surfZonesApiUrl}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        const zone = data.find((z) => z.name === selectedSurfZone);
        setSurfZone(zone);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurfZoneData();
  }, [selectedSurfZone]);

  // ============================
  // Fetch Weather & Wave Forecast
  // ============================
  useEffect(() => {
    if (!surfZone) return;

    const fetchForecastData = async () => {
      setLoading(true);
      try {
        // Build POST payload for weather (gfs model)
        const weatherBody = JSON.stringify({
          lat: surfZone.latitude,
          lon: surfZone.longitude,
          model: 'gfs',
          parameters: ['temp', 'wind', 'lclouds', 'mclouds', 'hclouds'],
          levels: ['surface'],
          key: APIKey,
        });

        // Query Windy.com for weather data
        const weatherResponse = await fetch(surfForecastApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: weatherBody,
        });
        const weatherData = await weatherResponse.json();

        // Build POST payload for waves (gfsWave model)
        const waveBody = JSON.stringify({
          lat: surfZone.latitude,
          lon: surfZone.longitude,
          model: 'gfsWave',
          parameters: ['waves', 'swell1'],
          levels: ['surface'],
          key: APIKey,
        });

        // Query Windy.com for wave data
        const waveResponse = await fetch(surfForecastApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: waveBody,
        });
        const waveData = await waveResponse.json();

        // Combine into single forecast object
        setForecast({ weather: weatherData, waves: waveData });
      } catch (err) {
        setError('Failed to load surf forecast.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [surfZone]);

  // ============================
  // Conditional Rendering: Loading / Error / No Data
  // ============================
  if (loading) return <p className="text-blue-500">Loading Surf Forecast...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!forecast) return null;

  // ============================
  // Transform Raw Forecast into Daily Summaries
  // ============================
  const { weather, waves } = forecast;
  const uniqueDates = [];
  const days = weather.ts
    .filter((timestamp) => {
      // Only keep one entry per calendar day, up to 6 days
      const dateStr = new Date(timestamp).toLocaleDateString();
      if (!uniqueDates.includes(dateStr)) {
        uniqueDates.push(dateStr);
        return true;
      }
      return false;
    })
    .slice(0, 6)
    .map((timestamp, i) => ({
      date: new Date(timestamp).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      temp: (Math.round(weather['temp-surface'][i] - 273.15)).toFixed(1), // Convert K→°C
      windSpeed: (Math.round(
        Math.hypot(weather['wind_u-surface'][i], weather['wind_v-surface'][i]) * 3.6
      )).toFixed(1), // m/s → km/h
      windDir: getDirectionArrow(
        Math.atan2(weather['wind_v-surface'][i], weather['wind_u-surface'][i]) * (180 / Math.PI)
      ),
      cloudCover: Math.round(
        weather['lclouds-surface'][i] ||
        weather['mclouds-surface'][i] ||
        weather['hclouds-surface'][i]
      ),
      swellHeight: waves['waves_height-surface'][i]?.toFixed(1),
      swellPeriod: waves['waves_period-surface'][i]?.toFixed(1),
      swellDir: getDirectionArrow(waves['waves_direction-surface'][i]),
    }));

  // ============================
  // Render Forecast Grid
  // ============================
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10 items-center justify-items-center">
      {days.map((day, idx) => (
        <div
          key={idx}
          className="bg-blue-500 p-4 rounded-lg text-center w-[160px] transform transition-transform duration-500 hover:scale-110"
        >
          <p className="font-semibold mb-2">{day.date}</p>
          <p>🌡️ {day.temp}°C</p>
          <p>💨 {day.windSpeed} km/h {day.windDir}</p>
          <p>☁️ {day.cloudCover}%</p>
          <p>🌊 {day.swellHeight} m {day.swellDir}</p>
          <p>⏱️ {day.swellPeriod} s</p>
        </div>
      ))}
    </div>
  );
}

/**
 * SurfZoneForecastCard Component
 * ------------------------------
 * Wraps SurfZoneForecast in React.Suspense to show a fallback while loading.
 *
 * @param {Object} props
 * @param {string} props.selectedSurfZone - The surf zone name passed down to fetch data.
 * @returns {JSX.Element}
 */
export default function SurfZoneForecastCard({ selectedSurfZone }) {
  return (
    <Suspense fallback={<p className="text-blue-500">Loading Surf Forecast...</p>}>
      <SurfZoneForecast selectedSurfZone={selectedSurfZone} />
    </Suspense>
  );
}
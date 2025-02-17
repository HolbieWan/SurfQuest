"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';

const APIKey = 'UmpC41QE7vcwtTKhlLLI9DhpkVqA1hoG';
const surfForecastApiUrl = 'https://api.windy.com/api/point-forecast/v2';
const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

function SurfZoneForecast({ selectedSurfZone }) {
  const [forecast, setForecast] = useState(null);
  const [surfZone, setSurfZone] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch surf zone data (lat, lon)
  useEffect(() => {
    const fetchSurfZoneData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${surfZonesApiUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch surf zone data');
        
        const data = await response.json();
        const selectedZone = data.find(zone => zone.name === selectedSurfZone);
        if (!selectedZone) throw new Error('Selected surf zone not found');
        setSurfZone(selectedZone);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurfZoneData();
  }, [selectedSurfZone]);

  // Fetch forecast data
  useEffect(() => {
    if (!surfZone) return;

    const fetchForecastData = async () => {
      setLoading(true);
      setError('');
      try {
        const [weatherResponse, waveResponse] = await Promise.all([
          fetch(surfForecastApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: surfZone.latitude,
              lon: surfZone.longitude,
              model: 'gfs',
              parameters: ["temp", "wind", "lclouds", "mclouds", "hclouds"],
              levels: ['surface'],
              key: APIKey,
            }),
          }),
          fetch(surfForecastApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: surfZone.latitude,
              lon: surfZone.longitude,
              model: 'gfsWave',
              parameters: ['waves', 'swell1'],
              levels: ['surface'],
              key: APIKey,
            }),
          }),
        ]);

        const weatherData = await weatherResponse.json();
        const waveData = await waveResponse.json();
        setForecast({ weather: weatherData, waves: waveData });

      } catch (err) {
        setError('Failed to load surf forecast.');
      } finally {
        setLoading(false);
      }
    };
    fetchForecastData();
  }, [surfZone]);

  if (loading) return <p className="text-blue-500">Loading Surf Forecast...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!forecast) return null;

  const { weather, waves } = forecast;
  const days = weather.ts.slice(0, 7).map((timestamp, i) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    temp: weather['temp-surface'][i]?.toFixed(1),
    windSpeed: (Math.sqrt(weather['wind_u-surface'][i] ** 2 + weather['wind_v-surface'][i] ** 2) * 3.6).toFixed(1), // m/s to km/h
    windDir: (Math.atan2(weather['wind_v-surface'][i], weather['wind_u-surface'][i]) * (180 / Math.PI)).toFixed(0),
    cloudCover: weather['lclouds-surface'][i] || weather['mclouds-surface'][i] || weather['hclouds-surface'][i] || 0,
    swellHeight: waves['waves_height-surface'][i]?.toFixed(1),
    swellPeriod: waves['waves_period-surface'][i]?.toFixed(1),
    swellDir: waves['waves_direction-surface'][i]?.toFixed(0),
  }));

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-lg text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🏄 {selectedSurfZone} Surf Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, idx) => (
          <div key={idx} className="bg-blue-700 p-4 rounded-lg text-center shadow hover:scale-105 transform transition duration-300">
            <p className="font-semibold mb-2 text-lg">{day.date}</p>
            <p>🌡️ {day.temp}°C</p>
            <p>💨 {day.windSpeed} km/h</p>
            <p>🧭 {day.windDir}°</p>
            <p>☁️ {day.cloudCover}%</p>
            <p>🌊 {day.swellHeight} m</p>
            <p>↗️ {day.swellDir}°</p>
            <p>⏱️ {day.swellPeriod} s</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SurfZoneForecastCard({ selectedSurfZone }) {
  return (
    <Suspense fallback={<p className="text-blue-500">Loading Surf Forecast...</p>}>
      <SurfZoneForecast selectedSurfZone={selectedSurfZone} />
    </Suspense>
  );
}
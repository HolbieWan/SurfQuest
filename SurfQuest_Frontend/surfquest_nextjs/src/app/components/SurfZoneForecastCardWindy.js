"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';

const APIKey = 'UmpC41QE7vcwtTKhlLLI9DhpkVqA1hoG';
const surfForecastApiUrl = 'https://api.windy.com/api/point-forecast/v2';
const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

function getDirectionArrow(deg) {
  const directions = ['↑', '↗️', '→', '↘️', '↓', '↙️', '←', '↖️'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function SurfZoneForecast({ selectedSurfZone }) {
  const [forecast, setForecast] = useState(null);
  const [surfZone, setSurfZone] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSurfZoneData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${surfZonesApiUrl}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        const zone = data.find(z => z.name === selectedSurfZone);
        setSurfZone(zone);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurfZoneData();
  }, [selectedSurfZone]);

  useEffect(() => {
    if (!surfZone) return;
    const fetchForecastData = async () => {
      setLoading(true);
      try {
        const weatherResponse = await fetch(surfForecastApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: surfZone.latitude,
            lon: surfZone.longitude,
            model: 'gfs',
            parameters: ['temp', 'wind', 'lclouds', 'mclouds', 'hclouds'],
            levels: ['surface'],
            key: APIKey,
          }),
        });
        const weatherData = await weatherResponse.json();

        const waveResponse = await fetch(surfForecastApiUrl, {
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
        });
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
    temp: (weather['temp-surface'][i] - 273.15).toFixed(1), // Kelvin to °C
    windSpeed: (Math.sqrt(weather['wind_u-surface'][i] ** 2 + weather['wind_v-surface'][i] ** 2) * 3.6).toFixed(1), // km/h
    windDir: getDirectionArrow(Math.atan2(weather['wind_v-surface'][i], weather['wind_u-surface'][i]) * (180 / Math.PI)),
    cloudCover: Math.round(weather['lclouds-surface'][i] || weather['mclouds-surface'][i] || weather['hclouds-surface'][i]),
    swellHeight: waves['waves_height-surface'][i]?.toFixed(1),
    swellPeriod: waves['waves_period-surface'][i]?.toFixed(1),
    swellDir: getDirectionArrow(waves['waves_direction-surface'][i]),
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">{selectedSurfZone} Surf Forecast 🏄</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, idx) => (
          <div key={idx} className="bg-blue-600 p-4 rounded-lg text-center">
            <p className="font-semibold mb-2">{day.date}</p>
            <p>🌡️ {day.temp}°C</p>
            <p>💨 {day.windSpeed} km/h {day.windDir}</p>
            <p>☁️ {day.cloudCover}%</p>
            <p>🌊 {day.swellHeight} m {day.swellDir}</p>
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
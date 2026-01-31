"use client";

import React, { useEffect, useMemo, useState } from "react";

const WINDY_API_URL = "https://api.windy.com/api/point-forecast/v2";
// ⚠️ In production, prefer moving this key to a server route.
// For now, keep it in env (NEXT_PUBLIC_...) if you must expose it.
const WINDY_KEY = process.env.NEXT_PUBLIC_WINDY_API_KEY;

function degToArrow(deg) {
  if (deg == null || Number.isNaN(deg)) return "•";
  const directions = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  const normalized = ((deg % 360) + 360) % 360;
  return directions[Math.round(normalized / 45) % 8];
}

function pickFirstIndexPerDay(ts) {
  // returns array of indices in ts[] (keeps correct alignment with data arrays)
  const seen = new Set();
  const picked = [];
  for (let i = 0; i < ts.length; i++) {
    const day = new Date(ts[i]).toLocaleDateString();
    if (!seen.has(day)) {
      seen.add(day);
      picked.push(i);
    }
    if (picked.length >= 6) break;
  }
  return picked;
}

export default function SurfZoneForecastCard({ zoneName, lat, lon }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lat || !lon) return;
    if (!WINDY_KEY) {
      setError("Missing Windy API key (NEXT_PUBLIC_WINDY_API_KEY).");
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      setError("");

      try {
        const weatherBody = {
          lat,
          lon,
          model: "gfs",
          parameters: ["temp", "wind", "lclouds", "mclouds", "hclouds"],
          levels: ["surface"],
          key: WINDY_KEY,
        };

        const waveBody = {
          lat,
          lon,
          model: "gfsWave",
          parameters: ["waves", "swell1"],
          levels: ["surface"],
          key: WINDY_KEY,
        };

        const [weatherRes, waveRes] = await Promise.all([
          fetch(WINDY_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(weatherBody),
          }),
          fetch(WINDY_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(waveBody),
          }),
        ]);

        if (!weatherRes.ok || !waveRes.ok) {
          throw new Error(`Windy API error (${weatherRes.status}/${waveRes.status})`);
        }

        const [weather, waves] = await Promise.all([
          weatherRes.json(),
          waveRes.json(),
        ]);

        setForecast({ weather, waves });
      } catch (e) {
        setError(e?.message || "Failed to load surf forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  const days = useMemo(() => {
    if (!forecast?.weather?.ts) return [];

    const { weather, waves } = forecast;

    const idxs = pickFirstIndexPerDay(weather.ts);

    return idxs.map((i) => {
      const dateLabel = new Date(weather.ts[i]).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const tempK = weather["temp-surface"]?.[i];
      const tempC = tempK != null ? Math.round((tempK - 273.15) * 10) / 10 : null;

      const u = weather["wind_u-surface"]?.[i];
      const v = weather["wind_v-surface"]?.[i];
      const windSpeedKmh =
        u != null && v != null ? Math.round(Math.hypot(u, v) * 3.6) : null;

      // Convert atan2 result to degrees 0..360
      const windDeg =
        u != null && v != null
          ? ((Math.atan2(v, u) * 180) / Math.PI + 360) % 360
          : null;

      // Cloud cover: prefer lclouds else mclouds else hclouds, but keep 0 values
      const cloud =
        weather["lclouds-surface"]?.[i] ??
        weather["mclouds-surface"]?.[i] ??
        weather["hclouds-surface"]?.[i] ??
        null;

      // Waves fields can differ depending on Windy response; keep defensive
      const swellHeight = waves["waves_height-surface"]?.[i] ?? null;
      const swellPeriod = waves["waves_period-surface"]?.[i] ?? null;
      const swellDeg = waves["waves_direction-surface"]?.[i] ?? null;

      return {
        dateLabel,
        tempC,
        windSpeedKmh,
        windArrow: degToArrow(windDeg),
        cloud: cloud != null ? Math.round(cloud) : null,
        swellHeight: swellHeight != null ? Math.round(swellHeight * 10) / 10 : null,
        swellPeriod: swellPeriod != null ? Math.round(swellPeriod * 10) / 10 : null,
        swellArrow: degToArrow(swellDeg),
      };
    });
  }, [forecast]);

  return (
    <div className="w-full px-4">
      <div className="flex flex-col items-center justify-center my-6">
        <h2 className="text-white text-4xl font-bold text-center">
          {/* <span className="text-pink-400">{zoneName}</span> Surf Forecast */}
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Windy point surf forecast (GFS + GFSWave)
        </p>
      </div>

      {loading && <p className="text-blue-300 text-center">Loading forecast…</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {!loading && !error && days.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {days.map((d, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm hover:scale-[1.02] transition-transform"
            >
              <p className="font-semibold text-pink-400 mb-2">{d.dateLabel}</p>

              <div className="space-y-1 text-sm text-gray-100">
                <p className="text-orange-300">🌡️ {d.tempC ?? "—"}°C</p>
                <p className="text-green-300">💨 {d.windSpeedKmh ?? "—"} km/h {d.windArrow}</p>
                <p className="text-gray-300">☁️ {d.cloud ?? "—"}%</p>
                <p className="text-blue-300">🌊 {d.swellHeight ?? "—"} m {d.swellArrow}</p>
                <p className="text-purple-300">⏱️ {d.swellPeriod ?? "—"} s</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && days.length === 0 && (
        <p className="text-gray-400 text-center">No forecast data.</p>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import SurfSpotDetails from "@/app/components/SurfSpots/SurfSpotDetails";

const surfSpotsApiUrl = 'http://localhost:8000/api/surfspots/';
const token = Cookies.get('access_token');

export default function SurfSpotDetailsPage() {
  const { surfspot } = useParams();
  const [surfSpotData, setSurfSpotData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurfSpot = async () => {
      try {
        const res = await fetch(surfSpotsApiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error("Failed to fetch surf spots.");
        }

        const allSurfSpots = await res.json();
        const matchedSurfSpot = allSurfSpots.find(spot => spot.name === decodeURIComponent(surfspot));
        setSurfSpotData(matchedSurfSpot);

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchSurfSpot();
  }, [surfspot]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error || !surfSpotData) return <div className="text-red-500 text-center mt-10">Error: {error || "Surf spot not found"}</div>;

  return <SurfSpotDetails surfSpotData={surfSpotData} />;
}
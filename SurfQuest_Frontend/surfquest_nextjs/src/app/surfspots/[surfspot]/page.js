"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import SurfSpotDetails from "@/components/SurfSpots/SurfSpotDetails";

const surfSpotsApiUrl = process.env.NEXT_PUBLIC_SURFSPOTS_API_URL;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
const token = Cookies.get('access_token');

console.log("Surf Spots API URL:", surfSpotsApiUrl);
console.log("Environment:", environment);
console.log("Access Token:", token);

export default function SurfSpotDetailsPage() {
  const { surfspot } = useParams();
  // decode any %20 or UTF-8 bytes back into real characters
  const decodedSurfSpot = decodeURIComponent(surfspot || "");
  const router = useRouter();
  const [uniqueSurfSpotsList, setUniqueSurfSpotsList] = useState([]);
  const [surfSpotData, setSurfSpotData] = useState(null);
  const [selectedSurfSpot, setSelectedSurfSpot] = useState(decodedSurfSpot);
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
        setUniqueSurfSpotsList(allSurfSpots.map(spot => spot.name));
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

  const handleSurfSpotChange = (e) => {
    const newSurfSpot = e.target.value;
    setSelectedSurfSpot(newSurfSpot);
    router.push(`/surfspots/${encodeURIComponent(newSurfSpot)}`); // Navigate to the new surf spot page
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error || !surfSpotData) return <div className="text-red-500 text-center mt-10">Error: {error || "Surf spot not found"}</div>;

  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-screen bg-black text-white">
      {surfSpotData &&
              <>
                <div className="w-full flex justify-start">
                  <div className="ml-10 text-left ">
                    <Link
                      href={`/surfspots`}
                    >
                        <h2 className="text-gray-500 text-lg text-left hover:text-gray-300 transform transition-transform duration-300 hover:scale-105"> 👈🏻 Back to surf-spot search page</h2>
                    </Link>
                  </div>
                </div>
              </>
      }

      <div className="flex justify-center items-center w-full p-4">
        <select
          className="p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[210px] w-auto transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedSurfSpot}
          onChange={handleSurfSpotChange}
        >
          <option value="">{selectedSurfSpot}</option>
          {uniqueSurfSpotsList.sort().map((spot, index) => (
            <option key={index} value={spot}>
              {spot}
            </option>
          ))}
        </select>
      </div>

      <SurfSpotDetails surfSpotData={surfSpotData} />
    </div>
  );
}
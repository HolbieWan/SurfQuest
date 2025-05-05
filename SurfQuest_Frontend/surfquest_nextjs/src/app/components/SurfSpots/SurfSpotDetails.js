"use client";

import React from "react";
import SurfSpotCard from "@/app/components/SurfSpots/SurfSpotCard";
import Reviews from "@/app/components/Reviews/Reviews";

export default function SurfSpotDetails({ surfSpotData }) {
  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold text-center mb-10">{surfSpotData.name}</h1>

      <SurfSpotCard surfspot={surfSpotData} selectedSurfSpot={surfSpotData.name} />

      <div className="group grid grid-cols-1 rounded-md items-center justify-center">
        <Reviews selectedSurfSpot={surfSpotData.name} surfSpotId={surfSpotData.id} />
      </div>
    </div>
  );
}
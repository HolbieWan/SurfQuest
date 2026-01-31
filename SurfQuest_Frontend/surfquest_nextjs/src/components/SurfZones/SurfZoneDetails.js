// """
// Surf Zone Details Component
// -----------------------
// Displays detailed information about a specific surf zone,
// including an info card, image gallery, monthly conditions,
// surf forecast, surf spots list, and reviews section.
// """

"use client";

import React, { useState } from "react";
import Link from "next/link";

import InfoCard from "@/components/SurfZones/InfoCard";
import ImageGallery from "@/components/SurfZones/ImageGallery";
import ConditionsSection from "@/components/SurfZones/ConditionsSection";
import SurfZoneForecast from "@/components/SurfZones/SurfZoneForecast/SurfZoneForecastCardWindy";
import SurfSpotsList from "@/components/SurfZones/ZoneSurfSpotsList";
import ReviewsSection from "@/components/SurfZones/ReviewsSection";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function SurfZoneDetails({ surfzone }) {
  const [month, setMonth] = useState(months[new Date().getMonth()]);

  if (!surfzone) {
    return <p className="text-red-500 text-sm">Invalid Surf Zone</p>;
  }

  const cond = surfzone.conditions?.find((c) => c.month === month) || null;
  const images = surfzone.images?.slice(0, 2) || [];
  const spots = surfzone.surf_spots || [];

  return (
    <>
      <div className="w-full flex justify-start mb-6">
        <div className="ml-20">
          <Link href="/surfzones">
            <h2 className="text-gray-500 text-lg hover:text-gray-300 hover:scale-105">
              👈🏻 Back to surf-zone search page
            </h2>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pt-10 min-h-screen bg-black text-white">
        <h1 className="text-white text-4xl font-bold text-center my-6">
          <span className="text-pink-400">{surfzone.name}</span> Informations
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <InfoCard surfzone={surfzone} />
          <ImageGallery images={images} alt={surfzone.name} />
        </div>

        <ConditionsSection
          selectedMonth={month}
          onMonthChange={setMonth}
          condition={cond}
          zoneName={surfzone.name}
        />

        <h2 className="text-white text-4xl font-bold text-center my-6">
          <span className="text-pink-400">{surfzone.name}</span> Surf Forecast
        </h2>
        <SurfZoneForecast selectedSurfZone={surfzone.name} />

        {/* Ici spots ont spot_images normalisés => Carousel OK */}
        <SurfSpotsList spots={spots} zoneName={surfzone.name} />

        {/* Reviews plus tard quand auth sera OK */}
        <ReviewsSection zoneName={surfzone.name} zoneId={surfzone.id} />
      </div>
    </>
  );
}
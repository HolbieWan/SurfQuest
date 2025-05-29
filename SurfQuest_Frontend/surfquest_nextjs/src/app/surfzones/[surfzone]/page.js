"use client";

import { use } from "react";
// import { useRouter } from "next/navigation";
import SurfZoneDetails from "@/components/SurfZones/SurfZoneDetails";

export default function SurfZonePage({ params }) {
  // const router = useRouter();
  const surfzone = use(params)?.surfzone;
  console.log("Selected Surf Zone:", surfzone);

  if (!surfzone) {
    return <p className="text-red-500 text-sm">Invalid Surf Zone</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-screen bg-black text-white">
      <SurfZoneDetails selectedSurfZone={surfzone} />
    </div>
  );
}
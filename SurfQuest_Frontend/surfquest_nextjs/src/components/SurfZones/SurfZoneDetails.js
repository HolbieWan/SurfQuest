'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

import InfoCard from '@/components/SurfZones/InfoCard';
import ImageGallery from '@/components/SurfZones/ImageGallery';
import ConditionsSection from '@/components/SurfZones/ConditionsSection';
import SurfSpotsList from '@/components/SurfZones/ZoneSurfSpotsList';
import ReviewsSection from '@/components/SurfZones/ReviewsSection';
import SurfZoneForecast from '@/components/SurfZones/SurfZoneForecast/SurfZoneForecastCardWindy';

import { fetchSurfSpots } from '@/services/surfspotService';
import { getUniqueSurfZones, filterSpotsByZone } from '@/utils/surfzoneUtils';
import API_BASE_URLS from '@/config/api';

const months = [ /* ... */ ];

function SurfZoneDetailsPage() {
  const { surfzone } = useParams();
  const decoded = decodeURIComponent(surfzone || '');
  const [spots, setSpots] = useState([]);
  const [zone, setZone] = useState(decoded);
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!decoded) return;
    (async () => {
      setLoading(true); setErr('');
      try {
        const token = Cookies.get('access_token');
        const data = await fetchSurfSpots(API_BASE_URLS.SURFSPOTS, token);
        setSpots(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [decoded]);

  const zones = getUniqueSurfZones(spots);
  const filtered = filterSpotsByZone(spots, zone);
  const current = filtered[0] || {};
  const cond = current.surfzone?.conditions?.find(c => c.month === month);
  const images = current.surfzone?.zone_images?.slice(0, 2) || [];
  const id = current.surfzone?.id;

  if (loading) return <p className="text-blue-500">Loading…</p>;
  if (err)     return <p className="text-red-500">{err}</p>;

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
        <select
          className="mt-4 p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] hover:scale-105"
          value={zone}
          onChange={e => setZone(e.target.value)}
        >
          <option value="">Select Surf-zone</option>
          {zones.sort().map((z,i)=><option key={i} value={z}>{z}</option>)}
        </select>

        {zone && current.surfzone && (
          <>
            <h1 className="text-white text-4xl font-bold text-center my-6">{current.surfzone.name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <InfoCard spot={current} />
              <ImageGallery images={images} alt={current.surfzone.name} />
            </div>
            <ConditionsSection
              selectedMonth={month}
              onMonthChange={setMonth}
              condition={cond}
            />
            <h2 className="text-white text-4xl font-bold text-center my-6">
              {current.surfzone.name} Surf Forecast
            </h2>
            <SurfZoneForecast selectedSurfZone={zone} />
            <SurfSpotsList spots={filtered} zoneName={zone} />
            <ReviewsSection zoneName={zone} zoneId={id} />
          </>
        )}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SurfZoneDetailsPage />
    </Suspense>
  );
}
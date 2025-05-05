"use client";

import React from 'react';
import Link from 'next/link';
import ImageCarousel from '../SurfSpots/Carousel';

export default function SurfSpotCard({ surfspot, index, selectedSurfSpot=null }) {
  if (!surfspot) {
    return <div className="text-red-500">Surf spot data is unavailable.</div>;
  }

  return (
    <div key={index} className="flex flex-col md:flex-row items-start justify-center space-y-10 md:space-y-0 md:space-x-12 mb-10">
    
      <div className="bg-black rounded-md group flex-shrink-0 w-full md:w-1/2 lg:w-2/4" style={{ height: '400px' }}>

        {surfspot.spot_images && surfspot.spot_images.length > 0 && (
          !selectedSurfSpot ? (
              <div className="w-full h-full">
                <ImageCarousel images={surfspot.spot_images}/>
              </div>
          ) : (
            <div className="w-full h-full">
              <ImageCarousel images={surfspot.spot_images}/>
            </div>
          )
        )}

      </div>

      <div className="group bg-white rounded-md p-4 flex flex-col justify-center border border-gray-300 overflow-hidden w-full md:w-1/2 lg:w-1/3 transform transition-transform duration-500 hover:scale-110" style={{ height: '400px' }}>
        {!selectedSurfSpot ? (
          <Link href={`/surfspots/${encodeURIComponent(surfspot.name)}`}>
            <h2 className="text-pink-400 text-2xl font-bold text-center md:text-left">{surfspot.name}</h2>
            <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">{surfspot.surfzone.name}</div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">{surfspot.description}</div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-cyan-500 font-bold">{surfspot.best_months.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Wave direction: <span className="text-cyan-500 font-bold">{surfspot.wave_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell direction: <span className="text-cyan-500 font-bold">{surfspot.best_swell_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell size: <span className="text-cyan-500 font-bold">{surfspot.best_swell_size_meter} ft</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best tide: <span className="text-cyan-500 font-bold">{surfspot.best_tide.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best wind direction: <span className="text-cyan-500 font-bold">{surfspot.best_wind_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-cyan-500 font-bold">{surfspot.surf_hazards.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf level: <span className="text-cyan-500 font-bold">{surfspot.surf_level.join(', ')}</span></div>
          </Link>
        ) :
          <>
            <h2 className="text-pink-400 text-2xl font-bold text-center md:text-left">{surfspot.name}</h2>
            <div className="mt-2 text-sm text-blue-500 text-center md:text-left font-semibold">{surfspot.surfzone.name}</div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">{surfspot.description}</div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best months: <span className="text-cyan-500 font-bold">{surfspot.best_months.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Wave direction: <span className="text-cyan-500 font-bold">{surfspot.wave_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell direction: <span className="text-cyan-500 font-bold">{surfspot.best_swell_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best swell size: <span className="text-cyan-500 font-bold">{surfspot.best_swell_size_meter} ft</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best tide: <span className="text-cyan-500 font-bold">{surfspot.best_tide.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Best wind direction: <span className="text-cyan-500 font-bold">{surfspot.best_wind_direction}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf hazards: <span className="text-cyan-500 font-bold">{surfspot.surf_hazards.join(', ')}</span></div>
            <div className="mt-2 text-sm text-gray-700 text-center md:text-left">Surf level: <span className="text-cyan-500 font-bold">{surfspot.surf_level.join(', ')}</span></div>
          </>
        }
      </div>

    </div>
  );
}
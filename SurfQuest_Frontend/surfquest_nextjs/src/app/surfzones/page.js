"use client";


import React, { useState, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
// import SurfZoneDetails from "../components/SurfZoneDetails";

const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

console.log(surfZonesApiUrl);
console.log(token);

function SurfZonesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  // const [selectedSurfZone, setSelectedSurfZone] = useState("");
  const [surfZones, setSurfZones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch surf zones data
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const SurfZonesResponse = await fetch(`${surfZonesApiUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
          credentials: 'include',
        });

        if (!SurfZonesResponse.ok) {
          const errorData = await SurfZonesResponse.json();
          setError(errorData.detail || 'Request failed, please try again');
          return;
        }
        const data = await SurfZonesResponse.json();
        console.log('Response data: ', data);
        setSurfZones(data);

        // Extract unique countries from surfZones
        const uniqueCountries = [...new Set(data.map(item => item.country.name))];
        setCountries(uniqueCountries);

        // Check if a surf zone was selected via URL query params
        const surfzoneParam = searchParams.get("surfzone");
        if (surfzoneParam) {
          setSelectedSurfZone(surfzoneParam);
        }

      } catch (err) {
        setError(`Request failed: ${err.message}`);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    const params = new URLSearchParams(window.location.search);
    if (country) {
      params.set("country", country);
    } else {
      params.delete("country");
    }

    router.replace(`/surfzones?${params.toString()}`, { scroll: false });
  };

  // Filter surf zones by country
  const filteredSurfZones = selectedCountry
    ? surfZones.filter(zone => zone.country.name === selectedCountry)
    : surfZones;
  
  // Determine the number of columns based on the number of items
  const gridColsClass = filteredSurfZones.length === 1
    ? 'grid-cols-1'
    : filteredSurfZones.length === 2
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white rounded-lg">

      <h1 className="text-4xl font-bold">Surf Zones</h1>
      <select
        className="mt-4 p-2 border border-black rounded bg-blue-500 text-white text-center"
        value={selectedCountry}
        onChange={handleCountryChange}
      >
        <option value="">All Countries</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      <div className="flex flex-col items-center justify-start pt-16 w-full">
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}
        <div className={`grid ${gridColsClass} p-4 gap-4 rounded-md`}>
          {filteredSurfZones.map((surfzone, index) => (
            <div key={index} className="bg-black rounded-lg p-4 relative overflow-hidden group flex items-center justify-center">
              <Link href={`/surfzones/${encodeURIComponent(surfzone.name)}`} legacyBehavior>
                <a className="absolute inset-0 z-10"></a>
              </Link>
              {surfzone.zone_images && surfzone.zone_images.map((image, imgIndex) => (
                <img key={imgIndex} src={image.image} alt={surfzone.name} className="inset-0 mt-4 w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
              ))}
              <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center p-4">
                <h2 className="text-white text-xl font-bold text-center text-shadow-md">{surfzone.name}</h2>
                <div className="mt-2 text-sm text-white text-center font-semibold text-shadow-lg">{surfzone.country.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
  
    </div>
  );
}

export default function SurfZonesPage() {
  return (
    <Suspense fallback={<p className="text-blue-500">Loading Surf Zones...</p>}>
      <SurfZonesPageContent />
    </Suspense>
  );
}
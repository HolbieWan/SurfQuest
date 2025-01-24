"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

console.log(surfZonesApiUrl);
console.log(token);

export default function SurfZonesPage() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [surfZones, setSurfZones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch surf zones data
    const fetchDatas = async () => {
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

      } catch (err) {
        setError(`Request failed: ${err.message}`);

      } finally {
        setLoading(false);
      }
    };

    fetchDatas();
  }, []);

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
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">All best Surf Destinations</h1>
      <p className="text-lg mt-4">Select a country</p>
      <select
        className="mt-4 p-2 border border-gray-300 rounded bg-white text-black"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
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
            <div key={index} className="bg-black rounded-md p-4 relative overflow-hidden group flex items-center justify-center">
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
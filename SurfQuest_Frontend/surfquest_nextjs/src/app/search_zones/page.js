"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

console.log(surfZonesApiUrl);
console.log(token);

export default function SearchSurfZonePage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSurfLevel, setSelectedSurfLevel] = useState('');
  const [selectedCost, setSelectedCost] = useState('');
  const [selectedWaterTemp, setSelectedWaterTemp] = useState('');
  const [selectedSurfRating, setSelectedSurfRating] = useState('');
 
  const [countries, setCountries] = useState([]);
  const [surfZones, setSurfZones] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const surfLevel = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  const cost = ['Cheap', 'Moderate', 'Expensive'];
  const waterTemp_C = ['Freezing', 'Cold', 'Cool', 'Temperate', 'Warm', 'Hot'];
  const waterTempRanges = {
    Freezing: { min: 0, max: 9 },
    Cold: { min: 10, max: 15 },
    Cool: { min: 16, max: 19 },
    Temperate: { min: 20, max: 23 },
    Warm: { min: 24, max: 27 },
    Hot: { min: 28, max: 30 },
  };
  const surfRating = [1, 2, 3, 4, 5]

  useEffect(() => {

    const fetchAndFilterSurfZones = async () => {
      setLoading(true);
      setError('');

      try {
        const responseData = await fetch(`${surfZonesApiUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          credentials: 'include'
        });

        if (!responseData.ok) {
          const errorData = await responseData.json();
          setError(errorData || 'Failed to fetch datas, please try again')
          return;
        }

        const data = await responseData.json();
        console.log("Response data: ", data);
        setSurfZones(data);

        // Extract unique countries from surfZones
        const uniqueCountries = [...new Set(data.map(item => item.country.name))];
        setCountries(uniqueCountries);

      } catch (err) {
        setError(`Request failed: ${err.message}`)

      } finally {
        setLoading(false)
      }
    };

    fetchAndFilterSurfZones();

  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
  };

  const handleSurfLevelChange = (e) => {
    const surflevel = e.target.value;
    setSelectedSurfLevel(surflevel);
  };

  const handleCostChange = (e) => {
    const cost = e.target.value;
    setSelectedCost(cost);
  };

  const handleWaterTempChange = (e) => {
    const water_temp = e.target.value;
    setSelectedWaterTemp(water_temp);
  };

  const handleSurfRatingChange = (e) => {
    const surf_rating = e.target.value;
    setSelectedSurfRating(surf_rating);
  };

  // Filter surf zones by country
  const filteredSurfZones = surfZones
    .filter(zone => !selectedCountry || zone.country.name === selectedCountry)
    
    .filter(zone => 
      !selectedSurfLevel || 
      zone.conditions?.some(condition => 
        (selectedMonth 
          ? condition.month === selectedMonth && condition.surf_level.includes(selectedSurfLevel) 
          : condition.surf_level.includes(selectedSurfLevel)
        )
      )
    )

    .filter(zone => !selectedCost || zone.cost.includes(selectedCost))

    .filter(zone => {
      if (!selectedWaterTemp) return true; 
      const { min, max } = waterTempRanges[selectedWaterTemp] || {}; 
      if (min === undefined || max === undefined) return false;
      return zone.conditions?.some(condition => 
        (!selectedMonth || condition.month === selectedMonth) && 
        condition.water_temp_c >= min && condition.water_temp_c <= max
      );
    })

    .filter(zone => 
      !selectedSurfRating || 
      zone.conditions?.some(condition => 
        (selectedMonth 
          ? condition.month === selectedMonth && condition.world_surf_rating === Number(selectedSurfRating) 
          : condition.world_surf_rating === Number(selectedSurfRating)
        )
      )
    );

  const gridColsClass = filteredSurfZones.length === 1
    ? 'grid-cols-1'
    : filteredSurfZones.length === 2
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white rounded-lg">

      <h1 className="text-4xl font-bold mb-8">Filter surf-zones by</h1>

      {/* Selectors grill*/}
      <div className="grid grid-cols-3 p-4 gap-3 items-center justify-center ">
        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">Month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedSurfLevel}
          onChange={handleSurfLevelChange}
        >
          <option value="">Surf level</option>
          {surfLevel.map((surflevel, index) => (
            <option key={index} value={surflevel}>
              {surflevel}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedCost}
          onChange={handleCostChange}
        >
          <option value="">Cost of living</option>
          {cost.map((cost, index) => (
            <option key={index} value={cost}>
              {cost}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedWaterTemp}
          onChange={handleWaterTempChange}
        >
          <option value="">Water Temp</option>
          {waterTemp_C.map((water_temp, index) => (
            <option key={index} value={water_temp}>
              {water_temp}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px]"
          value={selectedSurfRating}
          onChange={handleSurfRatingChange}
        >
          <option value="">Surf rating</option>
          {surfRating.map((surf_rating, index) => (
            <option key={index} value={surf_rating}>
              {surf_rating}
            </option>
          ))}
        </select>

        
      </div>

      

      {/*Surf Zones card */}
      <div className="flex flex-col items-center justify-start pt-16 w-full">
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}

        <div className={`grid ${gridColsClass} p-4 gap-4 rounded-md`}>
          {filteredSurfZones.map((surfzone, index) => (

            <div key={index} className="bg-black rounded-lg p-3 relative overflow-hidden group flex items-center justify-center">

              <Link href={`/surfzones/${encodeURIComponent(surfzone.name)}`} legacyBehavior>
                <a className="absolute inset-0 z-10"></a>
              </Link>

              {surfzone.zone_images && surfzone.zone_images.map((image, imgIndex) => (
                <img key={imgIndex} src={image.image} alt={surfzone.name} className="inset-0  w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
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

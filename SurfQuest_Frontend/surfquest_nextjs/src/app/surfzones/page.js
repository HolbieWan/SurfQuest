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
  const [selectedSwellSize, setSelectedSwellSize] = useState('');
  const [selectedCrowdFactor, setSelectedCrowdFactor] = useState('');
  const [selectedSunnyDays, setSelectedSunnyDays] = useState('');
 
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
  const swellSize = ["Under 1m", "1m - 1.5m", "1.5m - 2m", "2m - 3m", "Over 3m"]
  const swellSizeRanges = {
    "Under 1m": { min: 0, max: 1 },
    "1m - 1.5m": { min: 1.1, max: 1.5 },
    "1.5m - 2m": { min: 1.6, max: 2 },
    "2m - 3m": { min: 2.1, max: 3 },
    "Over 3m": { min: 3.1, max: 30 },
  };
  const crowdFactor = ['Few', 'Moderate', 'Crowded', 'Packed'];
  const crowdFactorRanges = {
    "Few": "Low",
    "Moderate": "Medium",
    "Crowded": "High",
    "Packed": "Very High",
  };
  const sunnyDays = ['1 to 5', '5 to 10', '10 to 15', '15 to 20', '20 to 25', '25 to 30'];
  const sunnyDaysRanges = {
    "1 to 5": { min: 1, max: 5 },
    "5 to 10": { min: 6, max: 10 },
    "10 to 15": { min: 11, max: 15 },
    "15 to 20": { min: 16, max: 20 },
    "20 to 25": { min: 21, max: 25 },
    "25 to 30": { min: 26, max: 30 },
  };

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
    const surf_level = e.target.value;
    setSelectedSurfLevel(surf_level);
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

  const handleSwellSizeChange = (e) => {
    const swell_size = e.target.value;
    setSelectedSwellSize(swell_size);
  };

  const handleCrowdFactorChange = (e) => {
    const crowd_factor = e.target.value;
    setSelectedCrowdFactor(crowd_factor);
  };

  const handleSunnyDaysChange = (e) => {
    const sunny_days = e.target.value;
    setSelectedSunnyDays(sunny_days);
  };


  // Filter surf zones by country, cost of living, 
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
    )
    
    .filter(zone => {
      if (!selectedSwellSize) return true;
      const { min, max } = swellSizeRanges[selectedSwellSize] || {};
      if (min === undefined || max === undefined) return false;
      return zone.conditions?.some(condition =>
        (!selectedMonth || condition.month === selectedMonth) &&
        condition.swell_size_meter >= min && condition.swell_size_meter <= max
      );
    })

    .filter(zone => {
      if (!selectedCrowdFactor) return true;
      const crowd = crowdFactorRanges[selectedCrowdFactor] || {};
      if (crowd === undefined) return false;
      return zone.conditions?.some(condition =>
        (!selectedMonth || condition.month === selectedMonth) &&
        condition.crowd === crowd
      );
    })

    .filter(zone => {
      if (!selectedSunnyDays || !sunnyDaysRanges[selectedSunnyDays]) return true;
      const { min, max } = sunnyDaysRanges[selectedSunnyDays] || {};
      if (min === undefined || max === undefined) return false;
      return zone.conditions?.some(condition =>
        (!selectedMonth || condition.month === selectedMonth) &&
        condition.sunny_days >= min && condition.sunny_days <= max
      );
    });


  const gridColsClass = filteredSurfZones.length === 1
    ? 'grid-cols-1'
    : filteredSurfZones.length === 2
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-screen bg-black text-white rounded-lg">

      <h1 className="text-4xl text-center font-bold mb-8">Find the best destination for <span className="text-blue-500">you</span> 😎</h1>

      {/* Selectors grill*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-3 items-center justify-center ">
        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedSurfLevel}
          onChange={handleSurfLevelChange}
        >
          <option value="">Surf Level</option>
          {surfLevel.map((surf_level, index) => (
            <option key={index} value={surf_level}>
              {surf_level}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedCost}
          onChange={handleCostChange}
        >
          <option value="">Cost of Living</option>
          {cost.map((cost, index) => (
            <option key={index} value={cost}>
              {cost}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedSunnyDays}
          onChange={handleSunnyDaysChange}
        >
          <option value="">Sunny Days</option>
          {sunnyDays.map((sunny_days, index) => (
            <option key={index} value={sunny_days}>
              {sunny_days}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedSurfRating}
          onChange={handleSurfRatingChange}
        >
          <option value="">Surf Rating</option>
          {surfRating.map((surf_rating, index) => (
            <option key={index} value={surf_rating}>
              {surf_rating}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedSwellSize}
          onChange={handleSwellSizeChange}
        >
          <option value="">Swell Size</option>
          {swellSize.map((swell_size, index) => (
            <option key={index} value={swell_size}>
              {swell_size}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:scale-105"
          value={selectedCrowdFactor}
          onChange={handleCrowdFactorChange}
        >
          <option value="">Crowd Factor</option>
          {crowdFactor.map((crowd_factor, index) => (
            <option key={index} value={crowd_factor}>
              {crowd_factor}
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

              {surfzone.zone_images && surfzone.zone_images.length > 0 && (
                <img 
                  key={0} 
                  src={surfzone.zone_images[0].image} 
                  alt={surfzone.name} 
                  className="inset-0 w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
                />
              )}

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
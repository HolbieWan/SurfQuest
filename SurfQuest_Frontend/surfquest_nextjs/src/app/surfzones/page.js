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

  //Get the currennt month
  const currentMonthIndex = new Date().getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[currentMonthIndex]; 

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedTravelerType, setSelectedTravelerType] = useState('');
  const [selectedSafety, setSelectedSafety] = useState('');
  const [selectedComfort, setSelectedComfort] = useState('');
  const [selectedMainWaveDirection, setSelectedMainWaveDirection] = useState('');
  const [selectedSurfLevel, setSelectedSurfLevel] = useState('');
  const [selectedCost, setSelectedCost] = useState('');
  const [selectedWaterTemp, setSelectedWaterTemp] = useState('');
  const [selectedSurfRating, setSelectedSurfRating] = useState('');
  const [selectedSwellSize, setSelectedSwellSize] = useState('');
  const [selectedCrowdFactor, setSelectedCrowdFactor] = useState('');
  const [selectedSunnyDays, setSelectedSunnyDays] = useState('');
  const [selectedRainyDays, setSelectedRainyDays] = useState('');
 
  const [countries, setCountries] = useState([]);
  const [surfZones, setSurfZones] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const surfLevel = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  const travelerType = ['Solo', 'Couple', 'Family', 'Group'];
  const safety = ['Low', 'Moderate', 'High'];
  const comfort = ['Simple', 'Comfortable', 'Premium'];
  const mainWaveDirection = ['Left', 'Right', 'Left and right'];
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
  const crowdFactor = ['Few people', 'Moderate', 'Crowded', 'Packed'];
  const crowdFactorRanges = {
    "Few people": "Low",
    "Moderate": "Medium",
    "Crowded": "High",
    "Packed": "Very High",
  };
  const sunnyDays = [/*'under 5', */'min 5', 'min 10', 'min 15', 'min 20', 'min 25'];
  const sunnyDaysRanges = {
    // "under 5": { min: 1, max: 4 },
    "min 5": { min: 5, max: 30 },
    "min 10": { min: 10, max: 30 },
    "min 15": { min: 15, max: 30 },
    "min 20": { min: 20, max: 30 },
    "min 25": { min: 25, max: 30 },
  };
  const rainyDays = ['max 5', 'max 10', 'max 15', 'max 20', 'max 25'];
  const rainyDaysRanges = {
    "max 5": { min: 0, max: 5 },
    "max 10": { min: 0, max: 10 },
    "max 15": { min: 0, max: 15 },
    "max 20": { min: 0, max: 20 },
    "max 25": { min: 0, max: 25 },
  }

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
          setError(errorData.detail || 'Request failed, please try again');
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

  const handleTravelerTypeChange = (e) => {
    const traveler_type = e.target.value;
    setSelectedTravelerType(traveler_type);
  }

  const handleSafetyChange = (e) => {
    const safety = e.target.value;
    setSelectedSafety(safety);
  }

  const handleComfortChange = (e) => {
    const comfort = e.target.value;
    setSelectedComfort(comfort);
  }

  const handleMainWaveDirectionChange = (e) => {
    const main_wave_direction = e.target.value;
    setSelectedMainWaveDirection(main_wave_direction);
  }

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

  const handleRainyDaysChange = (e) => {
    const rainy_days = e.target.value;
    setSelectedRainyDays(rainy_days);
  };

  const handleReset = () => {
    setSelectedCountry('');
    setSelectedMonth('');
    setSelectedTravelerType('');
    setSelectedSafety('');
    setSelectedComfort('');
    setSelectedMainWaveDirection('');
    setSelectedSurfLevel('');
    setSelectedCost('');
    setSelectedWaterTemp('');
    setSelectedSurfRating('');
    setSelectedSwellSize('');
    setSelectedCrowdFactor('');
    setSelectedSunnyDays('');
    setSelectedRainyDays('');
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
    
    .filter(zone => !selectedTravelerType || zone.traveler_type?.includes(selectedTravelerType))

    .filter(zone => !selectedSafety || zone.safety?.includes(selectedSafety))

    .filter(zone => !selectedComfort || zone.confort?.includes(selectedComfort))

    .filter(zone => !selectedMainWaveDirection || zone.main_wave_direction?.includes(selectedMainWaveDirection))

    .filter(zone => !selectedCost || zone.cost?.includes(selectedCost))

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
    })

    .filter(zone => {
      if (!selectedRainyDays || !rainyDaysRanges[selectedRainyDays]) return true;
      const { min, max } = rainyDaysRanges[selectedRainyDays] || {};
      if (min === undefined || max === undefined) return false;
      return zone.conditions?.some(condition =>
        (!selectedMonth || condition.month === selectedMonth) &&
        condition.rain_days >= min && condition.rain_days <= max
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Country</option>
          {countries.sort().map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedTravelerType}
          onChange={handleTravelerTypeChange}
        >
          <option value="">Traveler Type</option>
          {travelerType.map((traveler_type, index) => (
            <option key={index} value={traveler_type}>
              {traveler_type}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedSafety}
          onChange={handleSafetyChange}
        >
          <option value="">Safety</option>
          {safety.map((safety, index) => (
            <option key={index} value={safety}>
              {safety}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedComfort}
          onChange={handleComfortChange}
        >
          <option value="">Comfort</option>
          {comfort.map((comfort, index) => (
            <option key={index} value={comfort}>
              {comfort}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedMainWaveDirection}
          onChange={handleMainWaveDirectionChange}
        >
          <option value="">Main Wave Direction</option>
          {mainWaveDirection.map((main_waves_direction, index) => (
            <option key={index} value={main_waves_direction}>
              {main_waves_direction}
            </option>
          ))}
        </select>

      </div>

      {/* Selectors grill*/}
      <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">

        <select
          className=" p-2 border border-black rounded bg-pink-500 text-white text-center w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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

        <p className="text-gray-500 text-sm">(Select a month to apply below filters)</p>
        
      </div>

      {/* Month Depending Selectors grill*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 place-items-center justify-center ">

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
          value={selectedRainyDays}
          onChange={handleRainyDaysChange}
        >
          <option value="">Rainy Days</option>
          {rainyDays.map((rainy_days, index) => (
            <option key={index} value={rainy_days}>
              {rainy_days}
            </option>
          ))}
        </select>

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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

      </div>

      {/* Selectors grill*/}
      <div className="grid grid-cols-1 place-items-center gap-3 justify-center">

        <select
          className=" p-2 border border-black rounded bg-blue-500 text-white text-center min-w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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

      {/* Reset Button*/}
      <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-8">

        <button
          className="p-2 border border-red-500 rounded text-red-500 text-center w-[200px] cursor-pointer transform transition-transform duration-200 hover:text-red-600 hover:scale-105"
          onClick={handleReset}
        >Reset Selection
        </button>
        
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
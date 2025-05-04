"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import PulsingHeaderLink from '../PulsingHeaderLink';
import SurfZoneCard from './SurfZoneCard';
// import { useRouter } from 'next/navigation';


const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

console.log(surfZonesApiUrl);
console.log(token);

export default function MonthBestDestinations() {
  // State to track error, loading & response data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  //Get the currennt month
  const currentMonthIndex = new Date().getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[currentMonthIndex]; 
  
  const getSurfZonesCurrentMonth = async (e) => {
    setError('');
    setLoading(true);
    // setResponseData(null);

    try {
      const response = await fetch(`${surfZonesApiUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      });
      console.log('Response: ', response);

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Request failed, please try again');
        console.log(data.detail);
        return;
      }
      const data = await response.json();
      console.log('Response data: ', data);
      
      // Filter surf zones based on the current month
      const filteredData = data.filter(item => item.best_months.includes(currentMonth));
      setResponseData(filteredData);

    } catch (err) {
      setError(`Request failed: ${error.message}`);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurfZonesCurrentMonth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <PulsingHeaderLink />
      {responseData && <h2 className="text-4xl font-bold mt-12 text-left">Best destinations in <span className="text-blue-300">{currentMonth}</span></h2>}
      {error &&
        <div>
          <p className="text-gray-500 text-md text center">Please sign-up / log-in to have access to all features</p>
          {/* <p className="text-red-500 text-sm text-center">{error}</p> */}
        </div>}
      {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}
      {responseData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2 gap-4 rounded-md">
          {responseData.map((surfzone, index) => (
            <SurfZoneCard key={index} surfzone={surfzone} />
          ))}
        </div>
      )}
    </div>
  );
}
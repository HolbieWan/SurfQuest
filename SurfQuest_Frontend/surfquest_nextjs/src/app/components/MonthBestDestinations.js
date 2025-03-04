"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
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

  const doubleRightArrow = "\u21D2";
  const doubleLeftArrow = "\u21D0";

  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <div className="mb-12 text-center">
        <a
          href="/surfzones"
          className="text-4xl font-bold text-cyan-300 hover:text-cyan-400 inline-block group"
        >

          <span
            className="customPulse inline-block transform transition-transform group-hover:-translate-x-2 duration-1000 mr-2 group-hover:animate-none"
          >
            {doubleRightArrow}
          </span>

          <span
            className="customPulse mx-2 inline-block transform transition-transform group-hover:scale-105 duration-4000 mr-2 group-hover:animate-none"
          >
            Find the best surfing destinations for you
          </span>

          <span
            className="customPulse inline-block transform transition-transform group-hover:translate-x-2 duration-1000 mr-2 group-hover:animate-none"
          >
            {doubleLeftArrow}
          </span>

          <style jsx>{`
            @keyframes customPulse {
              0% { opacity: 0.5; }
              42.85% { opacity: 1; }
              57.14% { opacity: 1; }
              100% { opacity: 0.5; } 
            }
            .customPulse {
              animation: customPulse 3.5s infinite;
            }
            .customPulse:hover {
              animation-play-state: paused; /* Pause the animation on hover */
            }
          `}</style>
        </a>
      </div>
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
            <div key={index} className="bg-black rounded-md p-4 relative overflow-hidden group">
              <Link href={`/surfzones/${encodeURIComponent(surfzone.name)}`} legacyBehavior>
                <a className="absolute inset-0 z-10"></a>
              </Link>
              {surfzone.zone_images && surfzone.zone_images.map((image, imgIndex) => (
              <img key={imgIndex} src={image.image} alt={surfzone.name} className="inset-0 mt-4 w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
              ))}
              <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center p-4">
                <h2 className="text-white text-2xl font-bold text-center text-shadow-xl" >{surfzone.name}</h2>
                <div className="mt-2 text-md text-white text-center font-semibold text-shadow-xl">{surfzone.country.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
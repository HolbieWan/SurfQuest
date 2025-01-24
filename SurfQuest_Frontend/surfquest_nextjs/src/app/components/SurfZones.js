"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const surfZonesApiUrl = 'http://localhost:8000/api/surfzones/';
const token = Cookies.get('access_token');

console.log(surfZonesApiUrl);
console.log(token);

export default function SurfZonesRoute() {
  // State to track error, loading & response data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  
  const getAllSurfZones = async (e) => {
    setError('');
    setLoading(true);
    setResponseData(null);

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
        return;
      }
      const data = await response.json();
      console.log('Response data: ', data);
      setResponseData(data);

    } catch (err) {
      setError(`Request failed: ${error.message}`);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSurfZones();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Hot destinations of the month</h2>
      {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
      {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}
      {responseData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4 rounded-md">
          {responseData.map((surfzone, index) => (
              <div key={index} className="bg-black rounded-md p-4 relative overflow-hidden group">
                {surfzone.zone_images && surfzone.zone_images.map((image, imgIndex) => (
                <img key={imgIndex} src={image.image} alt={surfzone.name} className="inset-0 mt-4 w-full h-64 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"/>
                ))}
                <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center p-4">
                  <h2 className="text-white text-xl font-bold text-center text-shadow-md" >{surfzone.name}</h2>
                  <div className="mt-2 text-sm text-white text-center font-semibold text-shadow-lg">{surfzone.country.name}</div>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}

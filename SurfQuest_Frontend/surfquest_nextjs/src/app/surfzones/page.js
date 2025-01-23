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
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Surf Zones</h2>
        {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
        {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}
        {responseData && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-green-500 text-lg">Response Data:</h3>
            <ul>
              {responseData.map((zone, index) => (
                <li key={index} className="text-white">
                  {zone.name} - {zone.location}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

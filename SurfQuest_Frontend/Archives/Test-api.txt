// app/test_api/page.js
'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

const testApiUrl = "http://localhost:8000/api/protected-endpoint/";
const token = Cookies.get('access_token');

console.log(testApiUrl);
console.log(token);

export default function TestApiRoute() {
  // State to track error
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // Function to handle form submission
  const atSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const response = await fetch(`${testApiUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Response: ', response);
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Request failed, please try again');
        return;
      }
      const data = await response.json();
      console.log('Response data: ', data);
      setResponseData(data)

    } catch (err) {
      setError('Request failed, please try again');
      
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Test Api protected endpoint</h2>
        <form className="space-y-4" onSubmit={atSubmission}>
          {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
          {loading && <div><p className="text-blue-500 text-sm">Loading...</p></div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md">
            Test Api
          </button>
        </form>
        {responseData && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <p className="text-green-500 text-sm">Response: {JSON.stringify(responseData)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
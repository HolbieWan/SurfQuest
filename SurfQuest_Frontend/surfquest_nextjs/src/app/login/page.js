// app/login/page.js
'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const usersApiUrl = process.env.NEXT_PUBLIC_USERS_API_URL;
const tokensApiUrl = process.env.NEXT_PUBLIC_TOKENS_API_URL;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

console.log('Users API URL:', usersApiUrl);
console.log('Tokens API URL:', tokensApiUrl);
console.log('Environment:', environment);

export default function LoginPage() {
  // State to track email, password, and any errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state

  // Function to handle form submission
  const atSubmission = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while the request is in progress

    try {
      const response = await fetch(`${tokensApiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log('Response:', response);

      if (!response.ok) {
        // Handle errors 
        const data = await response.json();
        setError(data.detail || 'Login failed, please try again');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Extract the access and refresh tokens
      const { access, refresh } = data;

      // Store the access token in local storage
      localStorage.setItem('authToken', data.token);

      // Store tokens in cookies in local storage
      Cookies.set('access_token', access, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
      console.log(`${Cookies.get('access_token')}`);
      console.log(`${Cookies.get('refresh_token')}`);

      const decodedToken = jwtDecode(access);
      const userId = decodedToken.user_id;
      console.log('User ID:', userId);

      localStorage.setItem('userId', userId);

      window.location.href = '/';

    } catch (err) {
      console.error('Fetch error:', err.message);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  }
  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Log in to SurfQuest</h2>
        <form className="space-y-4" onSubmit={atSubmission}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username} // Bind state
              onChange={(e) => setUsername(e.target.value)} // Update state
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password} // Bind password
              onChange ={(e) => setPassword(e.target.value)} // Update state
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>
            {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
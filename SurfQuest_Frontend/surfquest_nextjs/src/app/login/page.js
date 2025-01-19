// app/login/page.js
'use client';

import { useState } from 'react';

export default function LoginPage() {
  // State to track email, password, and any errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const atSubmission = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        // Handle errors 
        const data = await response.json();
        setError(data.detail || 'Login failed, please try again');
        return;
      }
      const data = await response.json();
      console.log('Login succesfull:', data);

      localStorage.setItem('authToken:', data.token);

      window.location.href = '/';

    } catch (err) {
      console.error('An error occured:', err);
      setError('Something went wrong. Please try again.');
    }
  }
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to SurfQuest</h2>
        <form className="space-y-4" onSubmit={atSubmission}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="username"
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
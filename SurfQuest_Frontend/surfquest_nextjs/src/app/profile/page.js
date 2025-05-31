'use client';

/**
 * ProfilePage Component
 * ---------------------
 * Displays a personalized greeting and the user's submitted reviews.
 * Checks authentication via the access_token cookie and retrieves
 * the username from localStorage. Unauthenticated users are prompted
 * to log in.
 *
 * @returns {JSX.Element} The profile page or a login prompt.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// ============================
// Local Dependencies
// ============================
import UserReviews from '@/components/Reviews/UserReviews';

const token = Cookies.get('access_token');
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

console.log('Environment:', environment);
console.log('Access Token:', token);

// ============================
// Main ProfilePage Component
// ============================
export default function ProfilePage() {
  // ============================
  // State Management
  // ============================
  const [username, setUsername] = useState('');

  // ============================
  // Effect: Load username from localStorage (once on mount)
  // ============================
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);  // <-- make sure this array is always here

  // ============================
  // JSX Output
  // ============================
  return (
    <>
      {token ? (
        <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white">
          <h1 className="text-4xl font-bold">
            Hello <span className="text-cyan-400">{username}</span>
          </h1>

          <div className="w-full max-w-2xl mt-16">
            <UserReviews />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-md text-center px-4 py-16">
          Please{' '}
          <a href="/signup" className="text-blue-400 hover:text-blue-600">
            sign up
          </a>{' '}
          or{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-600">
            log in
          </a>{' '}
          to have access to all features.
        </p>
      )}
    </>
  );
}
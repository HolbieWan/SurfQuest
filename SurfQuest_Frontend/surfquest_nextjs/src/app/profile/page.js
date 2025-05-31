// src/app/profile/page.js
'use client';

/**
 * ProfilePage Component
 * ---------------------
 * Displays the user’s profile with a greeting and their reviews.
 * - On initial client render, checks authentication by looking for an access token cookie.
 * - Retrieves the stored username from localStorage (if available).
 * - Prevents SSR/CSR mismatches by delaying rendering until after client “mount.”
 * - If not authenticated, prompts the user to sign up or log in.
 *
 * @returns {JSX.Element | null} 
 *   - null during hydration to avoid mismatches.
 *   - A message prompting sign-up/log-in if unauthenticated.
 *   - The profile header and UserReviews component if authenticated.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import UserReviews from '@/components/Reviews/UserReviews';

export default function ProfilePage() {
  // ─────────────────────────────────────────────────────────
  // State: “hasMounted” flag
  // --------------------------
  // We set this to true after the component mounts on the client.
  // Until then, return null to avoid a hydration mismatch between
  // the server-rendered HTML and the client.
  // ─────────────────────────────────────────────────────────
  const [hasMounted, setHasMounted] = useState(false);

  // ─────────────────────────────────────────────────────────
  // State: Authentication and Username
  // -----------------------------------
  // - isLoggedIn: track whether the user has a valid access token in cookies
  // - username: retrieved from localStorage if the user is authenticated
  // ─────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // This runs only on the client after mount
    setHasMounted(true);

    // Check for the JWT access token in cookies
    const token = Cookies.get('access_token');
    setIsLoggedIn(!!token);

    // If authenticated, read the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // ─────────────────────────────────────────────────────────
  // While hydrating on the client, render nothing to avoid SSR mismatch
  // ─────────────────────────────────────────────────────────
  if (!hasMounted) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // If user is not logged in, prompt them to sign up or log in
  // ─────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
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
    );
  }

  // ─────────────────────────────────────────────────────────
  // Authenticated view: show greeting and user’s reviews
  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-black text-white">
      {/* Greeting with the user’s stored username */}
      <h1 className="text-4xl font-bold">
        Hello <span className="text-cyan-400">{username}</span>
      </h1>

      {/* Container for the UserReviews component */}
      <div className="w-full max-w-2xl mt-16">
        <UserReviews />
      </div>
    </div>
  );
}
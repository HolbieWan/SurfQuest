// src/services/surfzoneService.js

/**
 * SurfZone Service Module
 *
 * Handles API interactions related to surf zones for the SurfQuest frontend.
 * This service centralizes HTTP requests and authorization logic for surf zone resources.
 */

// ============================
// External Dependencies
// ============================
// import API_BASE_URLS from '@/config/api';  // Configuration file for API base URLs
// import { getAuthHeader } from '@/utils/authService';  // Library to manage cookies in the browser

// ============================
// Public Service Functions
// ============================

/**
 * Fetches all surf zones from the backend API.
 * Includes JWT access token in the request headers for authentication.
 *
 * @async
 * @function fetchSurfZones
 * @returns {Promise<Object[]>} A promise that resolves to an array of surf zone objects
 * @throws {Error} If the request fails or returns an error response
 */
export async function fetchSurfZones(apiUrl, { cache = "no-store" } = {}) {
  const res = await fetch(apiUrl, {
    method: "GET",
    cache, // Next SSR: "no-store" ou "force-cache" selon ton besoin
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let message = "Failed to fetch surf zones.";
    try {
      const errorData = await res.json();
      message = errorData?.detail || errorData?.message || message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text.slice(0, 200);
    }
    throw new Error(message);
  }

  return res.json();
}


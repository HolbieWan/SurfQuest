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
import API_BASE_URLS from '@/config/api';  // Configuration file for API base URLs
import { getAuthHeader } from '@/utils/authService';  // Library to manage cookies in the browser

// ============================
// Configuration
// ============================
const surfZonesApiUrl = API_BASE_URLS.SURFZONES; //

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
export async function fetchSurfZones() {
  const response = await fetch(`${surfZonesApiUrl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // Expect JSON data format
      ...getAuthHeader(), // Include authorization header with JWT token
    },
    mode: 'cors', // Ensure CORS policy is respected for external requests
    credentials: 'include', // Ensure cookies (e.g. session info) are sent
  });

  // If backend responds with error, throw detailed message
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch surf zones');
  }

  // Return JSON data if request is successful
  return await response.json();
}
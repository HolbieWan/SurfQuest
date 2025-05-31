// src/services/surfspotService.js

/**
 * surfspotService Module
 * ----------------------
 * Provides functions to interact with the SurfSpot API endpoints.
 * Currently includes:
 *  - fetchSurfSpots: Retrieves all surf spots with token-based authentication.
 */

// ============================
// Fetch Surf Spots
// ============================
/**
 * Fetch all surf spots from the API using Bearer token authentication.
 *
 * @param {string} apiUrl - The base URL for the surf spots endpoint.
 * @param {string} token  - JWT access token for authenticated requests.
 *
 * @returns {Promise<Array<Object>>} Resolves with an array of surf spot objects.
 * @throws {Error} If the network request fails or the response status is not OK.
 */
export async function fetchSurfSpots(apiUrl, token) {
  // Perform GET request to the API endpoint
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    credentials: 'include',
  });

  // If the response is not OK, extract error detail (if available) and throw
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch surf spots.');
  }

  // Parse and return the JSON payload (array of surf spot objects)
  return await response.json();
}
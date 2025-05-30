/**
 * SurfQuest – Surf Spot Service
 *
 * Provides functions to fetch surf spot data from the backend API with
 * token-based authentication. Used by SurfZoneDetailsPage and related
 * components to load surf spot information.
 */

// ============================
// Public Service Functions
// ============================

/**
 * Fetches all surf spots from the API, using the provided URL and JWT token.
 *
 * @async
 * @function fetchSurfSpots
 * @param {string} apiUrl - The base URL of the surf spots endpoint.
 * @param {string} token - JWT access token for Authorization header.
 * @returns {Promise<Object[]>} Resolves to an array of surf spot objects.
 * @throws {Error} If the network request fails or returns a non-2xx status.
 *
 * @example
 * const apiUrl = API_BASE_URLS.SURFSPOTS;
 * const token = Cookies.get('access_token');
 * const surfSpots = await fetchSurfSpots(apiUrl, token);
 */
export async function fetchSurfSpots(apiUrl, token) {
    // Make GET request to the surf spots endpoint
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Bearer token authentication
      },
      mode: 'cors',
      credentials: 'include', // Include cookies if needed
    });
  
    // If the response is not OK, extract and throw an error message
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch surf spots.');
    }
  
    // Parse and return the JSON response body
    return await response.json();
  }
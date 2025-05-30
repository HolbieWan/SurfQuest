// surfspotService.js

/**
 * Fetch all surf spots with token-based authentication.
 *
 * @returns {Promise<Array>} The array of surf spots.
 * @throws {Error} If the fetch fails or returns a non-OK status.
 */
export async function fetchSurfSpots(apiUrl, token) {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      credentials: 'include',
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch surf spots.');
    }
  
    return await response.json();
  }
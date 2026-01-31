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
 * Fetches all surf spots from the API.
 *
 * @async
 * @function fetchSurfSpots
 * @param {string} apiUrl - The base URL of the surf spots endpoint.
 * @returns {Promise<Object[]>} Resolves to an array of surf spot objects.
 * @throws {Error} If the network request fails or returns a non-2xx status.
 *
 * @example
 * const apiUrl = API_BASE_URLS.SURFSPOTS;
 * const surfSpots = await fetchSurfSpots(apiUrl);
 */
export async function fetchSurfSpots(apiUrl) {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  });

  if (!response.ok) {
    let message = "Failed to fetch surf spots.";
    try {
      const errorData = await response.json();
      message = errorData?.detail || message;
    } catch (_) {
      // response not json
      const text = await response.text().catch(() => "");
      if (text) message = text.slice(0, 200);
    }
    throw new Error(message);
  }

  return response.json();
}
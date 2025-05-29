/**
 * Authentication Utility Functions
 *
 * Provides helper functions for managing JWT authentication tokens and headers.
 * Used across the SurfQuest frontend to retrieve and apply authorization headers.
 */

// ============================
// External Dependencies
// ============================
import Cookies from 'js-cookie';  // For managing browser cookies

// ============================
// Token Utilities
// ============================

/**
 * Retrieves the JWT access token from browser cookies.
 *
 * @function getAccessToken
 * @returns {string|null} The access token, or null if not present.
 */
export function getAccessToken() {
  return Cookies.get('access_token') || null;
}

/**
 * Constructs the Authorization header using the stored JWT access token.
 *
 * @function getAuthHeader
 * @returns {Object} An object with the Authorization header, or an empty object if token is missing.
 */
export function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
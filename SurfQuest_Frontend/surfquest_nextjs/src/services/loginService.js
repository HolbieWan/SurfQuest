/**
 * Login Service
 *
 * This module handles the login process by sending user credentials to the backend
 * and managing the storage of authentication tokens and user information.
 * Used by the SurfQuest frontend to authenticate users securely.
 */

// ============================
// External Dependencies
// ============================
import Cookies from 'js-cookie';             // Used for storing and retrieving tokens from cookies
import { jwtDecode } from 'jwt-decode';      // Decodes JWT token to extract user information

// ============================
// Local Application Imports
// ============================
import API_BASE_URLS from '@/config/api';    // Centralized API endpoint configuration

// ============================
// Public Service Functions
// ============================

/**
 * Logs in a user by sending credentials to the auth endpoint and storing tokens on success.
 *
 * @async
 * @function loginUser
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns {Object} The decoded JWT payload containing user info
 * @throws {Error} If login fails or the API returns an error response
 */
export async function loginUser(username, password) {
  // ============================
  // Clear any existing session before logging in
  // ============================
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');

  // ============================
  // Send credentials to API
  // ============================
  const response = await fetch(API_BASE_URLS.TOKENS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed, please try again.');
  }

  const { access, refresh } = await response.json();

  // Store the access token in local storage
  localStorage.setItem('authToken', access);
  // console.log('Access Token:', access);

  // Store tokens
  Cookies.set('access_token', access, { expires: 1, secure: true, sameSite: 'Strict' });
  Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'Strict' });
  // console.log('Access Token Cookie:', Cookies.get('access_token'));
  // console.log('Refresh Token Cookie:', Cookies.get('refresh_token'));

  // Decode token and extract user info
  const decodedToken = jwtDecode(access);
  const { user_id } = decodedToken.user_id;

  localStorage.setItem('userId', user_id);
  localStorage.setItem('username', username);

  return decodedToken;
}
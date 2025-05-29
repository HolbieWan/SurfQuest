// src/services/signupService.js

/**
 * Signup Service – Handles user registration and automatic login for SurfQuest.
 *
 * This service provides two main functions:
 * 1. registerUser: Sends multipart/form-data to register a new user.
 * 2. loginAfterSignup: Logs the user in right after registration and stores tokens in cookies.
 */

// ============================
// Imports
// ============================
import API_BASE_URLS from "@/config/api"; // Centralized API endpoint configuration
import Cookies from "js-cookie";          // For storing JWT tokens securely in cookies

/**
 * Sends user registration data to the backend API.
 *
 * Constructs a FormData payload including optional avatar file.
 * Sends the form via POST to the USERS endpoint.
 *
 * @param {Object} userData - The user data to be submitted.
 * @param {string} userData.username - Chosen username.
 * @param {string} userData.email - Email address.
 * @param {string} userData.password - Plain text password.
 * @param {File} [userData.avatar] - Optional avatar image file.
 * @returns {Promise<Response>} - The raw fetch response object.
 */
export async function registerUser(userData) {
  const formData = new FormData();
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  if (userData.avatar) formData.append("avatar", userData.avatar); // Add file only if exists

  const response = await fetch(API_BASE_URLS.USERS, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  return response; // The calling function is responsible for handling .ok or parsing
}

/**
 * Logs in a user after successful signup and stores tokens in secure cookies.
 *
 * Sends credentials to the TOKENS endpoint. On success, stores access and refresh
 * tokens with limited expiration and security settings.
 *
 * @param {string} username - Registered username.
 * @param {string} password - User's plain password.
 * @returns {Promise<void>} - Resolves on successful login or throws error if login fails.
 * @throws {Error} - If login fails (e.g., incorrect credentials).
 */
export async function loginAfterSignup(username, password) {
  const response = await fetch(API_BASE_URLS.TOKENS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login after registration.");
  }

  const { access, refresh } = await response.json();

  // Store tokens in cookies for subsequent authenticated requests
  Cookies.set("access_token", access, { expires: 1, secure: true, sameSite: "Strict" });
  Cookies.set("refresh_token", refresh, { expires: 7, secure: true, sameSite: "Strict" });
}
/**
 * SurfQuest – API Endpoints Configuration
 *
 * Centralizes all base URLs for the SurfQuest backend API.
 * Import this module wherever an API call is made to ensure
 * consistency and easy maintenance of endpoint addresses.
 */

// ============================
// Local Dependencies
// ============================
import UserReviews from "@/components/Reviews/UserReviews"; // (Optional) Example component import

/**
 * Object containing centralized base URLs for various API endpoints.
 * Values are loaded from environment variables at build time.
 *
 * @typedef {Object} APIEndpoints
 * @property {string} TOKENS         - URL for obtaining JWT tokens (login).
 * @property {string} USERS          - URL for user registration and profile management.
 * @property {string} SURFZONES      - URL for fetching surf zone metadata.
 * @property {string} SURFSPOTS      - URL for fetching surf spot data.
 * @property {string} REVIEWS        - URL for fetching and posting surf zone reviews.
 * @property {string} USER_REVIEWS   - URL for fetching reviews specific to a user.
 */
const API_BASE_URLS = {
  TOKENS:        process.env.NEXT_PUBLIC_TOKENS_API_URL,
  USERS:         process.env.NEXT_PUBLIC_USERS_API_URL,
  SURFZONES:     process.env.NEXT_PUBLIC_SURFZONES_API_URL,
  SURFSPOTS:     process.env.NEXT_PUBLIC_SURFSPOTS_API_URL,
  REVIEWS:       process.env.NEXT_PUBLIC_REVIEWS_API_URL,
  USER_REVIEWS:  process.env.NEXT_PUBLIC_USER_REVIEWS_API_URL,
};

export default API_BASE_URLS;
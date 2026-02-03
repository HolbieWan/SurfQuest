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
// const API_BASE_URLS = {
//   // ⚠️ côté client: NEXT_PUBLIC_...
//   // ⚠️ côté serveur (SSR): API_INTERNAL_BASE_URL (sans NEXT_PUBLIC)

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_BASE = process.env.API_INTERNAL_BASE_URL;

// Petit helper pour join sans double slash
function join(base, path) {
  if (!base) return null;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ⚠️ SSR: on veut INTERNAL si dispo, sinon fallback PUBLIC (utile hors docker)
export function getServerBaseUrl() {
  return INTERNAL_BASE || PUBLIC_BASE;
}

// Client: toujours PUBLIC
export function getPublicBaseUrl() {
  return PUBLIC_BASE;
}

export const API = {
  // SSR-safe
  server: {
    surfzones: join(getServerBaseUrl(), "/api/v1/surfzones-lite/"),
    surfzonesDetail: join(getServerBaseUrl(), "/api/v1/surfzones-detail/"),
    surfspots: join(getServerBaseUrl(), "/api/v1/surfspots-lite/"),
    surfspotsDetail: join(getServerBaseUrl(), "/api/v1/surfspots-detail/"),
    reviews: join(getServerBaseUrl(), "/api/v1/reviews/"),
    userReviews: join(getServerBaseUrl(), "/api/v1/user-reviews/"),
    tokens: join(getServerBaseUrl(), "/api/login/"),
    users: join(getServerBaseUrl(), "/api/v1/users/"),
  },

  // Browser-safe
  public: {
    surfzones: join(getPublicBaseUrl(), "/api/v1/surfzones-lite/"),
    surfzonesDetail: join(getPublicBaseUrl(), "/api/v1/surfzones-detail/"),
    surfspots: join(getPublicBaseUrl(), "/api/v1/surfspots-lite/"),
    surfspotsDetail: join(getPublicBaseUrl(), "/api/v1/surfspots-detail/"),
    reviews: join(getPublicBaseUrl(), "/api/v1/reviews/"),
    userReviews: join(getPublicBaseUrl(), "/api/v1/user-reviews/"),
    tokens: join(getPublicBaseUrl(), "/api/login/"),
    users: join(getPublicBaseUrl(), "/api/v1/users/"),
  },
};

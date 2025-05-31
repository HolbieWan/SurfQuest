/** 
 * @type {import('next').NextConfig} 
 *
 * Next.js configuration file for the SurfQuest application.
 * This file exposes environment variables on the client side by
 * prefixing them with NEXT_PUBLIC_. These variables are injected
 * at build time and can be accessed via process.env in the code.
 */
const nextConfig = {
  // The `env` object allows you to expose environment variables
  // to the browser/client. Any variable defined here will be available
  // as process.env.NEXT_PUBLIC_... in both server and client bundles.
  env: {
    // URL for the Users API endpoint.
    NEXT_PUBLIC_USERS_API_URL: process.env.NEXT_PUBLIC_USERS_API_URL,

    // URL for the Tokens API endpoint.
    NEXT_PUBLIC_TOKENS_API_URL: process.env.NEXT_PUBLIC_TOKENS_API_URL,

    // URL for the Surf Spots API endpoint.
    NEXT_PUBLIC_SURFSPOTS_API_URL: process.env.NEXT_PUBLIC_SURFSPOTS_API_URL,

     // * URL for the Surf Zones API endpoint.
    NEXT_PUBLIC_SURFZONES_API_URL: process.env.NEXT_PUBLIC_SURFZONES_API_URL,

     //  URL for the Reviews API endpoint.
    NEXT_PUBLIC_REVIEWS_API_URL: process.env.NEXT_PUBLIC_REVIEWS_API_URL,

     //  URL for the User Reviews API endpoint.
    NEXT_PUBLIC_USER_REVIEWS_API_URL: process.env.NEXT_PUBLIC_USER_REVIEWS_API_URL,

    /**
     * Current environment flag (e.g., "development" or "production").
     * Used in the app to toggle features or logging based on environment.
     * Expected to be defined as:
     *   NEXT_PUBLIC_ENVIRONMENT=development
     * or
     *   NEXT_PUBLIC_ENVIRONMENT=production
     */
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT
  }
};

export default nextConfig;
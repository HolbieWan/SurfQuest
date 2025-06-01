/** 
 * @type {import('next').NextConfig} 
 *
 * Next.js configuration file for the SurfQuest application.
 * This file exposes environment variables on the client side by
 * prefixing them with NEXT_PUBLIC_. These variables are injected
 * at build time and can be accessed via process.env in the code.
 *
 * We also add a `rewrites()` section so that `GET /media/:path*` 
 * on port 3000 will be forwarded to `http://localhost:8080/media/:path*`.
 */
const nextConfig = {
  // Expose NEXT_PUBLIC_... variables to the browser
  env: {
    NEXT_PUBLIC_USERS_API_URL: process.env.NEXT_PUBLIC_USERS_API_URL,
    NEXT_PUBLIC_TOKENS_API_URL: process.env.NEXT_PUBLIC_TOKENS_API_URL,
    NEXT_PUBLIC_SURFSPOTS_API_URL: process.env.NEXT_PUBLIC_SURFSPOTS_API_URL,
    NEXT_PUBLIC_SURFZONES_API_URL: process.env.NEXT_PUBLIC_SURFZONES_API_URL,
    NEXT_PUBLIC_REVIEWS_API_URL: process.env.NEXT_PUBLIC_REVIEWS_API_URL,
    NEXT_PUBLIC_USER_REVIEWS_API_URL: process.env.NEXT_PUBLIC_USER_REVIEWS_API_URL,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },

  /**
   * When the browser (or Lighthouse) tries to fetch "/media/…"
   * from our front‐end (port 3000), Next.js will proxy that request
   * to the Nginx server running at http://localhost:8080.
   *
   * That way, your <img src="/media/…"> tags continue to work
   * without modification—Next.js simply hands off any "/media/*"
   * request to Nginx.
   */
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'http://localhost:8080/media/:path*',
      },
    ]
  },
};

export default nextConfig;
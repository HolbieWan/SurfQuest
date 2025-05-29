// src/config/api.js

import UserReviews from "@/components/Reviews/UserReviews";

/**
 * Centralized configuration for API endpoints
 */
const API_BASE_URLS = {
    TOKENS: process.env.NEXT_PUBLIC_TOKENS_API_URL,
    USERS: process.env.NEXT_PUBLIC_USERS_API_URL,
    SURFZONES: process.env.NEXT_PUBLIC_SURFZONES_API_URL,
    SURFSPOTS: process.env.NEXT_PUBLIC_SURFSPOTS_API_URL,
    REVIEWS: process.env.NEXT_PUBLIC_REVIEWS_API_URL,
    USER_REVIEWS: process.env.NEXT_PUBLIC_USER_REVIEWS_API_URL,
  };
  
  export default API_BASE_URLS;
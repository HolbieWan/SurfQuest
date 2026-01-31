// /**
//  * reviewService.js
//  * ---------------
//  * Provides functions to interact with the Reviews API endpoint,
//  * including fetching all reviews and posting new reviews with
//  * token-based authentication.
//  */

// // ============================
// // External Dependencies
// // ============================
// import API_BASE_URLS from '@/config/api';

// /**
//  * Fetches all reviews from the API using the provided token.
//  *
//  * @param {string} token - The JWT access token for authorization.
//  * @returns {Promise<Array>} - Resolves to an array of review objects.
//  * @throws {Error} - If the fetch request fails or returns a non-OK status.
//  */
// export async function fetchAllReviews(token) {
//   const response = await fetch(API_BASE_URLS.REVIEWS, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     mode: 'cors',
//     credentials: 'include',
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || 'Failed to fetch reviews.');
//   }

//   return await response.json();
// }

// /**
//  * Posts a new review to the API using the provided token and review data.
//  *
//  * @param {string} token - The JWT access token for authorization.
//  * @param {Object} reviewData - An object containing review details.
//  * @param {string} [reviewData.surfZoneId] - ID of the surf zone being reviewed (if any).
//  * @param {string} [reviewData.surfSpotId] - ID of the surf spot being reviewed (if any).
//  * @param {number|string} reviewData.rating - Numerical rating value.
//  * @param {string} reviewData.comment - Textual comment for the review.
//  * @returns {Promise<Object>} - Resolves to the newly created review object.
//  * @throws {Error} - If the POST request fails or returns a non-OK status.
//  */
// export async function postNewReview(token, { surfZoneId = '', surfSpotId = '', rating, comment }) {
//   const response = await fetch(API_BASE_URLS.REVIEWS, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       surf_zone: surfZoneId,
//       surf_spot: surfSpotId,
//       rating,
//       comment,
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || 'Failed to post review.');
//   }

//   return await response.json();
// }

import { API } from "@/config/api";

// Exemple: fetch toutes les reviews d'un surfspot via param ?surfspot=<id>
// (adapte selon TON backend)
export async function fetchReviewsBySurfSpotId(surfSpotId) {
  const url = `${API.public.reviews}?surfspot=${encodeURIComponent(surfSpotId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let msg = "Failed to fetch reviews.";
    try {
      const data = await res.json();
      msg = data?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}
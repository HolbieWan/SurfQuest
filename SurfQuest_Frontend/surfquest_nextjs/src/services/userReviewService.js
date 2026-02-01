/**
 * userReviewService.js
 * --------------------
 * Provides functions to interact with the User Reviews API endpoint,
 * including fetching the logged-in user’s reviews, updating a review,
 * and deleting a review. All requests are token-authenticated.
 */

// ============================
// External Dependencies
// ============================
import { API } from '@/config/api';

/**
 * Fetches all reviews belonging to the currently authenticated user.
 *
 * @param {string} token - The JWT access token for authorization.
 * @returns {Promise<Array>} - Resolves to an array of the user's review objects.
 * @throws {Error} - If the fetch fails or returns a non-OK status.
 */

export async function fetchUserReviews(token) {
  const response = await fetch(`${API.server.userReviews}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    mode: 'cors',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user reviews.');
  }

  return await response.json();
}

export async function postNewReview(token, reviewData) {
  const response = await fetch(`${API.server.userReviews}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user reviews.");
  }

  return await response.json();
}


/**
 * Updates an existing review for the user.
 *
 * @param {string} token - The JWT access token for authorization.
 * @param {Object} reviewPayload - Data needed to update the review.
 * @param {number|string} reviewPayload.id - The ID of the review to update.
 * @param {number|string} reviewPayload.rating - The new rating value.
 * @param {string} reviewPayload.comment - The new comment text.
 * @param {string|null} reviewPayload.surfZoneId - The ID of the surf zone (if applicable).
 * @param {string|null} reviewPayload.surfSpotId - The ID of the surf spot (if applicable).
 * @returns {Promise<Object>} - Resolves to the updated review object.
 * @throws {Error} - If the PUT request fails or returns a non-OK status.
 */
export async function updateUserReview(
  token,
  { id, rating, comment, surfZoneId = null, surfSpotId = null }
) {
  const response = await fetch(`${API.server.userReviews}${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      // Only include these if non-null; backend accepts null for the other
      surf_zone: surfZoneId,
      surf_spot: surfSpotId,
      rating,
      comment,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update review.');
  }

  return await response.json();
}

/**
 * Deletes an existing review belonging to the user.
 *
 * @param {string} token - The JWT access token for authorization.
 * @param {number|string} reviewId - The ID of the review to delete.
 * @returns {Promise<void>} - Resolves when deletion succeeds.
 * @throws {Error} - If the DELETE request fails or returns a non-OK status.
 */
export async function deleteUserReview(token, reviewId) {
  const response = await fetch(`${API.server.userReviews}${reviewId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete review.');
  }
}
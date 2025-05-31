/**
 * reviewUtils.js
 * --------------
 * Contains helper functions to filter reviews based on user context,
 * such as surf zone or surf spot, and to find the logged-in user’s review.
 */

/**
 * Filters a list of reviews for the given surf zone or surf spot name.
 *
 * @param {Array<Object>} reviews - Full list of review objects from the API.
 * @param {string|null} zoneName - Name of the surf zone to filter by (or null).
 * @param {string|null} spotName - Name of the surf spot to filter by (or null).
 * @returns {Array<Object>} - A filtered array of reviews matching the given context.
 */
export function filterReviewsByContext(reviews, zoneName, spotName) {
    return reviews.filter((review) =>
      (zoneName && review.surf_zone_details?.name === zoneName) ||
      (spotName && review.surf_spot_details?.name === spotName)
    );
  }
  
  /**
   * Finds the review written by a specific user (by ID) in a list of reviews.
   *
   * @param {Array<Object>} reviews - Array of review objects.
   * @param {string|number} userId - The ID of the user whose review to find.
   * @returns {Object|null} - The matching review object, or null if none found.
   */
  export function findUserReview(reviews, userId) {
    return reviews.find((review) => review.user?.id === userId) || null;
  }
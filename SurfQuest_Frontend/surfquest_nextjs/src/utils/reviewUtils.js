/**
 * reviewUtils.js
 * --------------
 * Minimal helpers for reviews UI.
 */

export function findUserReview(reviews, userId) {
  if (!userId) return null;
  return (
    (Array.isArray(reviews) ? reviews : []).find(
      (r) => r?.user?.id === userId,
    ) || null
  );
}

/**
 * Find the current user's review from "my reviews" endpoint, filtered by zone/spot.
 * This avoids loading *all* reviews just to know if user already posted.
 */
export function findUserReviewForTarget(
  userReviews,
  { surfZoneId, surfSpotId },
) {
  const list = Array.isArray(userReviews) ? userReviews : [];
  return (
    list.find((r) => surfZoneId && r?.surf_zone === surfZoneId) ||
    list.find((r) => surfSpotId && r?.surf_spot === surfSpotId) ||
    null
  );
}

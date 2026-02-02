/**
 * userReviewService.js
 * --------------------
 * Authenticated user reviews endpoint.
 * - GET    /user-reviews/      -> list my reviews
 * - POST   /user-reviews/      -> create my review
 * - PUT    /user-reviews/<id>/ -> update my review (optional later)
 * - DELETE /user-reviews/<id>/ -> delete my review (optional later)
 */

import { API } from "@/config/api";

export async function fetchUserReviews(token) {
  const url = API.public.userReviews;
  if (!url) throw new Error("Missing userReviews API base URL.");
  if (!token) throw new Error("Missing auth token.");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    mode: "cors",
    credentials: "include",
  });

  if (!res.ok) {
    let msg = "Failed to fetch user reviews.";
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export async function postNewReview(
  token,
  { surfZoneId, surfSpotId, rating, comment },
) {
  const url = API.public.userReviews;
  if (!url) throw new Error("Missing userReviews API base URL.");
  if (!token) throw new Error("Missing auth token.");

  const payload = {
    rating: Number(rating),
    comment: comment || "",
    // Backend write serializer expects surf_zone / surf_spot keys (UUIDs)
    surf_zone: surfZoneId || null,
    surf_spot: surfSpotId || null,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    mode: "cors",
    credentials: "include",
  });

  if (!res.ok) {
    let msg = "Failed to post review.";
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Update an existing review (authenticated)
 */
export async function updateUserReview(token, { id, rating, comment, surf_zone = null, surf_spot = null }) {
  if (!id) throw new Error("Missing review id.");

  const res = await fetch(`${API.public.userReviews}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({ surf_zone, surf_spot, rating, comment }),
  });

  if (!res.ok) {
    let msg = "Failed to update review.";
    try {
      const data = await res.json();
      msg = data?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Delete an existing review (authenticated)
 */
export async function deleteUserReview(token, reviewId) {
  if (!reviewId) throw new Error("Missing review id.");

  const res = await fetch(`${API.public.userReviews}${reviewId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    credentials: "include",
  });

  if (!res.ok) {
    let msg = "Failed to delete review.";
    try {
      const data = await res.json();
      msg = data?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  // No JSON expected on DELETE
  return true;
}
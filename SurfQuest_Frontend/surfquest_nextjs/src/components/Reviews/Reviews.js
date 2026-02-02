"use client";

/**
 * Reviews Component (clean refactor)
 * ---------------------------------
 * Displays reviews for a SurfZone or SurfSpot:
 * - Public list: GET /reviews?surf_zone_id=... or surf_spot_id=...
 * - If logged in:
 *   - Checks if user already reviewed via GET /user-reviews/
 *   - Allows POST /user-reviews/ if not reviewed yet
 *
 * Props:
 * - selectedSurfZone (string) optional (for title only)
 * - selectedSurfSpot (string) optional (for title only)
 * - surfZoneId (uuid) optional
 * - surfSpotId (uuid) optional
 */

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

import ReviewCard from "@/components/Reviews/ReviewCard";
import ReviewForm from "@/components/Reviews/ReviewForm";

import { fetchReviews } from "@/services/reviewService";
import { fetchUserReviews, postNewReview } from "@/services/userReviewService";
import { findUserReviewForTarget } from "@/utils/reviewUtils";

function getLocalUserId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
}

export default function Reviews({
  selectedSurfZone,
  selectedSurfSpot,
  surfZoneId,
  surfSpotId,
}) {
  const [token, setToken] = useState("");
  const isAuthenticated = Boolean(token);

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [userId, setUserId] = useState(null);

  const [error, setError] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const title = selectedSurfZone || selectedSurfSpot || "Reviews";

  // target guard: must have at least one id
  const hasTarget = Boolean(surfZoneId || surfSpotId);

  // Load token from cookies (client)
  useEffect(() => {
    setToken(Cookies.get("access_token") || "");
  }, []);

  // 1) read userId once (client)
  useEffect(() => {
    setUserId(getLocalUserId());
  }, []);

  // 2) fetch PUBLIC reviews list for this target
  useEffect(() => {
    if (!hasTarget) return;

    const getReviews = async () => {
      setLoadingList(true);
      setError("");

      try {
        const data = await fetchReviews({ surfZoneId, surfSpotId });
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load reviews.");
        setReviews([]);
      } finally {
        setLoadingList(false);
      }
    };

    getReviews();
  }, [surfZoneId, surfSpotId, hasTarget]);

  // 3) fetch MY reviews (only if authenticated) to know if I already reviewed this target
  useEffect(() => {
    if (!hasTarget) return;
    if (!isAuthenticated) {
      setMyReview(null);
      return;
    }

    const getReviews = async () => {
      setError("");

      try {
        const mine = await fetchUserReviews(token);
        const found = findUserReviewForTarget(mine, { surfZoneId, surfSpotId });
        setMyReview(found || null);
      } catch (err) {
        // If token invalid/expired, don't break the public list.
        setMyReview(null);
      }
    };

    getReviews();
  }, [surfZoneId, surfSpotId, hasTarget, isAuthenticated, token]);

  // Form handlers
  const handleInputChange = (e) => {
    setNewReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to post a review.");
      return;
    }
    if (!hasTarget) {
      setError("Missing surf zone/spot target.");
      return;
    }

    setLoadingPost(true);
    setError("");

    try {
      const created = await postNewReview(token, {
        surfZoneId: surfZoneId || null,
        surfSpotId: surfSpotId || null,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      // Update UI:
      setMyReview(created);
      setReviews((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
      setNewReview({ rating: "", comment: "" });
    } catch (err) {
      setError(err?.message || "Failed to post review.");
    } finally {
      setLoadingPost(false);
    }
  };

  const userAlreadyReviewed = Boolean(myReview);

  // Render
  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center w-full">
      <h2 className="text-4xl font-bold text-center text-white p-2 w-full">
        <span className="text-pink-400">{title}</span> Reviews
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {loadingList && <p className="text-blue-400">Loading reviews...</p>}

      {/* List */}
      {!loadingList && (
        <>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </>
      )}

      {/* Form */}
      {isAuthenticated ? (
        userAlreadyReviewed ? (
          <p className="text-gray-400 text-center">
            ✅ You already posted a review for this place.
          </p>
        ) : (
          <ReviewForm
            newReview={newReview}
            handleInputChange={handleInputChange}
            handleReviewSubmit={handleReviewSubmit}
            loading={loadingPost}
          />
        )
      ) : (
        <p className="text-gray-500 text-center">Log in to post a review.</p>
      )}
    </div>
  );
}

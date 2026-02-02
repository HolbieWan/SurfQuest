"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

import ReviewCard from "@/components/Reviews/ReviewCard";
import ReviewForm from "@/components/Reviews/ReviewForm";

import {
  fetchUserReviews,
  updateUserReview,
  deleteUserReview,
} from "@/services/userReviewService";

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⚠️ ne pas "freeze" le token avec useMemo([]) : on le lit directement
  const token = Cookies.get("access_token") || "";
  const isAuthenticated = Boolean(token);

  const zoneReviews = useMemo(
    () => reviews.filter((r) => Boolean(r.surf_zone)),
    [reviews],
  );
  const spotReviews = useMemo(
    () => reviews.filter((r) => Boolean(r.surf_spot)),
    [reviews],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUserReviews(token);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load your reviews.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, token]);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setUpdatedReview({
      rating: String(review.rating ?? ""),
      comment: review.comment ?? "",
    });
  };

  const handleInputChange = (e) => {
    setUpdatedReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    setLoading(true);
    setError("");
    try {
      const updated = await updateUserReview(token, {
        id: editingReview.id,
        rating: Number(updatedReview.rating),
        comment: updatedReview.comment,
        surf_zone: editingReview.surf_zone || null,
        surf_spot: editingReview.surf_spot || null,
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      setEditingReview(null);
    } catch (err) {
      setError(err?.message || "Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    setError("");
    try {
      await deleteUserReview(token, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      if (editingReview?.id === reviewId) setEditingReview(null);
    } catch (err) {
      setError(err?.message || "Failed to delete review.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-gray-400">Log in to see your reviews.</p>;
  }

  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-400">Loading...</p>}

      {reviews.length === 0 && !loading ? (
        <p className="text-gray-400">You have no reviews yet.</p>
      ) : (
        <>
          {/* Surf zones */}
          {zoneReviews.length > 0 && (
            <>
              <h2 className="text-4xl font-bold text-left text-white p-2 w-full">
                Your <span className="text-pink-400">Surf Places</span> Reviews
              </h2>

              {zoneReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <ReviewCard
                    review={review}
                    targetLabel={review.surf_zone_name || "Surf place"}
                    onEdit={() => handleEditClick(review)}
                    onDelete={() => handleDeleteReview(review.id)}
                  />

                  {editingReview?.id === review.id && (
                    <ReviewForm
                      newReview={updatedReview}
                      handleInputChange={handleInputChange}
                      handleReviewSubmit={handleUpdateReviewSubmit}
                      submitLabel="Update Review"
                      cancelLabel="Cancel"
                      onCancel={() => setEditingReview(null)}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Surf spots */}
          {spotReviews.length > 0 && (
            <>
              <h2 className="text-4xl font-bold text-left text-white p-2 mt-4 w-full">
                Your <span className="text-pink-400">Surf Spots</span> Reviews
              </h2>

              {spotReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <ReviewCard
                    review={review}
                    targetLabel={review.surf_spot_name || "Surf spot"}
                    onEdit={() => handleEditClick(review)}
                    onDelete={() => handleDeleteReview(review.id)}
                  />

                  {editingReview?.id === review.id && (
                    <ReviewForm
                      newReview={updatedReview}
                      handleInputChange={handleInputChange}
                      handleReviewSubmit={handleUpdateReviewSubmit}
                      submitLabel="Update Review"
                      cancelLabel="Cancel"
                      onCancel={() => setEditingReview(null)}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

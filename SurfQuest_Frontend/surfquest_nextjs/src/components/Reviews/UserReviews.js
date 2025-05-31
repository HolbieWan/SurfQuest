"use client";

/**
 * UserReviews Component
 * ---------------------
 * Fetches and displays the logged-in user’s own surf-zone and surf-spot reviews.
 * Allows in-place editing or deletion of each review. Delegates API calls to
 * userReviewService for clarity and separation of concerns.
 *
 * @returns {JSX.Element} A list of the user’s reviews with edit/delete capabilities.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

// ============================
// Local Dependencies
// ============================
import {
  fetchUserReviews,
  updateUserReview,
  deleteUserReview,
} from "@/services/userReviewService";

export default function UserReviews() {
  // ============================
  // State Management
  // ============================
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({ rating: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // ============================
  // Read userId from localStorage (client-side only)
  // ============================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId");
      setUserId(storedId);
    }
  }, []);

  // ============================
  // Fetch the user’s reviews once userId is known
  // ============================
  useEffect(() => {
    // Only fetch when userId is available
    if (!userId) return;

    const loadReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("access_token");
        const data = await fetchUserReviews(token);
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [userId]);

  // ============================
  // Handle clicking “Edit” on a review
  // ============================
  const handleEditClick = (review) => {
    // Pre-populate the form fields with the existing rating/comment
    setEditingReview(review);
    setUpdatedReview({
      rating: review.rating,
      comment: review.comment,
    });
  };

  // ============================
  // Track form field changes for editing
  // ============================
  const handleInputChange = (e) => {
    setUpdatedReview({ ...updatedReview, [e.target.name]: e.target.value });
  };

  // ============================
  // Submit an updated review to the API
  // ============================
  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();

    if (!editingReview) {
      console.error("No review is currently being edited.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("access_token");
      const payload = {
        id: editingReview.id,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        // Send surf_zone or surf_spot IDs if present
        surfZoneId: editingReview.surf_zone_details
          ? editingReview.surf_zone_details.id
          : null,
        surfSpotId: editingReview.surf_spot_details
          ? editingReview.surf_spot_details.id
          : null,
      };
      const updated = await updateUserReview(token, payload);

      // Replace the old review with the newly returned object
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setEditingReview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Delete a review via the API
  // ============================
  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("access_token");
      await deleteUserReview(token, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      // If we were editing this review, cancel the form
      if (editingReview && editingReview.id === reviewId) {
        setEditingReview(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-400">Loading...</p>}

      {reviews.length > 0 ? (
        <>
          {/* ==== Surf-Zone Reviews ==== */}
          {reviews.some((rv) => rv.surf_zone_details) && (
            <>
              <h2 className="text-4xl font-bold text-left text-white p-2 w-full">
              Your <span className="text-pink-400">Surf Places</span> Reviews
              </h2>
              {reviews
                .filter((rv) => rv.surf_zone_details)
                .map((review) => (
                  <React.Fragment key={review.id}>
                    {/* Review Card */}
                    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
                      <div className="flex items-center justify-center">
                        <img
                          src={review.user.avatar}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full ml-1 mr-1"
                        />
                      </div>
                      <div className="flex flex-col p-4">
                        <p className="text-gray-300 mb-1">
                          Username:{" "}
                          <span className="text-white font-bold">
                            {review.user.username}
                          </span>
                        </p>
                        <p className="text-gray-300 mb-1">
                          Surf-Zone:{" "}
                          <span className="text-white font-bold">
                            {review.surf_zone_details.name}
                          </span>
                        </p>
                        <p className="text-gray-300 mb-1">
                          Rating:{" "}
                          <span className="text-blue-500">
                            {'★'.repeat(review.rating)}
                          </span>
                          <span className="text-blue-500">
                            {'☆'.repeat(5 - review.rating)}
                          </span>
                        </p>
                        <p className="text-gray-300 break-words">
                          Comment:{" "}
                          <span className="text-white block mt-2">
                            {review.comment}
                          </span>
                        </p>
                        {/* Edit & Delete Buttons */}
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Edit Form (only if this review is being edited) */}
                    {editingReview && editingReview.id === review.id && (
                      <div className="group bg-white rounded-lg p-6 mt-6 items-center justify-center min-w-[400px] md:min-w-[500px] lg:min-w-[600px] w-full transform transition-transform duration-500 hover:scale-110">
                        <h3 className="text-lg font-bold text-black mb-4">
                          Edit Your Review
                        </h3>
                        <form onSubmit={handleUpdateReviewSubmit}>
                          <div>
                            <select
                              name="rating"
                              value={updatedReview.rating}
                              onChange={handleInputChange}
                              className="justify-center p-2 border rounded text-white bg-blue-500 text-center mb-2"
                              required
                            >
                              <option value="">Select Rating</option>
                              <option value="1">★</option>
                              <option value="2">★★</option>
                              <option value="3">★★★</option>
                              <option value="4">★★★★</option>
                              <option value="5">★★★★★</option>
                            </select>
                          </div>
                          <div className="mt-4">
                            <label className="block text-md font-medium text-gray-700">
                              Comment
                            </label>
                            <textarea
                              name="comment"
                              value={updatedReview.comment}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded text-black"
                              required
                            />
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button
                              type="submit"
                              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
                            >
                              Update Review
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingReview(null)}
                              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </>
          )}

          {/* ==== Surf-Spot Reviews ==== */}
          {reviews.some((rv) => rv.surf_spot_details) && (
            <>
              <h2 className="text-4xl font-bold text-left text-white p-2 mt-4 w-full">
                Your <span className="text-pink-400">Surf Spot</span> Reviews
              </h2>
              {reviews
                .filter((rv) => rv.surf_spot_details)
                .map((review) => (
                  <React.Fragment key={review.id}>
                    {/* Review Card */}
                    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
                      <div className="flex items-center justify-center">
                        <img
                          src={review.user.avatar}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full ml-1 mr-1"
                        />
                      </div>
                      <div className="flex flex-col p-4">
                        <p className="text-gray-300 mb-1">
                          Username:{" "}
                          <span className="text-white font-bold">
                            {review.user.username}
                          </span>
                        </p>
                        <p className="text-gray-300 mb-1">
                          Surf-Spot:{" "}
                          <span className="text-white font-bold">
                            {review.surf_spot_details.name}
                          </span>
                        </p>
                        <p className="text-gray-300 mb-1">
                          Rating:{" "}
                          <span className="text-blue-500">
                            {'★'.repeat(review.rating)}
                          </span>
                          <span className="text-blue-500">
                            {'☆'.repeat(5 - review.rating)}
                          </span>
                        </p>
                        <p className="text-gray-300 break-words">
                          Comment:{" "}
                          <span className="text-white block mt-2">
                            {review.comment}
                          </span>
                        </p>
                        {/* Edit & Delete Buttons */}
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Edit Form (if this review is active in edit mode) */}
                    {editingReview && editingReview.id === review.id && (
                      <div className="group bg-white rounded-lg p-6 mt-6 items-center justify-center min-w-[400px] md:min-w-[500px] lg:min-w-[600px] w-full transform transition-transform duration-500 hover:scale-110">
                        <h3 className="text-lg font-bold text-black mb-4">
                          Edit Your Review
                        </h3>
                        <form onSubmit={handleUpdateReviewSubmit}>
                          <div>
                            <select
                              name="rating"
                              value={updatedReview.rating}
                              onChange={handleInputChange}
                              className="justify-center p-2 border rounded text-white bg-blue-500 text-center mb-2"
                              required
                            >
                              <option value="">Select Rating</option>
                              <option value="1">★</option>
                              <option value="2">★★</option>
                              <option value="3">★★★</option>
                              <option value="4">★★★★</option>
                              <option value="5">★★★★★</option>
                            </select>
                          </div>
                          <div className="mt-4">
                            <label className="block text-md font-medium text-gray-700">
                              Comment
                            </label>
                            <textarea
                              name="comment"
                              value={updatedReview.comment}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded text-black"
                              required
                            />
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button
                              type="submit"
                              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
                            >
                              Update Review
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingReview(null)}
                              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </>
          )}
        </>
      ) : (
        <p className="text-gray-400">You have no reviews yet.</p>
      )}
    </div>
  );
}
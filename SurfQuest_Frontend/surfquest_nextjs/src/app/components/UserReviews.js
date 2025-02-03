"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const reviewsApiUrl = "http://localhost:8000/api/user-reviews/";
const token = Cookies.get("access_token");

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({ rating: "", comment: "" });

  // Fetch userId safely inside useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  // Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(reviewsApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch reviews");
          return;
        }

        const data = await response.json();
        console.log("User Reviews:", data);
        setReviews(data);
      } catch (err) {
        setError(`Request failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  // Handle update button click
  const handleEditClick = (review) => {
    setEditingReview(review);
    setUpdatedReview({ rating: review.rating, comment: review.comment });
  };

  // Handle input change for update form
  const handleInputChange = (e) => {
    setUpdatedReview({ ...updatedReview, [e.target.name]: e.target.value });
  };

  // Submit updated review
  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${reviewsApiUrl}${editingReview.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingReview.id,
          surf_zone: editingReview.surf_zone_details.id,
          surf_spot: editingReview.surf_spot,
          rating: updatedReview.rating,
          comment: updatedReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const updatedReviewData = await response.json();
      setReviews(reviews.map((review) => (review.id === updatedReviewData.id ? updatedReviewData : review)));
      setEditingReview(null); // Close the edit form

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    try {
      const response = await fetch(`${reviewsApiUrl}${reviewId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      <h2 className="text-4xl font-bold text-left text-white p-2 w-full">Your Reviews</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-400">Loading...</p>}

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] overflow-hidden">
            <div className="flex items-center justify-center">
              <img src={review.user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full ml-1 mr-1" />
            </div>
            <div className="flex flex-col p-4">
              <p className="text-gray-300 mb-1">Username: <span className="text-white font-bold">{review.user.username}</span></p>
              <p className="text-gray-300 mb-1">Surf-zone: <span className="text-white font-bold">{review.surf_zone_details.name}</span></p>
              <p className="text-gray-300 mb-1">Rating: <span className="text-white">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
              <p className="text-gray-300 break-words">Comment: <span className="text-white block mt-2">{review.comment}</span></p>

              {/* Update and Delete Buttons */}
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
        ))
      ) : (
        <p className="text-gray-400">No reviews yet.</p>
      )}

      {/* Update Review Form */}
      {editingReview && (
        <div className="bg-white rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-black mb-4">Edit Your Review</h3>

          <form onSubmit={handleUpdateReviewSubmit}>
            <div>
              <label className="block text-md font-medium text-gray-700">Rating</label>
              <select
                name="rating"
                value={updatedReview.rating}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
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
              <label className="block text-md font-medium text-gray-700">Comment</label>
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
              >
                Update Review
              </button>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
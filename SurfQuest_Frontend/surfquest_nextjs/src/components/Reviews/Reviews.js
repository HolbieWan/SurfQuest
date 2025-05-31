"use client";

/**
 * Reviews Component
 * -----------------
 * Fetches and displays reviews for a given surf zone or surf spot.
 * Allows the logged-in user to submit a new review if they haven't already.
 * Delegates API calls to reviewService and filtering logic to reviewUtils.
 *
 * @param {Object} props
 * @param {string} [props.selectedSurfZone] - Name of the selected surf zone.
 * @param {string} [props.selectedSurfSpot] - Name of the selected surf spot.
 * @param {string} [props.surfZoneId] - UUID of the selected surf zone.
 * @param {string} [props.surfSpotId] - UUID of the selected surf spot.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// ============================
// Local Dependencies
// ============================
import ReviewCard from '@/components/Reviews/ReviewCard';
import ReviewForm from '@/components/Reviews/ReviewForm';
import { fetchAllReviews, postNewReview } from '@/services/reviewService';
import { filterReviewsByContext, findUserReview } from '@/utils/reviewUtils';

export default function Reviews({ selectedSurfZone, selectedSurfSpot, surfZoneId, surfSpotId }) {
  // ============================
  // State Management
  // ============================
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
  // Fetch and filter reviews when context or userId changes
  // ============================
  useEffect(() => {
    // Only fetch if either a surf zone or surf spot is selected, and userId is known
    if ((!selectedSurfZone && !selectedSurfSpot) || userId === null) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('access_token');
        const allReviews = await fetchAllReviews(token);

        // Filter by selected surf zone or surf spot
        const filtered = filterReviewsByContext(allReviews, selectedSurfZone, selectedSurfSpot);
        setReviews(filtered);

        // Find this user’s review (if any)
        const existingReview = findUserReview(filtered, userId);
        setUserReview(existingReview);
      } catch (err) {
        setError(`Request failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedSurfZone, selectedSurfSpot, userId]);

  // ============================
  // Handle form field changes
  // ============================
  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  // ============================
  // Submit a new review
  // ============================
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('access_token');
      const created = await postNewReview(token, {
        surfZoneId: surfZoneId || '',
        surfSpotId: surfSpotId || '',
        rating: newReview.rating,
        comment: newReview.comment,
      });

      // Append the new review and mark that user as having reviewed
      setReviews((prev) => [...prev, created]);
      setUserReview(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Determine whether the user has already posted
  // ============================
  const userAlreadyReviewed = userReview !== null;

  // ============================
  // Render
  // ============================
  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      {(selectedSurfZone || selectedSurfSpot) && (
        <>
          <h2 className="text-4xl font-bold text-center text-white p-2 w-full"
            ><span className="text-pink-400">{selectedSurfZone}</span> Reviews
          </h2>

          {error && <p className="text-red-500">{error}</p>}
          {loading && <p className="text-blue-400">Loading...</p>}

          {/* Display All Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}

          {/* Only show the form if the user hasn’t posted yet */}
          {!userAlreadyReviewed && (
            <ReviewForm
              newReview={newReview}
              handleInputChange={handleInputChange}
              handleReviewSubmit={handleReviewSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

const reviewsApiUrl = 'http://localhost:8000/api/reviews/';
const token = Cookies.get('access_token');

export default function Reviews({ selectedSurfZone, surfZoneId }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [userId, setUserId] = useState(null);
  const searchParams = useSearchParams();

  // Fetch userId safely inside useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedSurfZone) return;

      setLoading(true);
      setError('');
      try {
        const response = await fetch(reviewsApiUrl, {
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
          setError(errorData.detail || 'Failed to fetch reviews');
          return;
        }

        const data = await response.json();
        console.log('Reviews:', data);

        // Filter reviews for selected Surf Zone
        const filteredReviews = data.filter(review => review.surf_zone_details && review.surf_zone_details.name === selectedSurfZone);
        setReviews(filteredReviews);

        // get the logged-in user's review 
        if (userId) {
          const userReview = filteredReviews.find(review => review.user_id === userId);
          setUserReview(userReview || null);
        }

      } catch (err) {
        setError(`Request failed: ${err.message}`);

      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedSurfZone, userId]);

  // Handle input changes for new review
  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("Received SurfZoneId in Reviews:", surfZoneId);
  }, [surfZoneId]);

  // Submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(reviewsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          surf_zone: `${surfZoneId}`,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post review');
      }

      const newReviewData = await response.json();
      setReviews([...reviews, newReviewData]);
      setNewReview({ rating: '', comment: '' });

    } catch (err) {
      setError(err.message)

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      {selectedSurfZone && (
        <>
          <h2 className="text-4xl font-bold text-left mb-6 text-white p-2 w-full">Reviews for {selectedSurfZone}</h2>

          {error && <p className="text-red-500">{error}</p>}
          {loading && <p className="text-blue-400">Loading...</p>}

          {/* Display All Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                <p className="text-Black font-bold">User: {review.user.username}</p>
                <p className="text-gray-400">Rating: {review.rating} ★</p>
                <p className="text-gray-300">Comment: {review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}

          {/* User Review Form */}
          <div className="bg-white rounded-lg p-6 mt-6 items-center justify-center">
            <h3 className="text-lg font-bold text-black mb-4">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            <form onSubmit={handleReviewSubmit}>
              <div>
                {/* <label className="block text-sm font-medium text-white">Rating</label> */}
                <select
                  name="rating"
                  value={newReview.rating}
                  onChange={handleInputChange}
                  className="justify-center p-2 border rounded text-white bg-blue-500 text-center mb-2"
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 ★</option>
                  <option value="2">2 ★</option>
                  <option value="3">3 ★</option>
                  <option value="4">4 ★</option>
                  <option value="5">5 ★</option>
                </select>
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700">Comment</label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
              >
                Submit Review
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

const reviewsApiUrl = 'http://localhost:8000/api/reviews/';
const token = Cookies.get('access_token');

export default function Reviews({ selectedSurfZone, surfZoneId, surfSpotId }) {
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
          const userReview = filteredReviews.find(review => review.user.id === userId);
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

  useEffect(() => {
    console.log("Received SurfSpotId in Reviews:", surfSpotId);
  }, [surfSpotId]);

  if (!surfSpotId) {
    surfSpotId = "";
  }

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
          surf_zone: `${surfZoneId}` ,
          surf_spot: `${surfSpotId}` ,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post review');
      }

      const newReviewData = await response.json();
      setReviews([...reviews, newReviewData]);
      setUserReview(newReviewData);

    } catch (err) {
      setError(err.message)

    } finally {
      setLoading(false);
    }
  };

  const userAlreadyReviewed = userReview !== null;

  return (
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center min-w-[600px]">
      {selectedSurfZone && (
        <>
          <h2 className="text-4xl font-bold text-center text-white p-2 w-full">Reviews</h2>

          {error && <p className="text-red-500">{error}</p>}
          {loading && <p className="text-blue-400">Loading...</p>}

          {/* Display All Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] overflow-hidden">
                <div className="flex items-center justify-center">  
                  <img src={review.user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full ml-1 mr-1" />
                </div>
                <div className="flex items-left justify-center flex-col p-4">
                  <p className="text-gray-300 mb-1 break-words w-full">Username: <span className="text-white font-bold">{review.user.username} </span><span className="text-white text-sm">({new Date(review.created_at).toLocaleDateString()})</span></p>
                  <p className="text-gray-300 mb-1 break-words w-full">Rating: <span className="text-white">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
                  <p className="text-gray-300 break-words w-full">Comment: <span className="text-white block mt-2">{review.comment}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}

          {/* User Review Form */}
          {!userAlreadyReviewed && (
            <>
              <div className="group bg-white rounded-lg p-6 mt-6 items-center justify-center min-w-[600px] w-full transform transition-transform duration-500 hover:scale-110">
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
                      className="justify-center p-2 border rounded text-blue bg-blue-400 text-center mb-2"
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
                    className="w-full mt-4 bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 rounded-md"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
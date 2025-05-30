"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// import { useSearchParams } from 'next/navigation';
import ReviewCard from '@/components/Reviews/ReviewCard';
import ReviewForm from '@/components/Reviews/ReviewForm';

const reviewsApiUrl = process.env.NEXT_PUBLIC_REVIEWS_API_URL;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
const token = Cookies.get('access_token');

console.log("Reviews API URL:", reviewsApiUrl);
console.log("Environment:", environment);
console.log("Access Token:", token);

export default function Reviews({ selectedSurfZone, selectedSurfSpot, surfZoneId, surfSpotId }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [userId, setUserId] = useState(null);
  // const searchParams = useSearchParams();

  // Fetch userId safely inside useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  // Fetch reviews from API
  useEffect(() => {
    if ((!selectedSurfZone && !selectedSurfSpot) || userId === null) return;
    console.log("Fetching reviews for Surf Zone:", selectedSurfZone, "and Surf Spot:", selectedSurfSpot, "for User ID:", userId);

    const fetchReviews = async () => {

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
        const filteredReviews = data.filter((review) =>
          (review.surf_zone_details && review.surf_zone_details.name === selectedSurfZone) ||
          (review.surf_spot_details && review.surf_spot_details.name === selectedSurfSpot)
        );
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
  }, [selectedSurfZone, selectedSurfSpot, userId]);

  // Handle input changes for new review
  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("Received SurfZoneId in Reviews:", surfZoneId);
  }, [surfZoneId]);

  if (!surfZoneId) {
    surfZoneId = "";
  }

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
    <div className="grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      {(selectedSurfZone || selectedSurfSpot) && (
        <>
          <h2 className="text-4xl font-bold text-center text-white p-2 w-full">Reviews</h2>

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

          {/* User Review Form */}
          {!userAlreadyReviewed && (
            <>
              <ReviewForm
                newReview={newReview}
                handleInputChange={handleInputChange}
                handleReviewSubmit={handleReviewSubmit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
'use client';

/**
 * ReviewCard Component
 * --------------------
 * Presents a single user review in a styled card format.
 * Renders the reviewer's avatar, username, date, rating, and comment.
 *
 * @param {Object} props
 * @param {Object} props.review - The review object.
 * @param {Object} props.review.user - The user who submitted the review.
 * @param {string} props.review.user.username - The username of the reviewer.
 * @param {string} props.review.user.avatar - URL to the reviewer's avatar image.
 * @param {string} props.review.created_at - ISO timestamp when the review was created.
 * @param {number} props.review.rating - Integer rating (1–5).
 * @param {string} props.review.comment - The text of the user's comment.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Main ReviewCard Component
// ============================
export default function ReviewCard({ review }) {
  // ============================
  // Derive displayable date string
  // ============================
  const formattedDate = new Date(review.created_at).toLocaleDateString();

  // ============================
  // Generate star rating string (★ for filled, ☆ for empty)
  // ============================
  const starsFilled = '★'.repeat(review.rating);
  const starsEmpty = '☆'.repeat(5 - review.rating);
  const starDisplay = `${starsFilled}${starsEmpty}`;

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] min-w-[400px] md:min-w-[500px] lg:min-w-[600px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
      {/* Reviewer Avatar */}
      <div className="flex items-center justify-center">
        <img
          src={review.user.avatar}
          alt={`${review.user.username}'s avatar`}
          className="w-12 h-12 rounded-full ml-1 mr-1"
        />
      </div>

      {/* Review Content */}
      <div className="flex items-start justify-center flex-col p-4">
        {/* Username and Date */}
        <p className="text-gray-300 mb-1 break-words w-full">
          Username:{' '}
          <span className="text-white font-bold">{review.user.username}</span>
          <span className="text-white text-sm"> ({formattedDate})</span>
        </p>

        {/* Star Rating */}
        <p className="text-gray-300 mb-1 break-words w-full">
          Rating:{' '}
          <span className="text-blue-500">{starsFilled}{starsEmpty}</span>
        </p>

        {/* Comment Text */}
        <p className="text-gray-300 break-words w-full">
          Comment:
          <span className="text-white block mt-2">{review.comment}</span>
        </p>
      </div>
    </div>
  );
}
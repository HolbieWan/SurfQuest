"use client";

/**
 * ReviewCard Component
 * --------------------
 * Presents a single user review in a styled card format.
 * Renders the reviewer's avatar, username, date, rating, and comment.
 *
 * @param {Object} props
 * @param {Object} props.review - The review object.
 */

import React from "react";

function formatDateSafe(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function ReviewCard({ review }) {
  const user = review?.user || {};
  const username = user?.username || "Unknown";
  const avatar = user?.avatar || "/default-avatar.png"; // ✅ mets un fichier public/ si tu veux
  const formattedDate = formatDateSafe(review?.created_at);

  const rating = Number(review?.rating || 0);
  const safeRating = Math.min(5, Math.max(0, rating));
  const starsFilled = "★".repeat(safeRating);
  const starsEmpty = "☆".repeat(5 - safeRating);

  return (
    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] min-w-[400px] md:min-w-[500px] lg:min-w-[600px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
      {/* Reviewer Avatar */}
      <div className="flex items-center justify-center">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-12 h-12 rounded-full ml-1 mr-1 object-cover"
          onError={(e) => {
            // fallback if avatar url is broken
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      </div>

      {/* Review Content */}
      <div className="flex items-start justify-center flex-col p-4">
        <p className="text-gray-300 mb-1 break-words w-full">
          Username: <span className="text-white font-bold">{username}</span>
          {formattedDate && (
            <span className="text-white text-sm"> ({formattedDate})</span>
          )}
        </p>

        <p className="text-gray-300 mb-1 break-words w-full">
          Rating:{" "}
          <span className="text-blue-500">
            {starsFilled}
            {starsEmpty}
          </span>
        </p>

        <p className="text-gray-300 break-words w-full">
          Comment:
          <span className="text-white block mt-2">{review?.comment || ""}</span>
        </p>
      </div>
    </div>
  );
}

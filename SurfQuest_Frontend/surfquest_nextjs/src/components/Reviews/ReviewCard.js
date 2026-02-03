"use client";

/**
 * ReviewCard Component
 * --------------------
 * Presents a single user review in a styled card format.
 * Renders the reviewer's avatar, username, date, rating, comment,
 * and optional actions (Edit/Delete) when provided.
 *
 * Props:
 * - review (object) required
 * - onEdit (function) optional
 * - onDelete (function) optional
 * - targetLabel (string) optional (ex: "Surf-Zone: Hossegor")
 */

import React from "react";

function formatDateSafe(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function ReviewCard({ review, onEdit, onDelete, targetLabel }) {
  const user = review?.user || {};
  const username = user?.username || "Unknown";
  const avatar = user?.avatar || "/default-avatar.png";
  const formattedDate = formatDateSafe(review?.created_at);

  const rating = Number(review?.rating || 0);
  const safeRating = Math.min(5, Math.max(0, rating));
  const starsFilled = "★".repeat(safeRating);
  const starsEmpty = "☆".repeat(5 - safeRating);

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] min-w-[400px] md:min-w-[500px] lg:min-w-[600px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
      {/* Reviewer Avatar */}
      <div className="flex items-center justify-center">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-12 h-12 rounded-full ml-1 mr-1 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      </div>

      {/* Review Content */}
      <div className="flex items-start justify-center flex-col p-4 w-full">
        <p className="text-gray-300 mb-1 break-words w-full">
          Username: <span className="text-white font-bold">{username}</span>
          {formattedDate && (
            <span className="text-white text-sm"> ({formattedDate})</span>
          )}
        </p>

        {/* Optional target label (useful in Profile) */}
        {targetLabel && (
          <p className="text-gray-300 mb-1 break-words w-full">
            <span className="text-white font-bold">{targetLabel}</span>
          </p>
        )}

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

        {/* ✅ Optional Actions (Profile page) */}
        {hasActions && (
          <div className="mt-4 flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1 rounded-md"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

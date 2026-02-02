/**
 * ReviewForm Component
 * --------------------
 * Renders a form allowing users to submit a new review with a star rating and comment.
 *
 * @param {Object} props
 * @param {Object} props.newReview - State object containing `rating` and `comment` for the form inputs.
 * @param {function} props.handleInputChange - Callback to handle changes to form inputs.
 * @param {function} props.handleReviewSubmit - Callback to handle form submission.
 * @param {boolean} [props.loading=false] - Whether a submit request is in progress.
 */
import React from "react";

// ============================
// Main ReviewForm Component
// ============================
export default function ReviewForm({
  newReview,
  handleInputChange,
  handleReviewSubmit,
  loading = false,
}) {
  return (
    <div className="group bg-white rounded-lg p-6 mt-6 items-center justify-center min-w-[400px] md:min-w-[500px] lg:min-w-[600px] w-full transform transition-transform duration-500 hover:scale-110">
      <h3 className="text-lg font-bold text-black mb-4">Write a Review</h3>

      <form onSubmit={handleReviewSubmit}>
        <div>
          <select
            name="rating"
            value={newReview.rating}
            onChange={handleInputChange}
            className="justify-center p-2 border rounded text-white bg-blue-500 text-center mb-2"
            required
            disabled={loading}
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
          <label className="block text-md font-medium text-gray-700">
            Comment
          </label>
          <textarea
            name="comment"
            value={newReview.comment}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-black"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

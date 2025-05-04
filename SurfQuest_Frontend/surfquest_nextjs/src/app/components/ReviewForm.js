import React from 'react';

export default function ReviewForm({ newReview, handleInputChange, handleReviewSubmit }) {
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
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
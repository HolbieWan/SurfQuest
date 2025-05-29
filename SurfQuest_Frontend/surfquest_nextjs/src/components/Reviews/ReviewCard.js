import React from 'react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-800 grid grid-cols-[80px,1fr] rounded-lg p-2 max-w-[800px] min-w-[400px] md:min-w-[500px] lg:min-w-[600px] group overflow-hidden transform transition-transform duration-500 hover:scale-110">
      <div className="flex items-center justify-center">
        <img src={review.user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full ml-1 mr-1" />
      </div>
      <div className="flex items-left justify-center flex-col p-4">
        <p className="text-gray-300 mb-1 break-words w-full">
          Username: <span className="text-white font-bold">{review.user.username}</span>
          <span className="text-white text-sm"> ({new Date(review.created_at).toLocaleDateString()})</span>
        </p>
        <p className="text-gray-300 mb-1 break-words w-full">
          Rating: <span className="text-white">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
        </p>
        <p className="text-gray-300 break-words w-full">
          Comment: <span className="text-white block mt-2">{review.comment}</span>
        </p>
      </div>
    </div>
  );
}
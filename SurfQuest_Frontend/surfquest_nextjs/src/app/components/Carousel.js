import React, { useState } from 'react';

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  const length = images.length;

  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current - 1 + length) % length);

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center w-full rounded-lg transform transition-transform duration-500 group-hover:scale-110">
      <button className="absolute left-4 bg-black bg-opacity-50 p-2 rounded-full text-white" onClick={prevSlide}>&#8592;</button>
      
      <img
        src={images[current].image}
        alt={`Slide ${current}`}
        className="w-full h-[400px] object-cover rounded-lg"
      />
      
      <button className="absolute right-4 bg-black bg-opacity-50 p-2 rounded-full text-white" onClick={nextSlide}>&#8594;</button>
    </div>
  );
}
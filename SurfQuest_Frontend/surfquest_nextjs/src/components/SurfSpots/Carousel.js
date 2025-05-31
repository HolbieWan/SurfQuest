// ============================
// External Dependencies
// ============================
import React, { useState } from 'react';

/**
 * ImageCarousel Component
 *
 * Renders an image carousel that allows users to navigate through a list of images.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects to display in the carousel
 * 
 * The component manages the current image index in state, provides next and previous
 * navigation handlers, and displays the current image with navigation buttons.
 */
// ============================
// ImageCarousel Component
// ============================
export default function ImageCarousel({ images }) {
  // State initialization for current image index
  const [current, setCurrent] = useState(0); // Tracks the index of the currently displayed image

  // Length of the images array
  const length = images.length; // Total number of images in the carousel

  // Handlers to navigate to next and previous slides
  const nextSlide = () => setCurrent((current + 1) % length); // Advances to next image, loops to start
  const prevSlide = () => setCurrent((current - 1 + length) % length); // Goes to previous image, loops to end

  // Early return if images prop is not a non-empty array
  if (!Array.isArray(images) || images.length <= 0) {
    return null; // Do not render carousel if no images are provided
  }

  // JSX structure: container div, previous/next buttons, and image element
  return (
    <div className="relative flex items-center justify-center w-full rounded-lg transform transition-transform duration-500 group-hover:scale-110">
      {/* Previous slide button */}
      <button className="absolute left-4 bg-black bg-opacity-50 p-2 rounded-full text-white" onClick={prevSlide}>&#8592;</button>
      
      {/* Current image */}
      <img
        src={images[current].image} // Source of the current image
        alt={`Slide ${current}`} // Alt text indicating current slide index
        className="w-full h-[400px] object-cover rounded-lg" // Styling for the image
      />
      
      {/* Next slide button */}
      <button className="absolute right-4 bg-black bg-opacity-50 p-2 rounded-full text-white" onClick={nextSlide}>&#8594;</button>
    </div>
  );
}
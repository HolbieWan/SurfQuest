'use client';
/**
 * ScrollToTop Component
 * ---------------------
 * Displays a "scroll to top" button when the user scrolls down
 * beyond a certain threshold. Clicking the button smoothly scrolls
 * the window back to the top.
 *
 * @returns {JSX.Element} A fixed-position button that appears after scrolling.
 */

// ============================
// External Dependencies
// ============================
import React, { useState, useEffect } from "react";

// ============================
// Main ScrollToTop Component
// ============================
export default function ScrollToTop() {
  // ============================
  // Visibility State
  // ============================
  const [isVisible, setIsVisible] = useState(false);

  // ============================
  // Show/hide logic based on scroll position
  // ============================
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================
  // Smooth scroll to top
  // ============================
  const scrollToTop = (e) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        className={`p-2 bg-emerald-500 text-white rounded-full shadow-md transition-opacity duration-300 ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
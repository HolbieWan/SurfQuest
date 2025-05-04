"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
    const scrollToTop = (event) => {
        event.stopPropagation();
        window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
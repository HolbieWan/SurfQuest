// src/app/components/SurfZones/PulsingHeaderLink.js

'use client';

// ============================
// External Dependencies
// ============================
import React from 'react';

/**
 * PulsingHeaderLink Component
 * ---------------------------
 * Renders a pulsing animated header link that invites users to find surf zones.
 * Consists of left and right arrow symbols flanking a call-to-action message.
 * Each element pulses with a custom keyframe animation and pauses on hover.
 *
 * @returns {JSX.Element} A centered, animated link to the surf zones page.
 */
export default function PulsingHeaderLink() {
  // Unicode arrow symbols for left and right
  const doubleRightArrow = "\u21D2";
  const doubleLeftArrow = "\u21D0";

  return (
    // Container div for centering and spacing
    <div className="mb-12 text-center">
      {/* Anchor wraps the animated content and links to the surf zones page */}
      <a
        href="/surfzones"
        className="text-4xl font-bold text-cyan-300 hover:text-cyan-400 inline-block group"
      >
        {/* Right-pointing arrow with pulsing animation */}
        <span
          className="customPulse inline-block transform transition-transform group-hover:-translate-x-2 duration-1000 mr-2 group-hover:animate-none"
        >
          {doubleRightArrow}
        </span>

        {/* Call-to-action message text, also pulsing */}
        <span
          className="customPulse mx-2 inline-block transform transition-transform group-hover:scale-105 duration-4000 mr-2 group-hover:animate-none"
        >
          Find the best surfing destinations for you
        </span>

        {/* Left-pointing arrow with pulsing animation */}
        <span
          className="customPulse inline-block transform transition-transform group-hover:translate-x-2 duration-1000 mr-2 group-hover:animate-none"
        >
          {doubleLeftArrow}
        </span>

        {/* Inline styled JSX for keyframe definitions */}
        <style jsx>{`
          @keyframes customPulse {
            0% { opacity: 0.5; }
            42.85% { opacity: 1; }
            57.14% { opacity: 1; }
            100% { opacity: 0.5; } 
          }
          .customPulse {
            animation: customPulse 3.5s infinite;
          }
          .customPulse:hover {
            animation-play-state: paused;
          }
        `}</style>
      </a>
    </div>
  );
}
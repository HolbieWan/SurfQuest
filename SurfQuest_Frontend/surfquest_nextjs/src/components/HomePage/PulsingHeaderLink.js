// src/app/components/SurfZones/PulsingHeaderLink.js

'use client';

import React from 'react';

export default function PulsingHeaderLink() {
  const doubleRightArrow = "\u21D2";
  const doubleLeftArrow = "\u21D0";

  return (
    <div className="mb-12 text-center">
      <a
        href="/surfzones"
        className="text-4xl font-bold text-cyan-300 hover:text-cyan-400 inline-block group"
      >
        <span
          className="customPulse inline-block transform transition-transform group-hover:-translate-x-2 duration-1000 mr-2 group-hover:animate-none"
        >
          {doubleRightArrow}
        </span>

        <span
          className="customPulse mx-2 inline-block transform transition-transform group-hover:scale-105 duration-4000 mr-2 group-hover:animate-none"
        >
          Find the best surfing destinations for you
        </span>

        <span
          className="customPulse inline-block transform transition-transform group-hover:translate-x-2 duration-1000 mr-2 group-hover:animate-none"
        >
          {doubleLeftArrow}
        </span>

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
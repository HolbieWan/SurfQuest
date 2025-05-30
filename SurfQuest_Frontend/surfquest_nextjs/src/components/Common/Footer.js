/**
 * Footer Component
 * ----------------
 * Renders the site footer with copyright information
 * and a link to the project's GitHub repository.
 *
 * @returns {JSX.Element} The footer section of the page.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

// ============================
// Main Footer Component
// ============================
export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-4 mt-10 border-t border-gray-800">
      <p>
        © 2025 SurfQuest. All Rights Reserved.{' '}
        <a
          href="https://github.com/HolbieWan/surfquest"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on GitHub
        </a>
      </p>
    </footer>
  );
}
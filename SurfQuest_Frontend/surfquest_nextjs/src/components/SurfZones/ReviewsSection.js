'use client';

/**
 * ReviewsSection Component
 * -------------------------
 * Wraps and centers the Reviews component for a given surf zone.
 * Provides consistent padding, grid layout, and styling.
 *
 * @param {Object} props
 * @param {string} props.zoneName - Name of the surf zone for which to display reviews.
 * @param {string} props.zoneId - Unique identifier of the surf zone for fetching reviews.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';
import Reviews from '@/components/Reviews/Reviews';

// ============================
// Component Definition
// ============================
export default function ReviewsSection({ zoneName, zoneId }) {
  return (
    <div className="group grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      {/* Reviews list */}
      <Reviews selectedSurfZone={zoneName} surfZoneId={zoneId} />
    </div>
  );
}

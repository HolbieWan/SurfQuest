'use client';
import React from 'react';
import Reviews from '@/components/Reviews/Reviews';

/**
 * Centers the reviews list for a surf zone.
 */
export default function ReviewsSection({ zoneName, zoneId }) {
  return (
    <div className="group grid grid-cols-1 p-4 gap-8 rounded-md items-center justify-center">
      <Reviews selectedSurfZone={zoneName} surfZoneId={zoneId} />
    </div>
  );
}
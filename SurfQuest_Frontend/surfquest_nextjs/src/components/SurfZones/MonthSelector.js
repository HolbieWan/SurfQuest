'use client'; // Enables React client-side features (e.g., useState, useEffect)

/**
 * MonthSelector Component
 * -----------------------
 * Renders a dropdown for selecting a month and provides a brief instructional text.
 * This component is typically used in conjunction with other filters that depend on the chosen month.
 *
 * @param {Object} props
 * @param {string} props.selectedMonth - Currently selected month value.
 * @param {Function} props.handleMonthChange - Callback to invoke when the month selection changes.
 * @param {string[]} props.months - Array of month names to populate the dropdown options.
 *
 * @returns {JSX.Element} A centered grid containing a styled <select> input and a descriptive label.
 */

// ============================
// External Dependencies
// ============================
import React from 'react';

export default function MonthSelector({
  selectedMonth,
  handleMonthChange,
  months,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-4">
      {/* Month Dropdown */}
      <select
        className="
          p-2
          border border-black
          rounded
          bg-pink-500 text-white
          text-center
          w-[200px]
          transform transition-transform duration-200
          hover:border-white hover:scale-105
        "
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <option value="">Month</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Instructional Text */}
      <p className="text-gray-500 text-sm">
        (Select a month to apply below filters)
      </p>
    </div>
  );
}

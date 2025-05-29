"use client";

import React from "react";

export default function MonthSelector({ selectedMonth, handleMonthChange, months }) {
  return (
    <div className="grid grid-cols-1 gap-3 place-items-center justify-center mt-4">
      <select
        className="p-2 border border-black rounded bg-pink-500 text-white text-center w-[200px] transform transition-transform duration-200 hover:border-white hover:scale-105"
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

      <p className="text-gray-500 text-sm">(Select a month to apply below filters)</p>
    </div>
  );
}
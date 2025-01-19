import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-black text-white px-8 py-4">
      <h1 className="text-xl font-bold">SurfQuest</h1>
      <div className="flex gap-4">
        <Link href="/spots" className="hover:underline">Surf Spots</Link>
        <Link href="/zones" className="hover:underline">Surf Zones</Link>
        <Link href="/search" className="hover:underline">Search</Link>
        <Link href="/login" className="hover:underline">Sign In</Link>
        <Link href="/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200">Sign Up</Link>
      </div>
    </nav>
  );
}
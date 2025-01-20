"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center bg-black text-white px-8 py-4">
      <h1 className="text-xl font-bold">SurfQuest</h1>
      <div className="flex gap-1">
        {["/spots", "/zones", "/search", "/login", "/signup"].map((path) => (
          <Link href={path} key={path}>
            <div
              className={`px-4 py-2 rounded-md ${
                pathname === path
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-white hover:text-black"
              }`}
              style={{ width: "115px", textAlign: "center" }}
            >
              {path === "/spots" && "Surf Spots"}
              {path === "/zones" && "Surf Zones"}
              {path === "/search" && "Search"}
              {path === "/login" && "Log in"}
              {path === "/signup" && "Sign Up"}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
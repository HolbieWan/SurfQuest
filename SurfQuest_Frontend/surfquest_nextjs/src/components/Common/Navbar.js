'use client';

/**
 * Navbar Component
 * ----------------
 * Renders the fixed top navigation bar and banner for SurfQuest.
 * - Displays the brand logo linking to the home page
 * - Provides navigation links to core sections:
 *     • Find Spots (/surfspots)
 *     • Find Places (/surfzones)
 *     • Profile (/profile)
 *     • Log In / Sign Up or Log Out based on authentication state
 * - Highlights the active link based on the current pathname
 * - Includes a full-width banner image below the navigation
 */

// ============================
// External Dependencies
// ============================
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Head from "next/head";

// ============================
// Main Navbar Component
// ============================
export default function Navbar() {
  // ============================
  // Router Pathname
  // ============================
  const pathname = usePathname();
  // console.log("Current pathname:", pathname);

  // ============================
  // Authentication State
  // ============================
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for access token in cookies to determine login status
    const accessToken = Cookies.get("access_token");
    setIsLoggedIn(!!accessToken);
  }, []);

  // ============================
  // Logout Handler
  // ============================
  const handleLogout = () => {
    // Clear authentication tokens and redirect to login
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <>
      {/* Preload Google Fonts */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Grechen+Fuemen&family=Montez&family=Ms+Madi&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center bg-black text-white px-4 py-1 md:px-8 md:py shadow-md border-b border-gray-800">
        {/* Brand Logo */}
        <Link href="/" className="text-sm md:text-md lg:text-lg xl:text-xl font-bold hover:text-gray-300">
          <span className="text-white">Surf</span>
          <span className="text-blue-500">Q</span>
          <span className="text-white">uest</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-1">
          {/* Find Spots */}
          <Link href="/surfspots">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname === "/surfspots"
                  ? "bg-white text-blue-500"
                  : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Find Spots
            </div>
          </Link>

          {/* Find Places */}
          <Link href="/surfzones">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname.startsWith("/surfzones")
                  ? "bg-white text-blue-500"
                  : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Find Places
            </div>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname === "/profile"
                  ? "bg-white text-blue-500"
                  : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Profile
            </div>
          </Link>

          {/* Authentication Links */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-1 py-0 md:px-2 md:py-1 rounded-md text-center bg-black text-white hover:bg-white hover:text-blue-500 w-14 sm:w-28"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link href="/login">
                <div
                  className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                    pathname === "/login"
                      ? "bg-white text-blue-500"
                      : "bg-black text-white hover:bg-white hover:text-blue-500"
                  } w-14 sm:w-28`}
                >
                  Log In
                </div>
              </Link>
              <Link href="/signup">
                <div
                  className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                    pathname === "/signup"
                      ? "bg-white text-blue-500"
                      : "bg-black text-white hover:bg-white hover:text-blue-500"
                  } w-14 sm:w-28`}
                >
                  Sign Up
                </div>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative w-full">
        <img
          src="/banner-34.jpg"
          alt="Banner"
          className="w-full object-cover"
          style={{ height: "35rem" }}
        />
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl grechen-fuemen-regular text-shadow-2xl">
            <span className="text-white">Surf</span>
            <span className="text-blue-500">Q</span>
            <span className="text-white">uest</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl permanent-marker-regular text-shadow-2xl">
            SURF TRIP PLANNER
          </p>
        </div> */}

        <div className="absolute inset-0 flex flex-col items-start px-20 justify-center text-white">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-7xl font-bold rubik-bold text-shadow-2xl">
            <span className="text-blue-500">Plan </span>
            <span className="text-white">& </span>
            <span className="text-blue-500">Book </span>
            <span className="text-white">your next</span>
            <br></br>
            <span className="text-blue-500"></span>
            <span className="text-white">SURF </span>
            <span className="text-blue-500"></span>
            <span className="text-white">TRIP</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-shadow-2xl pt-8">
            <span>- Find the </span>
            <span className="text-blue-400">perfect </span>
            <span>destination for </span>
            <span className="text-blue-400">YOU </span>
            <span>-</span>
          </p>
        </div>
      </div>
    </>
  );
}
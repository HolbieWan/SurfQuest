"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Head from "next/head";

export default function Navbar() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Grechen+Fuemen&family=Montez&family=Ms+Madi&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Fixed Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center bg-black text-white px-4 py-2 md:px-8 md:py-4 shadow-md">
        <Link href="/" className="text-sm md:text-md lg:text-lg xl:text-xl font-bold hover:text-gray-300">
          <span className="text-white">Surf</span>
          <span className="text-blue-500">Q</span>
          <span className="text-white">uest</span>
        </Link>

        <div className="flex gap-1">
          {/* Surf Spots */}
          <Link href="/surfspots">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname === "/surfspots" ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Surf Spots
            </div>
          </Link>

          {/* Surf Zones */}
          <Link href="/surfzones">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname.startsWith("/surfzones") ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Surf Zones
            </div>
          </Link>

          {/* Search */}
          {/* <Link href="/search_zones">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname === "/search" ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
              } w-14 sm:w-28`}
            >
              Search
            </div>
          </Link> */}

          {/* Profile */}
          <Link href="/profile">
            <div
              className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                pathname === "/profile" ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
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
                    pathname === "/login" ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
                  } w-14 sm:w-28`}
                >
                  Log In
                </div>
              </Link>

              <Link href="/signup">
                <div
                  className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                    pathname === "/signup" ? "bg-white text-blue-500" : "bg-black text-white hover:bg-white hover:text-blue-500"
                  } w-14 sm:w-28`}
                >
                  Sign Up
                </div>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Banner */}
      <div className="relative w-full">
        <img src="/banner.jpg" alt="Banner" className="w-full object-cover" style={{ height: "300px" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl grechen-fuemen-regular text-shadow-2xl">
            <span className="text-white">Surf</span>
            <span className="text-blue-500">Q</span>
            <span className="text-white">uest</span>
          </h1>
          {/* <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl permanent-marker-regular text-shadow-2xl">
            <span className="text-blue-500">Plan your </span>
            <span className="text-pink-500">dream </span>
            <span className="text-blue-500">surf-trip</span>
          </p> */}
        </div>
      </div>
    </>
  );
}
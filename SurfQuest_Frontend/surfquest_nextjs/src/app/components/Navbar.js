"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Head from "next/head";

export default function Navbar() {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Grechen+Fuemen&family=Montez&family=Ms+Madi&family=Permanent+Marker&display=swap" rel="stylesheet"/>
      </Head>
      <nav className="flex justify-between items-center bg-black text-white px-4 py-2 md:px-8 md::py-4">
        <Link href="/" className="text-sm md:text-md lg:text-lg xl:text-xl font-bold hover:text-gray-300">
          SurfQuest
        </Link>
        <div className="flex gap-1">
          {["/spots", "/zones", "/search"].map((path) => (
            <Link href={path} key={path}>
              <div
                className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                  pathname === path
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-white hover:text-black"
                } w-14 sm:w-28`}
              >
                {path === "/spots" && "Surf Spots"}
                {path === "/zones" && "Surf Zones"}
                {path === "/search" && "Search"}
              </div>
            </Link>
          ))}
           {isLoggedIn ? (
            <button onClick={handleLogout} className="px-1 py-0 md:px-2 md:py-1 rounded-md text-center bg-black text-white hover:bg-white hover:text-black w-14 sm:w-28">
              Log Out
            </button>
          ) : (
            <>
              <Link href="/login">
                <div className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${pathname === "/login" ? "bg-white text-black" : "bg-black text-white hover:bg-white hover:text-black"} w-14 sm:w-28`}>
                  Log In
                </div>
              </Link>
              <Link href="/signup">
                <div className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${pathname === "/signup" ? "bg-white text-black" : "bg-black text-white hover:bg-white hover:text-black"} w-14 sm:w-28`}>
                  Sign Up
                </div>
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="relative w-full">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="w-full object-cover"
          style={{ height: "300px" }} // Adjust the height as needed
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl grechen-fuemen-regular text-shadow-lg">SurfQuest</h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl permanent-marker-regular text-shadow-md">Plan your dream surftrip</p>
        </div>
      </div>
    </>
  );
}
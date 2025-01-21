"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Head from "next/head";

export default function Navbar() {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Grechen+Fuemen&family=Montez&family=Ms+Madi&family=Permanent+Marker&display=swap" rel="stylesheet"/>
      </Head>
      <nav className="flex justify-between items-center bg-black text-white px-4 py-2 md:px-8 md::py-4">
        <h1 className="text-sm md:text-md lg:text-lg xl:text-xl font-bold">SurfQuest</h1>
        <div className="flex gap-1">
          {["/spots", "/zones", "/search", "/login", "/signup"].map((path) => (
            <Link href={path} key={path}>
              <div
                className={`px-1 py-0 md:px-2 md:py-1 rounded-md text-center ${
                  pathname === path
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-white hover:text-black"
                } w-14 sm:w-28`}
                // style={{ width: "115px", textAlign: "center" }}
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
      <div className="relative w-full">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="w-full object-cover"
          style={{ height: "300px" }} // Adjust the height as needed
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl grechen-fuemen-regular">SurfQuest</h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl permanent-marker-regular">Plan your dream surftrip</p>
        </div>
      </div>
    </>
  );
}
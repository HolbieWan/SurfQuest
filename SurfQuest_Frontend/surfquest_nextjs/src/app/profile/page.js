'use client';

import UserReviews from "../components/UserReviews";
import react, { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Retrieves username from localStorage
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername);
        }
    })
  return (
    <>
      <div className="flex flex-col items-center justify-start pt-20 h-screen">
              <h1 className="text-4xl font-bold">Hello <span className="text-cyan-400">{username}</span></h1>
        <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
          <UserReviews />
        </div>
      </div>
    </>
  );
}
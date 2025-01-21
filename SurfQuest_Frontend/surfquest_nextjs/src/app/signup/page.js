'use client';

import { useState } from 'react';

const usersApiUrl = process.env.NEXT_PUBLIC_USERS_API_URL;
const tokensApiUrl = process.env.NEXT_PUBLIC_TOKENS_API_URL;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

console.log('Users API URL:', usersApiUrl);
console.log('Tokens API URL:', tokensApiUrl);
console.log('Environment:', environment);

export default function SignupPage() {
  console.log('SignupPage component rendered');
  // State to track email, password, and any errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading state

  // Function to handle form submission
  const atSubmission = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while the request is in progress
    setError(''); // Clear previous errors

    try {
      console.log('Sending data:', { username, password, email });
      const response = await fetch(`${usersApiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        setError(data.detail || JSON.stringify(data));
        return;
      }

      window.location.href = '/login';
    } catch (err) {
      console.error('Error details:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  }
  return (
    <div className="flex flex-col items-center justify-start pt-16 min-h-screen bg-black text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign up to SurfQuest</h2>
        <form className="space-y-4" onSubmit={atSubmission}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="username"
              id="username"
              name="username"
              value={username} // Bind state
              onChange={(e) => setUsername(e.target.value)} // Update state
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password} // Bind password
              onChange={(e) => setPassword(e.target.value)} // Update state
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email} // Bind password
              onChange={(e) => setEmail(e.target.value)} // Update state
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>
            {error && <div><p className="text-red-500 text-sm">{error}</p></div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
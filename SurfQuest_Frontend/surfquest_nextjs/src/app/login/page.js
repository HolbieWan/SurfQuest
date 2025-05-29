"use client";

/**
 * Login Page Component for SurfQuest
 *
 * Provides a form interface for users to log in using their username and password.
 * Delegates authentication logic to the authService.
 */

// ============================
// External Dependencies
// ============================
import { useState } from 'react';
import { loginUser } from '@/services/loginService';

// ============================
// Main Login Page Component
// ============================
export default function LoginPage() {
  // ============================
  // State Management
  // ============================
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================
  // Form Submission Handler
  // ============================
  const atSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(username, password);
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // JSX Output
  // ============================
  return (
    <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Log in to SurfQuest</h2>
        <form className="space-y-4" onSubmit={atSubmission}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
            />
          </div>

          {error && (
            <div>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
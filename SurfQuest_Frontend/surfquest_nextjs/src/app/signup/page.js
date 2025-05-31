// src/app/signup/page.js

'use client';

// ============================
// Imports
// ============================
import { useState } from 'react';
import { registerUser, loginAfterSignup } from '@/services/signupService';

/**
 * SignupPage Component – Handles user registration flow.
 *
 * This page provides a form for new users to create an account by submitting
 * their username, email, password, and an optional avatar image.
 * On successful signup, the user is automatically logged in and redirected.
 */
export default function SignupPage() {
  // ============================
  // State Management
  // ============================
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission.
   * - Registers the user by calling the signup service.
   * - Logs the user in and stores JWT tokens in cookies.
   * - Redirects to the homepage.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser({ username, password, email, avatar });
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || JSON.stringify(data));
        return;
      }

      await loginAfterSignup(username, password);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', data.username);

      // Redirect to homepage after successful signup and login
      window.location.href = '/';
    } catch (err) {
      console.error('Signup error:', err);
      setError(`Error: ${err.message}`);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign up to SurfQuest</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Input */}
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
              autoComplete="username"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">
              Avatar
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="avatar"
                className="px-4 py-2 mt-1 mr-2 text-sm bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-300">
                {avatar ? avatar.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Password Input */}
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
              autoComplete="new-password"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-black rounded-md"
              required
              autoComplete="email"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
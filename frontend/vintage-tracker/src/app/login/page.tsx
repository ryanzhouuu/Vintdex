"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt with:", email);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl w-full">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Login to Vintdex
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Access your vintage collection and preferences
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-full border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-full border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white gap-2 text-sm sm:text-base h-12 px-8"
          >
            Sign In
          </button>
        </form>

        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a
            href="/forgot-password"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Forgot your password?
          </a>
          <a
            href="/signup"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Don't have an account? Sign up
          </a>
          <a
            href="/search"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Continue as guest
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/privacy"
        >
          Privacy Policy
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/terms"
        >
          Terms of Service
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/contact"
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
}

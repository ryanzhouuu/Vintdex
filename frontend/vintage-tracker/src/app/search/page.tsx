"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl w-full">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Search Vintdex
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Find vintage items in our database
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for vintage items..."
              className="w-full px-4 py-3 rounded-full border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="w-full mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Enter a search term to begin
          </p>
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

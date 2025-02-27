"use client";

import { useState } from "react";

export default function Profile() {
  const [user] = useState({
    email: "user@example.com",
    name: "John Doe",
    joinDate: "January 2024",
    savedSearches: 12,
    itemsTracked: 47
  });

  const [trackedSearches] = useState([
    {
      id: 1,
      query: "vintage levis 501",
      date: "2024-01-15",
      results: 24,
      lastPrice: "$250"
    },
    {
      id: 2, 
      query: "70s band tees",
      date: "2024-01-14",
      results: 16,
      lastPrice: "$175"
    },
    {
      id: 3,
      query: "nike windbreaker 90s",
      date: "2024-01-13", 
      results: 8,
      lastPrice: "$120"
    }
  ]);

  const [savedSearches] = useState([
    {
      id: 1,
      query: "1950s denim jacket",
      date: "2024-01-10",
      maxPrice: "$300"
    },
    {
      id: 2,
      query: "vintage champion sweater",
      date: "2024-01-08",
      maxPrice: "$200"
    }
  ]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-6xl">
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          
          <div className="w-full max-w-4xl mt-8 grid grid-cols-1 gap-8">
            <div className="p-6 rounded-xl border border-purple-200 dark:border-purple-800 dark:bg-gray-900">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Member Since</label>
                  <p className="text-lg text-gray-900 dark:text-white">{user.joinDate}</p>
                </div>
                <div className="flex gap-8 mt-6">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Saved Searches</label>
                    <p className="text-2xl font-bold text-purple-600">{user.savedSearches}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Items Tracked</label>
                    <p className="text-2xl font-bold text-purple-600">{user.itemsTracked}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-purple-200 dark:border-purple-800 dark:bg-gray-900">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Tracked Searches</h2>
              <div className="space-y-4">
                {trackedSearches.map((search) => (
                  <div 
                    key={search.id}
                    className="p-4 rounded-lg border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{search.query}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{search.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                          {search.results} results
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last sold: {search.lastPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-purple-200 dark:border-purple-800 dark:bg-gray-900">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Saved Searches</h2>
              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <div 
                    key={search.id}
                    className="p-4 rounded-lg border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{search.query}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{search.date}</p>
                      </div>
                      <span className="px-2 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                        Max: {search.maxPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

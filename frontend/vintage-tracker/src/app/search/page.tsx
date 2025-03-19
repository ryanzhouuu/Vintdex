"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchTrackedItems } from "../../services/searchService";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
      if (searchQuery.trim()) {
      setLoading(true);

      try {
        const results = await searchTrackedItems(searchQuery.trim());
        setResults(results || []);
        //router.push(`/search/results?q=${encodeURIComponent(searchQuery.trim())}`);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
  }

  const handleItemClick = (id: string) => {
    router.push(`/item/${id}`);
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

        <form onSubmit={handleSearch} className="w-full max-w-lg">
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
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        <div className="w-full mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Enter a search term to begin
          </p>
        </div>

        <div className="w-full mt-8">
          {results.length > 0 ? (
            <ul className="grid gap-4">
              {results.map((item) => (
                <li 
                key={item.title} 
                className="border border-purple-300 dark:border-purple-800 rounded-lg p-4 hover:bg-purple-50 dark:hover:bg-purple-800/50 transition"
                onClick={() => handleItemClick(item.id)}
                aria-label={`Go to ${item.title}`}
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.title}
                  </p>
                  {item.image_path && (
                    <img 
                      src={item.image_path} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mt-2"
                    />
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    Projected Price: ${item.projected_price}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? 'Searching...' : 'No items found.'}
            </p>
          )}
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

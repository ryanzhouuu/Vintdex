"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchTrackedItemsParams, SearchTrackedItemsResponse } from "@vintdex/types";
import { searchTrackedItems } from "../../services/searchService";

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState<SearchTrackedItemsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [sortBy, setSortBy] = useState<"price" | "date">("date");
  const [filterType, setFilterType] = useState<"all" | "shirt" | "jeans" | "jacket">("all");

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const params: SearchTrackedItemsParams = { query };
          const response = await searchTrackedItems(params);
          setResults(response);
        } catch (error) {
          console.error("Failed to fetch search results", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query]);

  const items = results?.items || [];

  const filteredAndSortedItems = [...mockItems]
    .filter(item => filterType === "all" || item.type === filterType)
    .sort((a, b) => {
      if (sortBy === "price") {
        return b.price - a.price;
      }
      return new Date(b.dateSold).getTime() - new Date(a.dateSold).getTime();
    });

  if (loading) return <p>Loading...</p>;

  if (!results || !results.items.length) {
    return <div>No Results Found</div>
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-6xl">
        <div className="w-full flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Vintage Clothing Results
          </h1>
          <div className="flex gap-4">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "shirt" | "jeans" | "jacket")}
              className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="shirt">Shirts</option>
              <option value="jeans">Jeans</option>
              <option value="jacket">Jackets</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price" | "date")}
              className="px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => router.push(`/item/${item.id}`)}
              className="flex flex-col gap-4 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow dark:bg-gray-900 cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={item.image_path ? item.image_path : "/placeholder.jpg"} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                <p className="text-2xl font-bold text-purple-600">${item.price_data || []}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sold on {new Date(item.created_at).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                    {item.category}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                    {item.decade}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-semibold">Brand:</span> {item.brand}</p>
                  <p><span className="font-semibold">Material:</span> {item.material}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Seller: {item.seller}</p>
              </div>
            </div>
          ))}
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

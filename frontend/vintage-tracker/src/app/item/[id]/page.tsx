"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/api/config";
import { supabase } from "@/utils/supabaseClient";
import { TrackedItem } from '@vintdex/types';

// async function to get props from dynamically routed component
// takes in the id that is given and fetches the corresponding item element from the database
export async function getServerSideProps({ params }: { params: { id: string } }) {
  const { data: user, error } = await supabase
    .from('tracked_items')
    .select('*')
    .eq('id', params.id)
    .single();

    if (error) {
      console.error(error);
      return { notFound: true };
    }

    return {
      props: { user },
    };
}

// item page component
// displays information about a tracked item
// including title, projected price, category, brand, etc
export default function ItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<TrackedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.items}/${params.id}`
        );
        if (!response.ok) throw new Error("Item not found");
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Item not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src={item.images[selectedImage]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {item.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-purple-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${item.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {item.name}
            </h1>
            <p className="text-2xl font-semibold text-purple-600">
              ${item.currentPrice}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Brand
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.brand}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">Era</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.era}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Condition
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.condition}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seller Rating
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.seller.rating}/5 ({item.seller.itemsSold} sold)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              {/* Price history chart would go here - could use a library like Chart.js */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Price history visualization coming soon
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full transition-colors">
              Track Item
            </button>
            <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3 px-6 rounded-full transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

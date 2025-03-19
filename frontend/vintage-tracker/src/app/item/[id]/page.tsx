"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "@/api/config";
import { supabase } from "@/utils/supabaseClient";
import { TrackedItem } from '@vintdex/types';

interface ItemData {
  id: number;
  title: string;
  projected_price: number;
  image_path: string;
}

// async function to get props from dynamically routed component
// takes in the id that is given and fetches the corresponding item element from the database
// export async function getServerSideProps({ params }: { params: { id: string } }) {
//   const { data: user, error } = await supabase
//     .from('tracked_items')
//     .select('*')
//     .eq('id', params.id)
//     .single();

//     if (error) {
//       console.error(error);
//       return { notFound: true };
//     }

//     return {
//       props: { user },
//     };
// }

// item page component
// displays information about a tracked item
// including title, projected price, category, brand, etc
export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<TrackedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
        .from("tracked_items")
        .select("*")
        .eq("id", id)
        .single();

        if (error) throw error;
        setItem(data);
      } catch (err: any) {
        setError(err.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

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
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src={item.image_path}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h1>
            <p className="text-2xl font-semibold text-purple-600">
              ${item.projected_price}
            </p>
          </div>

          {/* Actions */}
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
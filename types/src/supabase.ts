export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
    public: {
        Tables: {
            tracked_items: {
                Row: {
                    id: string;
                    title: string;
                    decade: string;
                    projected_price: number;
                    created_at: string;
                    updated_at: string;
                    category: string | null;
                    brand: string | null;
                    image_path: string | null;
                }
                Insert: {
                    id?: string;
                    title: string;
                    decade: string;
                    created_at?: string;
                    updated_at?: string;
                    category?: string | null;
                    brand?: string | null;
                    image_path?: string | null;
                }
                Update: {
                    id?: string;
                    title?: string;
                    decade?: string;
                    created_at?: string;
                    updated_at?: string;
                    category?: string | null;
                    brand?: string | null;
                    image_path?: string | null;
                }
            },
            sold_listings: {
                Row: {
                    id: string;
                    price: number;
                    currency: string;
                    sold_date: string;
                    size: string,
                    platform: "ebay" | "depop" | "grailed";
                    listing_url: string;
                    listing_id: string;
                    condition: string;
                    created_at: string;
                },
                Insert: {
                    id?: string;
                    price: number;
                    currency: string;
                    sold_date: string;
                    size: string,
                    platform: "ebay" | "depop" | "grailed";
                    listing_url: string;
                    listing_id: string;
                    condition: string;
                    created_at: string;
                },
                Update: {
                    id?: string;
                    price?: number;
                    currency?: string;
                    sold_date?: string;
                    size?: string,
                    platform?: "ebay" | "depop" | "grailed";
                    listing_url?: string;
                    listing_id?: string;
                    condition?: string;
                    created_at: string;
                }
            }
            tracked_items_sold_listings: {
                Row: {
                    tracked_item_id: string;
                    sold_listing_id: string;
                    created_at: string;
                }
                Insert: {
                    tracked_item_id: string;
                    sold_listing_id: string;
                    created_at?: string;
                }
                Update: {
                    tracked_item_id?: string;
                    sold_listing_id?: string;
                    created_at?: string;
                }
            }
        }
    },
    storage: {
        Buckets: {
            [_ in "tracked_item_images"]: {
                Row: {
                    id: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                },
                Insert: {
                    id: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                },
                Updated: {
                    id?: string;
                    name?: string;
                    created_at?: string;
                    updated_at?: string;
                }
            }
        }
    }
    Views: {
        [_ in never]: never;
    },
    Functions: {
        [_ in never]: never;
    },
    Enums: {
        [_ in never]: never;
    }
}

// Table Exports
export type TrackedItem = Database['public']['Tables']['tracked_items']['Row'];
export type SoldListing = Database['public']['Tables']['sold_listings']['Row'];
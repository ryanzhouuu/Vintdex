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
                    price_data: Json;
                    projceted_price: number;
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
                    price_data?: Json;
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
                    price_data?: Json;
                    created_at?: string;
                    updated_at?: string;
                    category?: string | null;
                    brand?: string | null;
                    image_path?: string | null;
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

// Price Data JSON Type defs
export interface PriceDataEntry {
    price: number;
    currency: string;
    sold_date: string;
    condition?: string;
    size: string,
    listing_url: string;
    listing_id: string;
}

// Table Exports
export type TrackedItem = Database['public']['Tables']['tracked_items']['Row'];
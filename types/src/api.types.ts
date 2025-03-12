import { SoldListing, TrackedItem } from "./supabase.types";

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
    error?: string;
}
  
export interface AppErrorType {
    message: string;
    statusCode: number;
}

export interface TrackingRequestData {
    imageData: string;
    title: string;
    category: string;
    decade: string;
    brand: string;
}

export interface TrackingResponse {
    success: boolean,
    data: TrackedItem
}

export interface SearchTrackedItemsParams {
    query: string;
    category?: string;
    decade?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'created_at_desc';
}

export interface TrackedItemData extends TrackedItem {
    image_url: string,
    sold_listings: SoldListing[]
}

export interface SearchTrackedItemsResponse {
    items: TrackedItemData[];
    total: number;
    offset: number;
    limit: number;
}
import { TrackedItem } from "./supabase";

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

export interface SearchTrackedItemsResponse {
    items: TrackedItem[];
    total: number;
    offset: number;
    limit: number;
}
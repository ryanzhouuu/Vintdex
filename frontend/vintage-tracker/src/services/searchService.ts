import { SearchTrackedItemsParams, SearchTrackedItemsResponse } from '@vintdex/types';

export const searchTrackedItems = async (params: SearchTrackedItemsParams): Promise<SearchTrackedItemsResponse> => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`/api/search?q=${queryString}`);

    if (!response.ok) {
        throw new Error("Failed to search for tracked items");
    }

    return response.json();
}
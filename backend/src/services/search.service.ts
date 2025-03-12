import { SearchTrackedItemsParams, SearchTrackedItemsResponse, TrackedItem, TrackedItemData } from "@vintdex/types";
import { SupabaseService } from "../db/supabase";

export class SearchService {
    private supabase: SupabaseService;

    constructor() {
        this.supabase = new SupabaseService();
    }

    async searchTrackedItems(params: SearchTrackedItemsParams): Promise<SearchTrackedItemsResponse> {
        try {
            const { data: items, count } = await this.supabase.searchTrackedItems(params);

            const processedItems = await Promise.all((items || []).map(async (item) => {
                const imageUrl = item.image_path 
                    ? await this.supabase.getPublicImageUrl(item.image_path)
                    : null;

                return {
                    id: item.id,
                    title: item.title,
                    brand: item.brand,
                    category: item.category,
                    decade: item.decade,
                    projected_price: item.projected_price,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    image_url: imageUrl,
                    sold_listings: item.sold_listings
                } as TrackedItemData;
            }));

            return {
                items: processedItems,
                total: count || 0,
                offset: params.offset || 0,
                limit: params.limit || 20
            };
        } catch(error) {
            console.error('Error searching for tracked items', error);
            throw error;
        }
    }
}
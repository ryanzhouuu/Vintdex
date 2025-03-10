import { SearchTrackedItemsParams, SearchTrackedItemsResponse, TrackedItem } from "@vintdex/types";
import { SupabaseService } from "../db/supabase";

export class SearchService {
    private supabase: SupabaseService;

    constructor() {
        this.supabase = new SupabaseService();
    }

    async searchTrackedItems(params: SearchTrackedItemsParams): Promise<SearchTrackedItemsResponse> {
        try {
            let query = this.supabase.getClient()
                .from('tracked_items')
                .select('*', { count: 'exact' });

            if (params.query) {
                query = query.textSearch('title', params.query, {
                    type: 'websearch',
                    config: 'english'
                });
            }

            if(params.brand) {
                query = query.ilike('brand', `%${params.brand}%`);
            }

            if(params.decade) {
                query = query.ilike('decade', params.decade);
            }

            if(params.category) {
                query = query.ilike('category', params.category);
            }

            if(params.minPrice) {
                query = query.gte('projected_price', params.minPrice);
            }
    
            if(params.maxPrice) {
                query = query.lte('projected_price', params.maxPrice);
            }

            if(params.sortBy) {
                switch(params.sortBy) {
                    case 'price_asc':
                        query = query.order('projected_price', { ascending: true });
                        break;
                    case 'price_desc':
                        query = query.order('projected_price', { ascending: false });
                        break;
                    case 'created_at_desc':
                        query = query.order('created_at', { ascending: false });
                        break;
                }
            } else {
                query = query.order('created_at', { ascending: true });
            }

            const limit = params.limit || 20;
            const offset = params.offset || 0;
            query = query.range(offset, offset + limit - 1);

            const { data: items, count, error } = await query;

            if (error) throw error;

            const processedItems = await Promise.all((items || []).map(async (item) => {
                if (item.image_path) {
                    const {data: urlData} = await this.supabase.getClient().storage
                        .from('tracked_item_images')
                        .getPublicUrl(item.image_path);

                    return {
                        ...item,
                        image_url: urlData.publicUrl
                    }
                }
                return item;
            }));

            return {
                items: processedItems,
                total: count || 0,
                offset,
                limit
            }
        } catch(error) {
            console.error('Error searching for tracked items');
            throw error;
        }
    }
}
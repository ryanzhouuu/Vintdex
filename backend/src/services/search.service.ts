import { SearchTrackedItemsParams, SearchTrackedItemsResponse, TrackedItem, TrackedItemData } from "@vintdex/types";
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
                .select(`
                    *,
                    tracked_items_sold_listings!inner (
                        sold_listings (
                            id,
                            price,
                            currency,
                            sold_date,
                            condition,
                            size,
                            listing_url,
                            listing_id,
                            platform
                        )
                    )
                `, { count: 'exact' });

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
                let imageUrl = null;
                if (item.image_path) {
                    const {data: urlData} = await this.supabase.getClient().storage
                        .from('tracked_item_images')
                        .getPublicUrl(item.image_path);

                    imageUrl = urlData.publicUrl;
                }

                const soldData = item.tracked_items_sold_listings
                    .map((relation: any) => relation.sold_listings)
                    .filter(Boolean);

                return {
                    id: item.id,
                    title: item.title,
                    brand: item.brand,
                    category: item.category,
                    decade: item.decade,
                    projected_price: item.projected_price,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    imageUrl,
                    sold_listings: soldData
                } as TrackedItemData;
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
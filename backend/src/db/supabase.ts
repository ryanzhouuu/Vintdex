import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, SoldListing, TrackedItem, SearchTrackedItemsParams } from '@vintdex/types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    }
});

export class SupabaseService {
    private client: SupabaseClient<Database>;

    constructor() {
        this.client = supabase;
    }

    getClient(): SupabaseClient<Database> {
        return this.client;
    }

    // Tracked Item Methods 
    async createSoldListing(data: SoldListing): Promise<SoldListing> {
        const { data: soldListing, error } = await this.client
            .from('sold_listings')
            .insert({
                price: data.price,
                currency: data.currency,
                sold_date: data.sold_date,
                condition: data.condition,
                size: data.size,
                listing_url: data.listing_url,
                listing_id: data.listing_id,
                platform: data.platform,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if(error) throw error;
        return soldListing;
    }
    async createTrackedItem({
        title,
        decade,
        sold_listings,
        projected_price,
        category,
        brand,
        image,
    }: {
        title: string;
        decade: string;
        sold_listings: SoldListing[],
        projected_price: number;
        category: string;
        brand?: string;
        image?: File | Buffer,
    }) : Promise<TrackedItem> {
        try {

            // Upload image of item
            let imagePath = null;
            if (image) {
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
                const fileExt = image instanceof File ? image.name.split('.').pop() : 'jpeg';
                const path = `public/${fileName}.${fileExt}`;

                const { error: uploadError } = await this.client.storage
                    .from('tracked_item_images')
                    .upload(path, image, {
                        contentType: image instanceof File ? image.type : 'image/jpeg',
                        upsert: false
                    });

                if (uploadError) throw uploadError;
                imagePath = path;
            }

            const { data: trackedItem, error: trackedItemError } = await this.client
            .from('tracked_items')
            .insert({
                title,
                decade,
                projected_price,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                category,
                image_path: imagePath,
                brand: brand || null,
            })
            .select()
            .single();

            if (trackedItemError) throw trackedItemError;

            // Create sold listings and get ids
            const soldListings = await Promise.all(sold_listings.map((listing) => this.createSoldListing(listing)));

            // Create join table entries
            const joinTableEntries = soldListings.map(listing => ({
                tracked_item_id: trackedItem.id,
                sold_listing_id: listing.id,
                created_at: new Date().toISOString()
            }));

            const { error: joinError } = await this.client
            .from('tracked_items_sold_listings')
            .insert(joinTableEntries);

            if (joinError) throw joinError;

            return trackedItem;
        } catch (error) {
            console.error('Error creating new tracked item', error);
            throw error;
        }
    }

    async searchTrackedItems({
        query,
        brand,
        decade,
        category,
        minPrice,
        maxPrice,
        sortBy,
        limit = 20,
        offset = 0
    }: SearchTrackedItemsParams) {
        let dbQuery = this.client
            .from('tracked_items')
            .select(`*`, { count: 'exact' });

        if (query) {
            dbQuery = dbQuery.textSearch('title', query, {
                type: 'websearch',
                config: 'english'
            });
        }

        if (brand) {
            dbQuery = dbQuery.ilike('brand', `%${brand}%`);
        }

        if (decade) {
            dbQuery = dbQuery.eq('decade', decade);
        }

        if (category) {
            dbQuery = dbQuery.eq('category', category);
        }

        if (minPrice) {
            dbQuery = dbQuery.gte('projected_price', minPrice);
        }

        if (maxPrice) {
            dbQuery = dbQuery.lte('projected_price', maxPrice);
        }

        if (sortBy) {
            switch(sortBy) {
                case 'price_asc':
                    dbQuery = dbQuery.order('projected_price', { ascending: true });
                    break;
                case 'price_desc':
                    dbQuery = dbQuery.order('projected_price', { ascending: false });
                    break;
                case 'created_at_desc':
                    dbQuery = dbQuery.order('created_at', { ascending: false });
                    break;
            }
        } else {
            dbQuery = dbQuery.order('created_at', { ascending: true });
        }

        dbQuery = dbQuery.range(offset, offset + limit - 1);

        const { data, count, error } = await dbQuery;
        if (error) throw error;

        return { 
            data, 
            count 
        };
    }

    async getPublicImageUrl(imagePath: string) {
        const { data } = await this.client.storage
            .from('tracked_item_images')
            .getPublicUrl(imagePath);
        return data.publicUrl;
    }

    async getTrackedItemById(id: string) {
        const { data: item, error: itemError } = await this.client
            .from('tracked_items')
            .select(`
                *,
                tracked_items_sold_listings!inner (
                    sold_listing:sold_listings (
                        id,
                        price,
                        currency,
                        sold_date,
                        condition,
                        size,
                        listing_url,
                        listing_id,
                        platform,
                        created_at
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (itemError) throw itemError;
        if (!item) throw new Error('Item not found');

        // Transform the nested join data into a flattened structure
        const transformedItem = {
            ...item,
            sold_listings: item.tracked_items_sold_listings.map(
                (relation: any) => relation.sold_listing
            )
        };
        
        return transformedItem;
    }
}
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, SoldListing, TrackedItem } from '@vintdex/types';

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
}
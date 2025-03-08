import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, PriceDataEntry, TrackedItem } from '@vintdex/types';

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
    async createTrackedItem({
        title,
        decade,
        price_data,
        projected_price,
        category,
        brand,
        image,
    }: {
        title: string;
        decade: string;
        price_data: PriceDataEntry[],
        projected_price: number;
        category: string;
        brand?: string;
        image?: File | Buffer,
    }) : Promise<TrackedItem> {
        try {
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

            const { data, error } = await this.client
                .from('tracked_items')
                .insert({
                    title,
                    decade,
                    price_data,
                    projected_price,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    category,
                    image_path: imagePath,
                    brand: brand || null,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating new tracked item', error);
            throw error;
        }
    }
}
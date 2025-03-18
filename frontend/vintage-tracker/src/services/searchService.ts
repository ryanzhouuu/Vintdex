import { TrackedItem } from '@vintdex/types';
import { supabase } from '@/utils/supabaseClient';

export const searchTrackedItems = async (query: string) => {
    try {
        const { data, error } = await supabase
        .from('tracked_items')
        .select("*")
        .ilike('title', `%${query}%`);

        if (error) throw error;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error searching items: ', error);
        return null;
    }
};
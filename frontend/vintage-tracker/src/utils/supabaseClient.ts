import { createClient } from '@supabase/supabase-js';
import { Database } from '@vintdex/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

console.log(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


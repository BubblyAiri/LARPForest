import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Sticker {
  id: string;
  image_data: string;
  rotation: number;
  created_at: string;
}

export interface InboxMessage {
  id: string;
  content: string;
  response: string | null;
  status: 'pending' | 'approved';
  created_at: string;
}

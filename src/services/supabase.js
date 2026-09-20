import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase URL and Anon Key from the dashboard
// We use environment variables for security in production (e.g. import.meta.env.VITE_SUPABASE_URL)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isDemoUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === 'test@thaibites.com';
};

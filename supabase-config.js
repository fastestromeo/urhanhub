import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://gujbwxregetndvhyhqii.supabase.co';
const supabaseKey = 'sb_publishable_d2nhSXnRjxDAeEmXRyWiQg_FNJMaN9v';

export const supabase = createClient(supabaseUrl, supabaseKey);

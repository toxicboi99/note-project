import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmxbxwnmfcwtoeikbnks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteGJ4d25tZmN3dG9laWtibmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MDc4NjcsImV4cCI6MjA1MDA4Mzg2N30.GjUITL37t5cna2Z_5zqCWc9ifees0swMPznKIwcn2nI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
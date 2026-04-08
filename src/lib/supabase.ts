import { createClient } from '@supabase/supabase-js';

// Retrieve these from your Supabase Dashboard -> Project Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hkgmpntsvxucgwovukfh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ21wbnRzdnh1Y2d3b3Z1a2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Nzk0MjQsImV4cCI6MjA5MTE1NTQyNH0.73zNicORShZkCs4eE3pBF1TgBOrQo3Xf-e1Ip07DCuMEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

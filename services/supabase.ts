import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udyesbqviezyxmhejvfi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeWVzYnF2aWV6eXhtaGVqdmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTQ2OTYsImV4cCI6MjA4MzM3MDY5Nn0.OLFfOEq_ZQ8nrMRkpYBki864AgDm5h762Rz12ttcFiA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kwmyxfttormvtasizjvj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bXl4ZnR0b3JtdnRhc2l6anZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NTQxMjcsImV4cCI6MjEwNDMzMDEyN30.OEJ6BGOvXCqQIgIXGs9AJVq3N1jASVq7N8OsbwY-3yk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

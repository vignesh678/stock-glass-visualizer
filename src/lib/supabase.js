
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://buyuzdbgnwfdhkusdgur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eXV6ZGJnbndmZGhrdXNkZ3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA2MjAsImV4cCI6MjA2MTA3NjYyMH0.ZhucwmKQRYRfK0XpzCvNTICMmN2Ag1Y4d5AIgPiC1Vg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

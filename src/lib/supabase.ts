import { createClient } from '@supabase/supabase-js';

const url = 'https://cwbfslkvbthlttcicrtt.supabase.co';
const anonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YmZzbGt2YnRobHR0Y2ljcnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Nzk1OTgsImV4cCI6MjA5NTQ1NTU5OH0.EI1UAkHwPzU-1ymwjRa9zV5WZVaTnQZa1l61P6uKDSo';

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'tinhtien:sb-auth',
  },
});

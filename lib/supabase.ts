import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __supabase: SupabaseClient | undefined;
}

export function getSupabase(): SupabaseClient {
  if (global.__supabase) return global.__supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Accepts the new "secret key" (sb_secret_...) or the legacy service_role JWT.
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Configuration Supabase manquante : définis NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY.'
    );
  }
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  global.__supabase = client;
  return client;
}

export const PHOTOS_BUCKET = 'photos';

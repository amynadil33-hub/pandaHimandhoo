import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for read-only public queries.
 * Uses the anon key + RLS policies defined in scripts/001_create_menu_schema.sql.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
}

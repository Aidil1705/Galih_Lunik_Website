import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Temporary debug logs to verify Vite env is available in the browser runtime.
// Remove these logs after debugging.
try {
  // eslint-disable-next-line no-console
  console.log('SUPABASE URL:', supabaseUrl ? '[set]' : '[missing]')
  // eslint-disable-next-line no-console
  console.log('SUPABASE ANON KEY:', supabaseAnonKey ? '[set]' : '[missing]')
} catch (e) {
  // ignore in non-browser environments
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null
import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Por favor, configure no arquivo .env.local'
  )
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Por favor, configure no arquivo .env.local'
  )
}

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}


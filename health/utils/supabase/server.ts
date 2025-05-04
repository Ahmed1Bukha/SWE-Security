import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  // Try to use environment variables first, then fall back to hardcoded values for preview
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ewhzmjovuipdczmhujdh.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aHptam92dWlwZGN6bWh1amRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzU3NjgsImV4cCI6MjA2MTYxMTc2OH0.VBQzgauNukff6s8Fu-y2wGXojRFJFqlN2I9xYNeeHDY"

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

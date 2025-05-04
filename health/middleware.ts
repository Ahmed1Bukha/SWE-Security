import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables are missing. Authentication features will not work properly.")
      return res
    }

    // Create Supabase client
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    await supabase.auth.getSession()
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return res
}

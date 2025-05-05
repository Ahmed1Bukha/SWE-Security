"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/register" && pathname !== "/login") {
      router.push("/register")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return <div className="container flex min-h-[60vh] items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated && pathname !== "/register" && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}

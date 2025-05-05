"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/utils/supabase/client"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: { message: string; code?: string } }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: { message: string } }>
  signOut: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<{ error?: { message: string } }>
  isAuthenticated: boolean
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  resendConfirmationEmail: async () => ({}),
  isAuthenticated: false,
  isSupabaseConfigured: true,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // Get session from Supabase
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()
        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        // Set up auth state change listener
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        setIsLoading(false)

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      router.push("/")
      router.refresh()
      return {}
    } catch (error: any) {
      console.error("Error signing in:", error)
      return { error: { message: error.message || "An error occurred during sign in" } }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        return { error: { message: error.message } }
      }

      router.push("/registration-success")
      return {}
    } catch (error: any) {
      console.error("Error signing up:", error)
      return { error: { message: error.message || "An error occurred during sign up" } }
    } finally {
      setIsLoading(false)
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        return { error: { message: error.message } }
      }

      return {}
    } catch (error: any) {
      console.error("Error resending confirmation email:", error)
      return { error: { message: error.message || "An error occurred while resending the confirmation email" } }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resendConfirmationEmail,
        isAuthenticated: !!user,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

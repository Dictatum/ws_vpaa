"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "./supabase"

interface AuthContextType {
  user: User | null
  role: "admin" | "user" | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role: "admin" | "user") => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<"admin" | "user" | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          const userRole = session.user.user_metadata?.role || "user"
          setRole(userRole)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || "user"
        setRole(userRole)
      } else {
        setRole(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Please confirm your email before signing in")
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: "admin" | "user") => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo:
          role === "admin"
            ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/auth/admin/login?confirmed=true`
            : process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/auth/user/login?confirmed=true`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

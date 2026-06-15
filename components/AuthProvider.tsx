"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { getAvatarFromMetadata, getNameFromMetadata } from "@/lib/user-display"

type UserProfile = {
  first_name?: string
  last_name?: string
  email?: string
}

type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  displayName: string
  firstName: string
  email: string
  avatar: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getDisplayName(
  user: User | null,
  profile: UserProfile | null
) {
  if (profile?.first_name) {
    return `${profile.first_name} ${profile.last_name ?? ""}`.trim()
  }

  const fromMetadata = getNameFromMetadata(user?.user_metadata)
  if (fromMetadata) return fromMetadata

  if (user?.email) return user.email.split("@")[0]
  return ""
}

function getFirstName(user: User | null, profile: UserProfile | null) {
  if (profile?.first_name) return profile.first_name

  const fromMetadata = getNameFromMetadata(user?.user_metadata)
  if (fromMetadata) return fromMetadata.split(" ")[0]

  if (user?.email) return user.email.split("@")[0]
  return ""
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const loadProfile = async (authUser: User) => {
      const { data } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", authUser.id)
        .maybeSingle()

      setProfile(data ?? null)
    }

    const syncUser = async (authUser: User | null) => {
      setUser(authUser)

      if (authUser) {
        await loadProfile(authUser)
      } else {
        setProfile(null)
      }

      setLoading(false)
    }

    supabase.auth.getUser().then(({ data }) => {
      syncUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      displayName: getDisplayName(user, profile),
      firstName: getFirstName(user, profile),
      email: profile?.email ?? user?.email ?? "",
      avatar: getAvatarFromMetadata(user?.user_metadata),
    }),
    [user, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }

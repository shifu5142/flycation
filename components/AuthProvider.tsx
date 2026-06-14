"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"

import { getUserProfile } from "@/lib/auth"
import { auth } from "@/app/services/auth/firebaseConfig"

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

function getDisplayName(user: User | null, profile: UserProfile | null) {
  if (profile?.first_name) {
    return `${profile.first_name} ${profile.last_name ?? ""}`.trim()
  }
  if (user?.displayName) return user.displayName
  if (user?.email) return user.email.split("@")[0]
  return "Traveler"
}

function getFirstName(user: User | null, profile: UserProfile | null) {
  if (profile?.first_name) return profile.first_name
  if (user?.displayName) return user.displayName.split(" ")[0]
  if (user?.email) return user.email.split("@")[0]
  return "Traveler"
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const data = await getUserProfile(firebaseUser.uid)
          setProfile(data)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      displayName: getDisplayName(user, profile),
      firstName: getFirstName(user, profile),
      email: profile?.email ?? user?.email ?? "",
      avatar: user?.photoURL ?? null,
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

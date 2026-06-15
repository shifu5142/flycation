import type { User } from "@supabase/supabase-js"

import { getNameFromMetadata } from "@/lib/user-display"

export type UserProfile = {
  first_name?: string
  last_name?: string
  email?: string
}

export function profileFromAuthUser(user: User | null): UserProfile | null {
  if (!user) return null

  const metadata = user.user_metadata
  const firstName =
    typeof metadata?.first_name === "string" ? metadata.first_name : ""
  const lastName =
    typeof metadata?.last_name === "string" ? metadata.last_name : ""

  if (firstName || lastName) {
    return {
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      email: user.email ?? undefined,
    }
  }

  const fullName = getNameFromMetadata(metadata)
  if (fullName) {
    const [first, ...rest] = fullName.split(" ")
    return {
      first_name: first,
      last_name: rest.join(" ") || undefined,
      email: user.email ?? undefined,
    }
  }

  if (user.email) {
    return { email: user.email }
  }

  return null
}

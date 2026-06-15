type UserMetadata = Record<string, unknown> | undefined

export function getNameFromMetadata(metadata: UserMetadata) {
  const first = typeof metadata?.first_name === "string" ? metadata.first_name : ""
  const last = typeof metadata?.last_name === "string" ? metadata.last_name : ""
  const full = `${first} ${last}`.trim()
  if (full) return full
  if (typeof metadata?.full_name === "string") return metadata.full_name
  if (typeof metadata?.name === "string") return metadata.name
  return ""
}

export function getAvatarFromMetadata(metadata: UserMetadata) {
  if (typeof metadata?.avatar_url === "string" && metadata.avatar_url) {
    return metadata.avatar_url
  }
  if (typeof metadata?.picture === "string" && metadata.picture) {
    return metadata.picture
  }
  return null
}

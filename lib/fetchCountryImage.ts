export async function fetchCountryImageUrl(
  country: string,
  destination?: string
): Promise<string | null> {
  const trimmedCountry = country.trim()
  const trimmedDestination = destination?.trim()

  if (!trimmedCountry && !trimmedDestination) return null

  try {
    const params = new URLSearchParams()
    if (trimmedCountry) params.set("country", trimmedCountry)
    if (trimmedDestination) params.set("destination", trimmedDestination)

    const res = await fetch(`/api/country-image?${params.toString()}`)
    if (!res.ok) return null

    const data = (await res.json()) as { url?: string }
    return data.url ?? null
  } catch (err) {
    console.error("Image fetch failed:", err)
    return null
  }
}

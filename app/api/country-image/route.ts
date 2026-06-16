import { NextRequest } from "next/server"

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1480794659523-8597a0da6b7e?w=1200&q=80&auto=format&fit=crop"

export type CountryImageResponse = {
  url: string
  source: "unsplash" | "fallback"
  error?: string
  debug?: {
    country?: string
    destination?: string
    query?: string
    hasAccessKey?: boolean
    unsplashStatus?: number
    unsplashError?: string
    resultCount?: number
  }
}

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country")?.trim()
  const destination = req.nextUrl.searchParams.get("destination")?.trim()
  const searchTerm = country || destination

  const debug: CountryImageResponse["debug"] = {
    country,
    destination,
    query: searchTerm,
  }

  if (!searchTerm) {
    console.error("[country-image] Missing country and destination")
    return Response.json({
      url: DEFAULT_IMAGE,
      source: "fallback",
      error: "No country or destination provided",
      debug,
    } satisfies CountryImageResponse)
  }

  const accessKey = (
    process.env.UNSPLASH_ACCESS_KEY ??
    process.env.UNSPLASH_SECRET_KEY ??
    process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ??
    ""
  ).replace(/^['"]|['"]$/g, "")

  debug.hasAccessKey = Boolean(accessKey)

  if (!accessKey) {
    console.error(
      "[country-image] Missing UNSPLASH_SECRET_KEY or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY"
    )
    return Response.json({
      url: DEFAULT_IMAGE,
      source: "fallback",
      error: "Unsplash access key is not configured on the server",
      debug,
    } satisfies CountryImageResponse)
  }

  const query = encodeURIComponent(
    country && destination
      ? `${destination} ${country}`
      : searchTerm.toLowerCase()
  )
  debug.query = decodeURIComponent(query)

  try {
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=1`
    const res = await fetch(unsplashUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      cache: "no-store",
    })

    debug.unsplashStatus = res.status

    if (!res.ok) {
      const errorBody = await res.text()
      debug.unsplashError = errorBody.slice(0, 300)

      const errorMessage =
        res.status === 401
          ? "Invalid Unsplash access key — add a valid Access Key (not Secret) from unsplash.com/developers as UNSPLASH_SECRET_KEY or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in .env"
          : `Unsplash API returned ${res.status}`

      console.error("[country-image] Unsplash API error:", res.status, errorBody)

      return Response.json({
        url: DEFAULT_IMAGE,
        source: "fallback",
        error: errorMessage,
        debug,
      } satisfies CountryImageResponse)
    }

    const data = (await res.json()) as {
      results?: { urls?: { regular?: string } }[]
      errors?: string[]
    }

    debug.resultCount = data.results?.length ?? 0

    const url = data.results?.[0]?.urls?.regular
    if (!url) {
      console.error("[country-image] No Unsplash results for query:", debug.query)
      return Response.json({
        url: DEFAULT_IMAGE,
        source: "fallback",
        error: "Unsplash returned no photos for this query",
        debug,
      } satisfies CountryImageResponse)
    }

    console.log("[country-image] Success:", debug.query, "→", url)
    return Response.json({
      url,
      source: "unsplash",
      debug,
    } satisfies CountryImageResponse)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[country-image] Fetch failed:", message)
    return Response.json({
      url: DEFAULT_IMAGE,
      source: "fallback",
      error: message,
      debug,
    } satisfies CountryImageResponse)
  }
}

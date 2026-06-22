import {
  exploreDestinations,
  explorePriceRanges,
  exploreRegions,
  exploreSeasons,
  type ExploreDestination,
} from "@/lib/mockExplorePage"

export type ExploreFilterResults = {
  featured: ExploreDestination[]
  trending: ExploreDestination[]
  recommended: ExploreDestination[]
  all: ExploreDestination[]
}

export function exploreFilterKey(
  region: string,
  season: string,
  price: string
): string {
  return `${region}|${season}|${price}`
}

function matchesPrice(destination: ExploreDestination, price: string): boolean {
  if (price === "Any") return true
  if (price === "Under $700") return destination.priceFrom < 700
  if (price === "$700–$1000") {
    return destination.priceFrom >= 700 && destination.priceFrom <= 1000
  }
  if (price === "$1000+") return destination.priceFrom > 1000
  return true
}

function matchesFilters(
  destination: ExploreDestination,
  region: string,
  season: string,
  price: string
): boolean {
  const matchesRegion = region === "All" || destination.region === region
  const matchesSeason = season === "All" || destination.season === season
  return matchesRegion && matchesSeason && matchesPrice(destination, price)
}

function comboIndex(region: string, season: string, price: string): number {
  const regionIndex = Math.max(0, exploreRegions.indexOf(region))
  const seasonIndex = Math.max(0, exploreSeasons.indexOf(season))
  const priceIndex = Math.max(0, explorePriceRanges.indexOf(price))
  return (
    regionIndex * exploreSeasons.length * explorePriceRanges.length +
    seasonIndex * explorePriceRanges.length +
    priceIndex
  )
}

function buildSectionResults(
  pool: ExploreDestination[],
  region: string,
  season: string,
  price: string
): ExploreFilterResults {
  let all = pool.filter((destination) =>
    matchesFilters(destination, region, season, price)
  )

  if (all.length === 0) {
    const start = comboIndex(region, season, price) % exploreDestinations.length
    all = Array.from({ length: Math.min(6, exploreDestinations.length) }, (_, i) => {
      return exploreDestinations[(start + i) % exploreDestinations.length]
    })
  }

  const featured = all.filter((d) => d.featured).slice(0, 3)
  const featuredFallback =
    featured.length > 0 ? featured : all.slice(0, Math.min(3, all.length))

  const trending = all.filter((d) => d.trending).slice(0, 6)
  const trendingFallback =
    trending.length > 0 ? trending : all.slice(0, Math.min(6, all.length))

  const recommended = all.slice(0, Math.min(3, all.length))

  return {
    featured: featuredFallback,
    trending: trendingFallback,
    recommended,
    all,
  }
}

function buildExploreFilterResults(): Record<string, ExploreFilterResults> {
  const results: Record<string, ExploreFilterResults> = {}

  for (const region of exploreRegions) {
    for (const season of exploreSeasons) {
      for (const price of explorePriceRanges) {
        const key = exploreFilterKey(region, season, price)
        results[key] = buildSectionResults(
          exploreDestinations,
          region,
          season,
          price
        )
      }
    }
  }

  return results
}

export const exploreResultsByFilter = buildExploreFilterResults()

export function getExploreResults(
  region: string,
  season: string,
  price: string
): ExploreFilterResults {
  return (
    exploreResultsByFilter[exploreFilterKey(region, season, price)] ?? {
      featured: [],
      trending: [],
      recommended: [],
      all: [],
    }
  )
}

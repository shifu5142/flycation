"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  Coins,
  Compass,
  ExternalLink,
  Filter,
  Languages,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { AppImage } from "@/components/AppImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  exploreDestinations,
  explorePriceRanges,
  exploreRegions,
  exploreSeasons,
  type ExploreDestination,
} from "@/lib/mockExplorePage"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ToastProvider"

type ApiCountry = {
  name?: { common?: string }
  names?: { common?: string }
  flags?: { png?: string }
  flag?: { url_png?: string }
  region?: string
  subregion?: string
  capital?: string[]
  capitals?: { name?: string }[]
  languages?: Record<string, string> | { name?: string }[]
  currencies?:
    | Record<string, { name?: string; symbol?: string }>
    | { code?: string; symbol?: string; name?: string }[]
  population?: number
  maps?: { googleMaps?: string }
  links?: { google_maps?: string }
  codes?: { alpha_2?: string }
}

function DestinationCard({
  destination,
  apiCountry,
  large,
}: {
  destination?: ExploreDestination
  apiCountry?: ApiCountry
  large?: boolean
}) {
  if (apiCountry) {
    const mapUrl = apiCountry.maps?.googleMaps ?? apiCountry.links?.google_maps
    const language = Array.isArray(apiCountry.languages)
      ? apiCountry.languages[0]?.name
      : Object.values(apiCountry.languages ?? {})[0]
    const currency = Array.isArray(apiCountry.currencies)
      ? apiCountry.currencies[0]
      : Object.entries(apiCountry.currencies ?? {})[0]?.[1]
    const currencyCode = Array.isArray(apiCountry.currencies)
      ? apiCountry.currencies[0]?.code
      : Object.keys(apiCountry.currencies ?? {})[0]

    return (
      <Card
        className={cn(
          "group overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
          large && "sm:col-span-2"
        )}
      >
        <div className={cn("relative overflow-hidden", large ? "h-56" : "h-44")}>
          <AppImage
            src={apiCountry.flags?.png ?? apiCountry.flag?.url_png ?? ""}
            alt={apiCountry.name?.common ?? apiCountry.names?.common ?? "Country flag"}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="text-white">
              <p className="text-lg font-bold">
                {apiCountry.name?.common ?? apiCountry.names?.common}
              </p>
              <p className="text-sm text-white/85">
                {apiCountry.region}
                {apiCountry.subregion ? ` · ${apiCountry.subregion}` : ""}
              </p>
            </div>
            <Badge className="border-white/20 bg-black/40 text-white backdrop-blur-sm">
              {apiCountry.region}
            </Badge>
          </div>
        </div>
        <CardHeader className="gap-1 pb-2">
          <CardDescription className="line-clamp-2 text-sm">
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3.5" />
                {apiCountry.capital?.[0] ?? apiCountry.capitals?.[0]?.name}
              </span>
              <span className="inline-flex items-center gap-1">
                <Languages className="size-3.5" />
                {language}
              </span>
              <span className="inline-flex items-center gap-1">
                <Coins className="size-3.5" />
                {currency?.symbol} {currencyCode}
              </span>
            </span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Population</p>
            <p className="text-lg font-bold text-primary">{apiCountry.population}</p>
          </div>
          {mapUrl ? (
            <Button asChild size="sm" className="rounded-xl">
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                View on Map
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          ) : (
            <Button size="sm" className="rounded-xl" disabled>
              View on Map
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  if (!destination) return null

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        large && "sm:col-span-2"
      )}
    >
      <div className={cn("relative overflow-hidden", large ? "h-56" : "h-44")}>
        <AppImage
          src={destination.image}
          alt={destination.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="text-white">
            <p className="text-lg font-bold">{destination.name}</p>
            <p className="text-sm text-white/85">{destination.country}</p>
          </div>
          <Badge className="border-white/20 bg-black/40 text-white backdrop-blur-sm">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {destination.rating}
          </Badge>
        </div>
      </div>
      <CardHeader className="gap-1 pb-2">
        <CardDescription className="line-clamp-2 text-sm">
          {destination.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-lg font-bold text-primary">
            ${destination.priceFrom}
          </p>
        </div>
        <Button size="sm" className="rounded-xl">
          View details
        </Button>
      </CardFooter>
    </Card>
  )
}

function ExplorePage() {
  const { toast } = useToast()  
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("All")
  const [season, setSeason] = useState("All")
  const [price, setPrice] = useState("Any")
  const [showFilters, setShowFilters] = useState(false)
  const [isExploring, setIsExploring] = useState(false)
  const [apiCountries, setApiCountries] = useState<ApiCountry[]>([])

  const filtered = useMemo(() => {
    return exploreDestinations.filter((d) => {
      const matchesQuery =
        !query.trim() ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
      const matchesRegion = region === "All" || d.region === region
      const matchesSeason = season === "All" || d.season === season
      const matchesPrice =
        price === "Any" ||
        (price === "Under $700" && d.priceFrom < 700) ||
        (price === "$700–$1000" &&
          d.priceFrom >= 700 &&
          d.priceFrom <= 1000) ||
        (price === "$1000+" && d.priceFrom > 1000)
      return matchesQuery && matchesRegion && matchesSeason && matchesPrice
    })
  }, [query, region, season, price])

  const featured = exploreDestinations.filter((d) => d.featured)
  const trending = exploreDestinations.filter((d) => d.trending)
  const recommended = exploreDestinations.slice(0, 3)
  const hasApiData = apiCountries.length > 0
  const apiFeatured = apiCountries.slice(0, 3)
  const apiTrending = apiCountries.slice(3, 9)
  const apiRecommended = apiCountries.slice(9, 12)

  const handleExploreNow = async () => {
    if (isExploring) return
    if (!query.trim() || !region.trim() || !season.trim() || !price.trim()) {
      toast("Please fill in all fields", "info")
      return
    }
    const requestBody = {
      query,
      region,
      season,
      price,
    }
    setIsExploring(true)
    try {
      const res = await fetch("/api/Explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json()
      const countries =
        data.data?.objects ?? data.objects ?? (Array.isArray(data) ? data : [])
      setApiCountries(countries)
      console.log("Generated trip plan:", data)
      toast("Trip plan generated successfully", "success")
    } finally {
      setIsExploring(false)
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-sky-500/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-xl space-y-4">
            <Badge variant="secondary" className="rounded-full">
              <Compass className="size-3" />
              Explore the world
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Where do you want to go next?
            </h1>
            <p className="text-muted-foreground">
              Search destinations, compare ratings, and discover your next
              favorite place to visit.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search destination or country…"
                  className="h-11 rounded-xl border-border/80 bg-background/90 pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-xl lg:hidden"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>
          <MapPin className="pointer-events-none absolute -right-4 -bottom-4 size-40 text-primary/10" />
        </section>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Card
            className={cn(
              "h-fit rounded-2xl border-border/60 lg:block",
              showFilters ? "block" : "hidden"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="size-4 text-primary" />
                Filters
              </CardTitle>
              <CardDescription>UI only — connect later</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Region</Label>
                <div className="flex flex-wrap gap-1.5">
                  {exploreRegions.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={region === r ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setRegion(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Season</Label>
                <div className="flex flex-wrap gap-1.5">
                  {exploreSeasons.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={season === s ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setSeason(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Price</Label>
                <div className="flex flex-wrap gap-1.5">
                  {explorePriceRanges.map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={price === p ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setPrice(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rating</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["4.5+", "4.0+", "Any"].map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-xs"
                    >
                      <Star className="size-3" />
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-10">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-semibold">Featured destinations</h2>
                <Badge variant="secondary">Curated</Badge>
                <Button
                  onClick={handleExploreNow}
                  disabled={isExploring}
                  variant="default"
                  className={cn(
                    "ml-auto bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700",
                    isExploring && "animate-pulse cursor-wait opacity-90"
                  )}
                >
                  {isExploring ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Exploring…
                    </>
                  ) : (
                    "Explore Now"
                  )}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {hasApiData
                  ? apiFeatured.map((country, i) => (
                      <DestinationCard
                        key={country.codes?.alpha_2 ?? country.name?.common ?? country.names?.common ?? i}
                        apiCountry={country}
                        large={i === 0}
                      />
                    ))
                  : featured.map((d, i) => (
                      <DestinationCard key={d.id} destination={d} large={i === 0} />
                    ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Trending now</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hasApiData
                  ? apiTrending.map((country, i) => (
                      <DestinationCard
                        key={country.codes?.alpha_2 ?? country.name?.common ?? country.names?.common ?? i}
                        apiCountry={country}
                      />
                    ))
                  : trending.map((d) => (
                      <DestinationCard key={d.id} destination={d} />
                    ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Recommended for you</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hasApiData
                  ? apiRecommended.map((country, i) => (
                      <DestinationCard
                        key={country.codes?.alpha_2 ?? country.name?.common ?? country.names?.common ?? i}
                        apiCountry={country}
                      />
                    ))
                  : recommended.map((d) => (
                      <DestinationCard key={d.id} destination={d} />
                    ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                All destinations
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({hasApiData ? apiCountries.length : filtered.length})
                </span>
              </h2>
              {hasApiData ? (
                apiCountries.length === 0 ? (
                  <Card className="border-dashed py-12 text-center">
                    <CardContent>
                      <p className="font-medium">No countries found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your filters
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {apiCountries.map((country, i) => (
                      <DestinationCard
                        key={country.codes?.alpha_2 ?? country.name?.common ?? country.names?.common ?? i}
                        apiCountry={country}
                      />
                    ))}
                  </div>
                )
              ) : filtered.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent>
                    <p className="font-medium">No destinations match your filters</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting region, season, or price
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default ExplorePage

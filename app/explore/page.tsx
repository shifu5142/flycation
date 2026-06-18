"use client"

import { useMemo, useState } from "react"
import {
  Compass,
  Filter,
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

function DestinationCard({
  destination,
  large,
}: {
  destination: ExploreDestination
  large?: boolean
}) {
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
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("All")
  const [season, setSeason] = useState("All")
  const [price, setPrice] = useState("Any")
  const [showFilters, setShowFilters] = useState(false)

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
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((d, i) => (
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
                {trending.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Recommended for you</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                All destinations
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filtered.length})
                </span>
              </h2>
              {filtered.length === 0 ? (
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

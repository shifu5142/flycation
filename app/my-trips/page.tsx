"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Loader2, MapPin, Plus, Sparkles } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { fetchCountryImageUrl } from "@/lib/fetchCountryImage"
import { AppImage } from "@/components/AppImage"
import { Skeleton } from "@/components/ui/skeleton"

type TripPlan = {
  id: string
  destination: string
  country: string
  image: string
  summary: string
  duration: string
}

function toTripPlan(row: Record<string, unknown>): TripPlan {
  const tripPlan = {
    id: String(row.id ?? ""),
    destination: String(row.destination ?? ""),
    country: String(row.country ?? ""),
    image: String(row.image ?? ""),
    summary: String(row.summary ?? ""),
    duration: String(row.duration ?? ""),
  }
  return tripPlan
}

function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function TripPlanCard({ trip }: { trip: TripPlan }) {
  const imageSrc = trip.image || "/hero-travel.png"

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <AppImage
          src={imageSrc}
          alt={trip.destination}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          aria-hidden
        />
        <Badge className="absolute top-3 right-3 border border-white/25 bg-black/75 text-white backdrop-blur-sm">
          {formatLabel(trip.country)}
        </Badge>
      </div>

      <CardHeader className="gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{formatLabel(trip.destination)}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="size-3.5 shrink-0" />
          {trip.duration || "Duration not set"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
          {trip.summary || "No summary available."}
        </p>
        <Button variant="outline" className="w-full rounded-xl" size="sm" asChild>
          <Link
            href={`/my-trips/${trip.id}?image=${encodeURIComponent(imageSrc)}`}
          >
            View trip
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function TripPlanCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardHeader className="gap-2 pb-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}

function TripsLoadingView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 py-4 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        Loading your trips…
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TripPlanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function EmptyTrips({ message }: { message: string }) {
  return (
    <Card className="border-dashed py-16 text-center">
      <CardContent>
        <Sparkles className="mx-auto size-10 text-primary/60" />
        <p className="mt-3 font-medium">{message}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start planning your next adventure
        </p>
      </CardContent>
    </Card>
  )
}

function MyTripsPage() {
  const [trips, setTrips] = useState<TripPlan[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase.from("trips_plan").select("*")
        if (error) {
          console.error(error)
          return
        }

        const tripPlans = (data ?? []).map((row: Record<string, unknown>) =>
          toTripPlan(row)
        )

        const tripsWithImages = await Promise.all(
          tripPlans.map(async (trip: TripPlan) => {
            const imageUrl = await fetchCountryImageUrl(
              trip.country,
              trip.destination
            )
            return {
              ...trip,
              image: imageUrl || trip.image,
            }
          })
        )

        setTrips(tripsWithImages)
      } finally {
        setLoaded(true)
      }
    }
    fetchTrips()
  }, [])

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
              Travel plans
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">My Trips</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage upcoming, past, and draft itineraries in one place
            </p>
          </div>
          <Link href="/ai-trip-planner">
          <Button className="rounded-xl shadow-md shadow-primary/20">
              <Plus className="size-4" />
              Create new trip
            </Button>
          </Link>
        </div>

        {!loaded ? (
          <TripsLoadingView />
        ) : trips.length === 0 ? (
          <EmptyTrips message="There are no trips" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripPlanCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default MyTripsPage

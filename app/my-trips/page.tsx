"use client"

import { useState } from "react"
import {
  Calendar,
  CloudSun,
  MapPin,
  NotebookPen,
  Plus,
  Sparkles,
  Users,
} from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  draftTrips,
  pastTrips,
  statusLabels,
  upcomingTrips,
  type TripStatus,
  type UserTrip,
} from "@/lib/mockMyTripsPage"
import { cn } from "@/lib/utils"

function statusBadgeClass(status: TripStatus) {
  switch (status) {
    case "ongoing":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
    case "completed":
      return "bg-muted text-muted-foreground border-border"
    case "draft":
      return "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

function TripPlanCard({ trip }: { trip: UserTrip }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.destination}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          className={cn(
            "absolute top-3 right-3 border backdrop-blur-sm",
            statusBadgeClass(trip.status)
          )}
        >
          {statusLabels[trip.status]}
        </Badge>
      </div>
      <CardHeader className="gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="size-4 text-primary" />
          {trip.destination}
          <span className="text-sm font-normal text-muted-foreground">
            · {trip.country}
          </span>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {trip.dates}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-2 rounded-xl bg-sky-500/10 px-3 py-2 text-sm">
          <CloudSun className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <span className="font-medium">{trip.weather.temp}</span>
          <span className="text-muted-foreground">· {trip.weather.condition}</span>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <NotebookPen className="size-3" />
            Notes
          </p>
          <p className="line-clamp-2 text-sm text-foreground/90">{trip.notes}</p>
        </div>
        <Button variant="outline" className="w-full rounded-xl" size="sm">
          View trip details
        </Button>
      </CardContent>
    </Card>
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
  const [tab, setTab] = useState("upcoming")

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
          <Button className="rounded-xl shadow-md shadow-primary/20">
            <Plus className="size-4" />
            Create new trip
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-11 rounded-xl bg-muted/70 p-1">
            <TabsTrigger value="upcoming" className="rounded-lg px-4">
              Upcoming ({upcomingTrips.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg px-4">
              Past ({pastTrips.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-lg px-4">
              Saved drafts ({draftTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingTrips.length === 0 ? (
              <EmptyTrips message="No upcoming trips" />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingTrips.map((trip) => (
                  <TripPlanCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastTrips.length === 0 ? (
              <EmptyTrips message="No past trips yet" />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pastTrips.map((trip) => (
                  <TripPlanCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            {draftTrips.length === 0 ? (
              <EmptyTrips message="No saved drafts" />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {draftTrips.map((trip) => (
                  <TripPlanCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

export default MyTripsPage

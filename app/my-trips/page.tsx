"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Sparkles } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { SavedTripCard, type SavedTrip } from "@/components/SavedTripCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"

function toSavedTrip(row: Record<string, unknown>): SavedTrip {
  const returnDate = row.returnDate ?? row.return_date

  return {
    id: row.id as string | number,
    tripType: returnDate ? "roundtrip" : "oneway",
    from: String(row.from ?? ""),
    to: String(row.to ?? ""),
    departure: String(row.departure ?? ""),
    returnDate: returnDate ? String(returnDate) : null,
    passengers: Number(row.passengers ?? 1),
    travelClass: String(row.travelClass ?? row.travel_class ?? "Economy"),
    imageUrl: (row.imageUrl ?? row.image_url) as string | null | undefined,
  }
}

function isPastTrip(trip: SavedTrip) {
  const endDate = trip.returnDate || trip.departure
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(endDate) < today
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
  const [trips, setTrips] = useState<SavedTrip[] | null>(null)
  const upcomingTrips = useMemo(
    () => (trips ?? []).filter((trip) => !isPastTrip(trip)),
    [trips]
  )
  const pastTrips = useMemo(
    () => (trips ?? []).filter((trip) => isPastTrip(trip)),
    [trips]
  )

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
      if (error) {
        console.error(error)
        return
      }
      setTrips(
        (data ?? []).map((row: Record<string, unknown>) => toSavedTrip(row))
      )
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
          <Button className="rounded-xl shadow-md shadow-primary/20">
            <Plus className="size-4" />
            Create new trip
          </Button>
        </div>

        {trips === null ? null : trips.length === 0 ? (
          <EmptyTrips message="There are no trips" />
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-11 rounded-xl bg-muted/70 p-1">
              <TabsTrigger value="upcoming" className="rounded-lg px-4">
                Upcoming ({upcomingTrips.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg px-4">
                Past ({pastTrips.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingTrips.length === 0 ? (
                <EmptyTrips message="No upcoming trips" />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingTrips.map((trip) => (
                    <SavedTripCard key={trip.id} trip={trip} />
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
                    <SavedTripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardShell>
  )
}

export default MyTripsPage

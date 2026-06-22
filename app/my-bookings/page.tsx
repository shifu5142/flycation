"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Building2,
  Check,
  Clock,
  Download,
  Loader2,
  Plane,
  QrCode,
  Ticket,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { AppImage } from "@/components/AppImage"
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
import {
  isUpcomingTrip,
  statusBadgeClass,
  toBookingStatus,
  tripToBooking,
  type Trip,
} from "@/lib/tripBooking"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  statusLabels,
  type Booking,
  type BookingStatus,
} from "@/lib/mockBookingsPage"
import { cn } from "@/lib/utils"

function BookingIcon({ type }: { type: Booking["type"] }) {
  if (type === "flight") return <Plane className="size-4" />
  if (type === "hotel") return <Building2 className="size-4" />
  return <Ticket className="size-4" />
}

function BookingTimeline({ booking }: { booking: Booking }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-0">
      {booking.timeline.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                step.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {step.done ? <Check className="size-3.5" /> : index + 1}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium">{step.label}</p>
              <p className="text-[10px] text-muted-foreground">{step.date}</p>
            </div>
          </div>
          {index < booking.timeline.length - 1 && (
            <div
              className={cn(
                "mx-2 hidden h-px w-8 sm:block lg:w-12",
                step.done ? "bg-primary/40" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="size-11 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="h-36 w-full shrink-0 rounded-none sm:h-auto sm:min-h-[11rem] sm:w-44" />
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-3 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex gap-2">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-7 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-14 w-36 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function BookingsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 py-4 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        Loading your bookings…
      </div>
      <BookingCardSkeleton />
      <BookingCardSkeleton />
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-44">
          <AppImage
            src={booking.image}
            alt={booking.title}
            className="size-full object-cover"
          />
          <Badge
            className={cn(
              "absolute top-3 left-3 border backdrop-blur-sm",
              statusBadgeClass(booking.status)
            )}
          >
            {statusLabels[booking.status]}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col">
          <CardHeader className="gap-1 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookingIcon type={booking.type} />
                  </span>
                  {booking.title}
                </CardTitle>
                <CardDescription className="mt-1">{booking.subtitle}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Ref</p>
                <p className="font-mono text-sm font-semibold">{booking.reference}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                <span>{booking.dates}</span>
              </div>
              {booking.time && (
                <span className="font-medium">{booking.time}</span>
              )}
              <span className="text-muted-foreground">
                {booking.travelers} traveler{booking.travelers !== 1 ? "s" : ""}
              </span>
              {booking.price > 0 && (
                <span className="font-bold text-primary">${booking.price}</span>
              )}
            </div>

            <Separator />

            <BookingTimeline booking={booking} />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3">
                <QrCode className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">Boarding pass</p>
                  <p className="text-[10px] text-muted-foreground">
                    QR placeholder
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="size-3.5" />
                Download invoice
              </Button>
              <Button size="sm" className="rounded-xl" asChild>
                <Link
                  href={`/my-bookings/${booking.id}?data=${encodeURIComponent(JSON.stringify(booking))}`}
                >
                  Manage booking
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

function MyBookingsPage() {
  const [tab, setTab] = useState("upcoming")
  const [bookings, setBookings] = useState<Trip[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoaded(true)
        return
      }

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error(error)
        setLoaded(true)
        return
      }

      setBookings((data ?? []) as Trip[])
      setLoaded(true)
    }

    fetchBookings()
  }, [])

  const upcomingBookings = useMemo(
    () => bookings.filter((trip) => isUpcomingTrip(trip.departure)).map(tripToBooking),
    [bookings]
  )

  const pastBookings = useMemo(
    () => bookings.filter((trip) => !isUpcomingTrip(trip.departure)).map(tripToBooking),
    [bookings]
  )

  const confirmedCount = useMemo(
    () => bookings.filter((trip) => toBookingStatus(trip.booking_status) === "confirmed").length,
    [bookings]
  )

  const pendingCount = useMemo(
    () => bookings.filter((trip) => toBookingStatus(trip.booking_status) === "pending").length,
    [bookings]
  )
  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            Reservations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Flights, hotels, and packages — all in one place
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {!loaded
            ? Array.from({ length: 3 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            : [
            { label: "Upcoming", value: upcomingBookings.length, icon: Plane },
            { label: "Confirmed", value: confirmedCount, icon: Check },
            { label: "Pending", value: pendingCount, icon: Clock },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="rounded-2xl border-border/60">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-11 rounded-xl bg-muted/70 p-1">
            <TabsTrigger value="upcoming" className="rounded-lg px-4">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg px-4">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {!loaded ? (
              <BookingsListSkeleton />
            ) : upcomingBookings.length === 0 ? (
              <Card className="rounded-2xl border-dashed py-12 text-center">
                <CardContent>
                  <p className="font-medium">No upcoming bookings</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Book a flight from your dashboard to see it here
                  </p>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {!loaded ? (
              <BookingsListSkeleton />
            ) : pastBookings.length === 0 ? (
              <Card className="rounded-2xl border-dashed py-12 text-center">
                <CardContent>
                  <p className="font-medium">No past bookings</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Completed trips will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

export default MyBookingsPage

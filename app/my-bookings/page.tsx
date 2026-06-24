"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type Booking,
  type BookingStatus,
} from "@/lib/mockBookingsPage"
import {
  isUpcomingTrip,
  resolveBookingImage,
  tripToBooking,
  type Trip,
} from "@/lib/tripBooking"
import { cn } from "@/lib/utils"

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

function BookingsLoadingView() {
  const t = useTranslations("bookings")

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-11 w-64 rounded-xl" />
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 py-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          {t("loading")}
        </div>
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    </div>
  )
}

function statusBadgeClass(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
    case "pending":
      return "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400"
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20"
  }
}

function buildBookingHref(booking: Booking) {
  const imageSrc = resolveBookingImage(booking)
  return `/my-bookings/${booking.id}?data=${encodeURIComponent(JSON.stringify(booking))}&image=${encodeURIComponent(imageSrc)}`
}

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

function BookingCard({ booking }: { booking: Booking }) {
  const t = useTranslations("bookings")
  const tCommon = useTranslations("common")
  const tStatus = useTranslations("status")
  const detailHref = buildBookingHref(booking)
  const imageSrc = resolveBookingImage(booking)

  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <Link
          href={detailHref}
          className="relative h-36 w-full shrink-0 sm:h-auto sm:w-44"
        >
          <AppImage
            src={imageSrc}
            alt={booking.title}
            className="size-full object-cover"
          />
          <Badge
            className={cn(
              "absolute top-3 left-3 border backdrop-blur-sm",
              statusBadgeClass(booking.status)
            )}
          >
            {tStatus(booking.status)}
          </Badge>
        </Link>

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
                <p className="text-xs text-muted-foreground">{tCommon("ref")}</p>
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
                {t("travelerCount", { count: booking.travelers })}
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
                  <p className="text-xs font-medium">{t("boardingPass")}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("qrPlaceholder")}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="size-3.5" />
                {t("downloadInvoice")}
              </Button>
              <Button size="sm" className="rounded-xl" asChild>
                <Link href={detailHref}>{t("manageBooking")}</Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

function EmptyBookings({ message }: { message: string }) {
  return (
    <Card className="border-dashed py-12 text-center">
      <CardContent>
        <Plane className="mx-auto size-10 text-muted-foreground/60" />
        <p className="mt-3 font-medium">{message}</p>
      </CardContent>
    </Card>
  )
}

function MyBookingsPage() {
  const t = useTranslations("bookings")
  const tCommon = useTranslations("common")
  const tTimeline = useTranslations("bookingTimeline")
  const [tab, setTab] = useState("upcoming")
  const [upcoming, setUpcoming] = useState<Booking[]>([])
  const [past, setPast] = useState<Booking[]>([])
  const [loaded, setLoaded] = useState(false)

  const tripLabels = useMemo(
    () => ({
      roundTrip: tCommon("roundTrip"),
      oneWay: tCommon("oneWay"),
      booked: tTimeline("booked"),
      confirmed: tTimeline("confirmed"),
      awaitingConfirmation: tTimeline("awaitingConfirmation"),
      returnLabel: tTimeline("return"),
      departure: tTimeline("departure"),
      cancelled: tTimeline("cancelled"),
    }),
    [tCommon, tTimeline]
  )

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user.id)

        if (error) {
          console.error(error)
          return
        }

        const rows = (data ?? []) as Trip[]
        setUpcoming(
          rows
            .filter((trip) => isUpcomingTrip(trip.departure))
            .map((row) => tripToBooking(row, tripLabels))
        )
        setPast(
          rows
            .filter((trip) => !isUpcomingTrip(trip.departure))
            .map((row) => tripToBooking(row, tripLabels))
        )
      } finally {
        setLoaded(true)
      }
    }

    void fetchBookings()
  }, [tripLabels])

  const bookings = useMemo(() => [...upcoming, ...past], [upcoming, past])

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length
  const pendingCount = bookings.filter((b) => b.status === "pending").length

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {!loaded ? (
          <BookingsLoadingView />
        ) : (
          <>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: t("upcoming"), value: upcoming.length, icon: Plane },
            { label: t("confirmed"), value: confirmedCount, icon: Check },
            { label: t("pending"), value: pendingCount, icon: Clock },
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
              {t("upcoming")} ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg px-4">
              {t("past")} ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcoming.length === 0 ? (
              <EmptyBookings message={t("noUpcoming")} />
            ) : (
              upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {past.length === 0 ? (
              <EmptyBookings message={t("noPast")} />
            ) : (
              past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
          </>
        )}
      </div>
    </DashboardShell>
  )
}

export default MyBookingsPage

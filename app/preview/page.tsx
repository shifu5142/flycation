"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CalendarDays, Eye, Lock, MapPin, Sparkles } from "lucide-react"

import { AiTripPlanResults } from "@/components/AiTripPlanResults"
import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { buildGuestPreviewPlan } from "@/lib/guestPreviewTrip"
import { findCountryLocation } from "@/lib/countries"
import { formatFlightDate } from "@/components/FlightDateRangePicker"

function PreviewContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""
  const departure =
    searchParams.get("departure") ?? searchParams.get("date") ?? ""
  const returnDate = searchParams.get("returnDate") ?? ""

  const plan = useMemo(
    () => buildGuestPreviewPlan({ from, to, departure, returnDate }),
    [from, to, departure, returnDate]
  )

  const registerHref = `/register?${new URLSearchParams({
    ...(from && { from }),
    ...(to && { to }),
    ...(departure && { departure }),
    ...(returnDate && { returnDate }),
  }).toString()}`

  const loginHref = `/login?${new URLSearchParams({
    ...(from && { from }),
    ...(to && { to }),
    ...(departure && { departure }),
    ...(returnDate && { returnDate }),
  }).toString()}`

  const formatLocation = (value: string) =>
    findCountryLocation(value)?.country ?? value

  const displayDeparture = departure ? formatFlightDate(departure) : "Not set"
  const displayReturn = returnDate ? formatFlightDate(returnDate) : "—"

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/start">
          <ArrowLeft className="size-4" />
          Back to planning
        </Link>
      </Button>

      <Card className="rounded-2xl border-primary/20 bg-primary/5">
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-col gap-3 border-b border-primary/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold tracking-tight">
              This is a demo page for guest users
            </p>
            <Button asChild className="shrink-0 rounded-lg shadow-sm">
              <Link href={loginHref}>Log in to create your real trip</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5" />
                From
              </p>
              <p className="mt-1 text-sm font-semibold">
                {from ? formatLocation(from) : "Not set"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5" />
                To
              </p>
              <p className="mt-1 text-sm font-semibold">
                {to ? formatLocation(to) : "Not set"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Departure
              </p>
              <p className="mt-1 text-sm font-semibold">{displayDeparture}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Return
              </p>
              <p className="mt-1 text-sm font-semibold">{displayReturn}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="rounded-full">
                <Eye className="size-3" />
                Preview mode
              </Badge>
              <p className="font-semibold">Sample AI-generated trip preview</p>
              <p className="text-sm text-muted-foreground">
                This is a read-only demo. Sign up to save trips and unlock the full
                AI planner.
              </p>
            </div>
            <Button asChild className="shrink-0 rounded-lg">
              <Link href={registerHref}>
                <Sparkles className="size-4" />
                Sign up for full itinerary
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AiTripPlanResults plan={plan} readOnly heroImageFit="contain" />

      <Card className="rounded-2xl border-border/60">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Lock className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">Want the full personalized plan?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a free account to unlock the complete AI trip planner, save
              trips, and access your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-lg">
              <Link href={registerHref}>Create free account</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-lg">
              <Link href="/examples">Browse example trips</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PreviewPage() {
  return (
    <GuestLayout showBanner={false}>
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
            Loading preview…
          </div>
        }
      >
        <PreviewContent />
      </Suspense>
    </GuestLayout>
  )
}

export default PreviewPage

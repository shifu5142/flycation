"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, Lock, Sparkles } from "lucide-react"

import { AiTripPlanResults } from "@/components/AiTripPlanResults"
import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { buildGuestPreviewPlan } from "@/lib/guestPreviewTrip"

function PreviewContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""
  const date = searchParams.get("date") ?? ""

  const plan = useMemo(
    () => buildGuestPreviewPlan({ from, to, date }),
    [from, to, date]
  )

  const registerHref = `/register?${new URLSearchParams({
    ...(from && { from }),
    ...(to && { to }),
    ...(date && { date }),
  }).toString()}`

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/start">
          <ArrowLeft className="size-4" />
          Back to planning
        </Link>
      </Button>

      <Card className="rounded-2xl border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
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
        </CardContent>
      </Card>

      <div className="relative">
        <AiTripPlanResults plan={plan} readOnly />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

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

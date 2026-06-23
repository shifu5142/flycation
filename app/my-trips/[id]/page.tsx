"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CalendarDays, MapPin, Sparkles, Trash2 } from "lucide-react"

import { AiTripPlanResults } from "@/components/AiTripPlanResults"
import { DashboardShell } from "@/components/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { AiGeneratedTripPlan } from "@/lib/aiGeneratedTripPlanTypes"
import { supabase } from "@/app/services/supabase/client"
import {
  createMockTripsPlanRow,
  toAiGeneratedTripPlan,
  type TripsPlanRow,
} from "@/lib/tripsPlan"
import { fetchCountryImageUrl } from "@/lib/fetchCountryImage"
import { isPlaceholderImageUrl } from "@/lib/tripBooking"
import { useToast } from "@/components/ToastProvider"

function TripPlanSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-40 rounded-lg bg-muted" />
      <div className="h-56 rounded-2xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 rounded-2xl bg-muted" />
        <div className="h-40 rounded-2xl bg-muted" />
        <div className="h-40 rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

function MyTripPlanPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const tripId = params.id
  const cardImageParam = searchParams.get("image")

  const [loading, setLoading] = useState(true)
  const [tripPlan, setTripPlan] = useState<TripsPlanRow | null>(null)
  const [plan, setPlan] = useState<AiGeneratedTripPlan | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
    const handleDeleteTripPlan = async () => {
    const { error } = await supabase
      .from("trips_plan")
      .delete()
      .eq("id", tripId)
      if (error) {
        toast("Failed to delete trip plan", "info")
        return
      }
      setTimeout(() => {
        toast("Trip plan deleted", "success")
        router.push("/my-trips")
      }, 1000)
    
  }
  useEffect(() => {
    if (!tripId) return

    async function fetchTripPlan() {
      setLoading(true)

      try {
        const { data: tripData, error } = await supabase
          .from("trips_plan")
          .select("*")
          .eq("id", tripId)
          .single()
        
        if (error) throw error
        setTripPlan(tripData as TripsPlanRow)

        const nextPlan = toAiGeneratedTripPlan(tripData as TripsPlanRow)
        const cardImage =
          cardImageParam?.trim() && !isPlaceholderImageUrl(cardImageParam)
            ? cardImageParam
            : null

        if (cardImage) {
          nextPlan.hero.image = cardImage
        } else if (
          !nextPlan.hero.image?.trim() ||
          isPlaceholderImageUrl(nextPlan.hero.image)
        ) {
          const imageUrl = await fetchCountryImageUrl(
            nextPlan.hero.country,
            nextPlan.hero.destination
          )
          if (imageUrl) nextPlan.hero.image = imageUrl
        }

        setPlan(nextPlan)
      } catch (error) {
        console.error("Failed to load trip plan:", error)
        setTripPlan(null)
        setPlan(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTripPlan()
  }, [tripId, cardImageParam])

  const displayPlan = useMemo(() => {
    if (!plan) return null
    if (!cardImageParam?.trim() || isPlaceholderImageUrl(cardImageParam)) {
      return plan
    }
    return {
      ...plan,
      hero: { ...plan.hero, image: cardImageParam },
    }
  }, [plan, cardImageParam])

  const createdLabel = tripPlan?.created_at
    ? new Date(tripPlan.created_at).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" size="sm" className="rounded-xl" asChild>
            <Link href="/my-trips">
              <ArrowLeft className="size-4" />
              Back to my trips
            </Link>
          </Button>
          {tripPlan && (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              <Sparkles className="size-3" />
              AI trip plan
            </Badge>
          )}
        </div>

        {loading ? (
          <TripPlanSkeleton />
        ) : !tripPlan || !displayPlan ? (
          <Card className="border-dashed py-16 text-center">
            <CardContent>
              <MapPin className="mx-auto size-10 text-muted-foreground/60" />
              <p className="mt-3 text-lg font-semibold">Trip not found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This plan may have been removed or the link is invalid.
              </p>
              <Button className="mt-6 rounded-xl" asChild>
                <Link href="/my-trips">Return to my trips</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-6 sm:p-8">
              <div className="relative z-10 space-y-3">
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Trip details
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {tripPlan.destination}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    · {tripPlan.country}
                  </span>
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {tripPlan.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary" className="rounded-full">
                    <CalendarDays className="size-3" />
                    {tripPlan.duration}
                  </Badge>
                  {createdLabel && (
                    <Badge variant="outline" className="rounded-full">
                      Created {createdLabel}
                    </Badge>
                  )}
                </div>
              </div>
              <Sparkles className="pointer-events-none absolute -right-2 -bottom-2 size-32 text-primary/10" />
            </section>

            <Separator />

            <AiTripPlanResults plan={displayPlan} readOnly />

            <div className="flex justify-end">
              <Button
                variant="destructive"
                className="rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-destructive/30 hover:brightness-110 active:translate-y-0 active:shadow-md"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete trip plan
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent
          overlayClassName="bg-black/60 backdrop-blur-sm"
          className="gap-0 overflow-hidden border-destructive/20 p-0 sm:max-w-lg"
        >
          <div className="border-b border-destructive/15 bg-destructive/5 px-6 py-5">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15">
                <Trash2 className="size-6 text-destructive" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                Delete trip plan?
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="px-6 py-6">
            <DialogDescription asChild>
              <p className="text-base leading-relaxed text-foreground">
                Delete this trip plan permanently? You won&apos;t be able to
                recover it after this.
              </p>
            </DialogDescription>
          </div>

          <DialogFooter className="gap-3 border-t border-border/60 bg-muted/40 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="min-w-24 rounded-xl"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="min-w-24 rounded-xl transition-all duration-300 hover:brightness-110"
              onClick={() => {
                setDeleteConfirmOpen(false)
                void handleDeleteTripPlan()
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
    
  )
}

export default MyTripPlanPage

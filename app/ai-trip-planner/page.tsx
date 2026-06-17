"use client"

import { useRef, useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"

import { AiTripPlanResults } from "@/components/AiTripPlanResults"
import { DashboardShell } from "@/components/Sidebar"
import { TripIntakeAssistant } from "@/components/TripIntakeAssistant"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { AiGeneratedTripPlan } from "@/lib/aiGeneratedTripPlanTypes"
import {
  INITIAL_TRIP_INTAKE,
  isIntakeComplete,
  type TripIntakeData,
} from "@/lib/aiTripIntake"

function AiTripPlannerPage() {
  const [tripAnswers, setTripAnswers] =
    useState<TripIntakeData>(INITIAL_TRIP_INTAKE)
  const [generating, setGenerating] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] =
    useState<AiGeneratedTripPlan | null>(null)
  const planRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!isIntakeComplete(tripAnswers)) return

    setGenerating(true)
    setShowPlan(false)
    setGeneratedPlan(null)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripAnswers }),
      })

      const data = (await res.json()) as AiGeneratedTripPlan & {
        error?: string
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate trip plan")
      }

      setGeneratedPlan(data)
      setShowPlan(true)
    } catch (error) {
      console.error("Trip generation error:", error)
      setShowPlan(false)
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setTripAnswers(INITIAL_TRIP_INTAKE)
    setShowPlan(false)
    setGeneratedPlan(null)
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-2">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="size-3" />
              Powered by AI
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Trip Planner
            </h1>
            <p className="text-muted-foreground">
              Your travel assistant interviews you first, then builds a complete
              personalized itinerary from your answers.
            </p>
          </div>
          <Sparkles className="pointer-events-none absolute -right-2 -bottom-2 size-32 text-primary/10" />
        </section>

        <TripIntakeAssistant
          tripAnswers={tripAnswers}
          setTripAnswers={setTripAnswers}
          generating={generating}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />

        {showPlan && generatedPlan && !generating && (
          <button
            type="button"
            onClick={() =>
              planRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="-mt-12 mx-auto flex w-full flex-col items-center gap-1 pb-1 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Scroll to your generated plan"
          >
            <span className="text-xs font-medium">Your plan is ready</span>
            <ChevronDown className="size-6 animate-bounce" />
          </button>
        )}

        {showPlan && generatedPlan && !generating && (
          <div ref={planRef} className="space-y-6 scroll-mt-6">
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                Your generated plan
              </span>
              <Separator className="flex-1" />
            </div>
            <AiTripPlanResults plan={generatedPlan} />
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default AiTripPlannerPage

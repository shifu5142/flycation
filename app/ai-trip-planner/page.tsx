"use client"

import { useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Save, Sparkles } from "lucide-react"

import { AiTripPlanResults } from "@/components/AiTripPlanResults"
import { DashboardShell } from "@/components/Sidebar"
import {
  TripIntakeAssistant,
  type TripIntakeAssistantHandle,
} from "@/components/TripIntakeAssistant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { AiGeneratedTripPlan } from "@/lib/aiGeneratedTripPlanTypes"
import {
  INITIAL_TRIP_INTAKE,
  isIntakeComplete,
  type TripIntakeData,
} from "@/lib/aiTripIntake"
import { toTripsPlanInsert } from "@/lib/tripsPlan"
import { supabase } from "@/app/services/supabase/client"
import { useToast } from "@/components/ToastProvider"

function AiTripPlannerPage() {
  const { toast } = useToast()
  const t = useTranslations("aiTripPlanner")
  const locale = useLocale()
  const [tripAnswers, setTripAnswers] =
    useState<TripIntakeData>(INITIAL_TRIP_INTAKE)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] =
    useState<AiGeneratedTripPlan | null>(null)
  const planRef = useRef<HTMLDivElement>(null)
  const intakeRef = useRef<TripIntakeAssistantHandle>(null)

  const handleGenerate = async () => {
    if (!isIntakeComplete(tripAnswers)) return

    setGenerating(true)
    setGenerateError(false)
    setShowPlan(false)
    setGeneratedPlan(null)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripAnswers, locale }),
      })

      const data = (await res.json()) as AiGeneratedTripPlan & {
        error?: string
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate trip plan")
      }
      console.log("Generated plan:", data)
      setGeneratedPlan(data)
      setShowPlan(true)
    } catch (error) {
      console.error("Trip generation error:", error)
      setGenerateError(true)
      setShowPlan(false)
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveTripPlan = async () => {
    if (!generatedPlan) return

    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user
      if (!user) {
        toast("You must be logged in to save", "info")
        return
      }

      const { error, data: tripData } = await supabase
        .from("trips_plan")
        .insert(toTripsPlanInsert(generatedPlan, user.id))
        .select()
        .single()

      if (error) {
        toast("Failed to save trip plan")
        return
      }

      toast("Trip plan saved", "success")
      console.log("Trip data:", tripData)
    } catch (error) {
      console.error("Failed to save trip plan:", error)
      toast("Failed to save trip plan")
    }
  }

  const handlePlanReset = () => {
    setGenerateError(false)
    setShowPlan(false)
    setGeneratedPlan(null)
  }

  const handleStartOver = () => {
    intakeRef.current?.startOver()
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-2">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="size-3" />
              {t("badge")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Sparkles className="pointer-events-none absolute -right-2 -bottom-2 size-32 text-primary/10" />
        </section>

        <TripIntakeAssistant
          ref={intakeRef}
          tripAnswers={tripAnswers}
          setTripAnswers={setTripAnswers}
          generating={generating}
          generateError={generateError}
          planReady={showPlan && !!generatedPlan && !generating}
          onScrollToPlan={() =>
            planRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          onGenerate={handleGenerate}
          onReset={handlePlanReset}
        />

        {showPlan && generatedPlan && !generating && (
          <div ref={planRef} className="space-y-6 scroll-mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Separator className="flex-1" />
                <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  {t("generatedPlan")}
                </span>
                <Separator className="flex-1" />
              </div>
              <Button
                onClick={() => void handleSaveTripPlan()}
                className="shrink-0 rounded-xl shadow-md shadow-primary/20"
              >
                <Save className="size-4" />
                Save trip
              </Button>
            </div>
            <AiTripPlanResults
              plan={generatedPlan}
              handleSave={handleSaveTripPlan}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default AiTripPlannerPage

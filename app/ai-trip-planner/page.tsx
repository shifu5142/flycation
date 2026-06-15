"use client"

import { useState } from "react"
import {
  Building2,
  CalendarDays,
  Download,
  Landmark,
  MapPin,
  Moon,
  Plane,
  RefreshCw,
  Save,
  Sparkles,
  Star,
  Sun,
  Sunset,
  TreePine,
  Utensils,
  Wallet,
  Wine,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { TripIntakeAssistant } from "@/components/TripIntakeAssistant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  buildMockPlanFromIntake,
  isIntakeComplete,
  type TripIntakeData,
} from "@/lib/aiTripIntake"
import {
  travelStyleLabels,
  type AiTripPlan,
} from "@/lib/mockAiTripPlan"

function ActivityTypeIcon({
  type,
  className,
}: {
  type: "food" | "nature" | "city" | "nightlife"
  className?: string
}) {
  switch (type) {
    case "food":
      return <Utensils className={className} />
    case "nature":
      return <TreePine className={className} />
    case "nightlife":
      return <Wine className={className} />
    default:
      return <Landmark className={className} />
  }
}

function PeriodIcon({ period }: { period: string }) {
  if (period === "Morning") return <Sun className="size-3.5 text-amber-500" />
  if (period === "Afternoon") return <Sunset className="size-3.5 text-orange-500" />
  return <Moon className="size-3.5 text-indigo-500" />
}

function TripPlanResults({ plan }: { plan: AiTripPlan }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {/* Overview */}
      <Card className="overflow-hidden rounded-2xl border-border/60 shadow-md">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <div className="relative h-48 md:h-auto md:min-h-[220px]">
            <img
              src={plan.image}
              alt={plan.destination}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
          </div>
          <CardHeader className="flex flex-col justify-center gap-3 p-6">
            <Badge className="w-fit rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-3" />
              AI-generated plan
            </Badge>
            <CardTitle className="text-2xl">
              {plan.destination}
              <span className="font-normal text-muted-foreground">
                {" "}
                · {plan.country}
              </span>
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {plan.summary}
            </CardDescription>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline">
                <CalendarDays className="size-3" />
                {plan.duration}
              </Badge>
              <Badge variant="outline">
                <Wallet className="size-3" />~${plan.budgetTotal}
              </Badge>
              <Badge variant="secondary">
                {travelStyleLabels[plan.travelStyle]}
              </Badge>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Itinerary */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <CalendarDays className="size-5 text-primary" />
          Day-by-day itinerary
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {plan.itinerary.map((day) => (
            <Card
              key={day.day}
              className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {day.day}
                  </span>
                  <CardTitle className="text-base">{day.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {day.slots.map((slot) => (
                  <div
                    key={`${day.day}-${slot.period}`}
                    className="flex gap-3 rounded-xl bg-muted/40 p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                      <ActivityTypeIcon
                        type={slot.icon}
                        className="size-4 text-primary"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <PeriodIcon period={slot.period} />
                        {slot.period}
                      </p>
                      <p className="mt-0.5 text-sm">{slot.activity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hotels */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="size-5 text-primary" />
            Hotel suggestions
          </h2>
          <div className="space-y-3">
            {plan.hotels.map((hotel) => (
              <Card
                key={hotel.name}
                className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-24 w-24 shrink-0 object-cover sm:h-28 sm:w-28"
                  />
                  <CardContent className="flex flex-1 flex-col justify-center gap-1 p-4">
                    <p className="font-semibold">{hotel.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {hotel.location}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        {hotel.rating}
                      </span>
                      <span className="font-bold text-primary">
                        ${hotel.pricePerNight}
                        <span className="text-xs font-normal text-muted-foreground">
                          /night
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Flight */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Plane className="size-5 text-primary" />
            Suggested flight
          </h2>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{plan.flight.airline}</p>
                <Badge variant="outline">{plan.flight.stops}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 p-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{plan.flight.departure}</p>
                  <p className="text-xs text-muted-foreground">Depart</p>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <Plane className="size-4 rotate-90 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    {plan.flight.duration}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{plan.flight.arrival}</p>
                  <p className="text-xs text-muted-foreground">Arrive</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">
                  Estimated fare
                </span>
                <span className="text-xl font-bold text-primary">
                  ${plan.flight.price}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Budget breakdown */}
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Wallet className="size-5 text-primary" />
            Budget breakdown
          </h2>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="space-y-3 p-5">
              {(
                [
                  { label: "Flights", value: plan.budget.flights, icon: Plane },
                  {
                    label: "Hotels",
                    value: plan.budget.hotels,
                    icon: Building2,
                  },
                  { label: "Food", value: plan.budget.food, icon: Utensils },
                  {
                    label: "Activities",
                    value: plan.budget.activities,
                    icon: Sparkles,
                  },
                ] as const
              ).map((row) => {
                const Icon = row.icon
                const pct = Math.round((row.value / plan.budgetTotal) * 100)
                return (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="size-3.5 text-muted-foreground" />
                        {row.label}
                      </span>
                      <span className="font-semibold">${row.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total estimate</span>
                <span className="text-lg text-primary">${plan.budgetTotal}</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Activities */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="size-5 text-primary" />
          Things to do
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plan.activities.map((activity) => (
            <Card
              key={activity.name}
              className="rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ActivityTypeIcon type={activity.type} className="size-4" />
                </div>
                <div>
                  <p className="font-medium leading-snug">{activity.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.duration}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {activity.price === 0 ? "Free" : `$${activity.price}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Actions */}
      <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">Happy with this plan?</p>
            <p className="text-sm text-muted-foreground">
              Save, regenerate, or export your itinerary
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">
              <RefreshCw className="size-4" />
              Regenerate plan
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Download className="size-4" />
              Export PDF
            </Button>
            <Button className="rounded-xl shadow-md shadow-primary/20">
              <Save className="size-4" />
              Save trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AiTripPlannerPage() {
  const [generating, setGenerating] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<AiTripPlan | null>(null)

  const handleGenerate = (data: TripIntakeData) => {
    if (!isIntakeComplete(data)) return
    setGenerating(true)
    setShowPlan(false)
    setTimeout(() => {
      setGeneratedPlan(buildMockPlanFromIntake(data))
      setGenerating(false)
      setShowPlan(true)
    }, 1500)
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
          generating={generating}
          onGenerate={handleGenerate}
          onReset={() => {
            setShowPlan(false)
            setGeneratedPlan(null)
          }}
        />

        {showPlan && generatedPlan && !generating && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                Your generated plan
              </span>
              <Separator className="flex-1" />
            </div>
            <TripPlanResults plan={generatedPlan} />
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default AiTripPlannerPage

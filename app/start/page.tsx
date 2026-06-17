"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react"

import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const steps = ["From", "To", "Date", "Preview"] as const

function StartPlanningPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)

  const goNext = () => {
    if (step === 0 && !from.trim()) return
    if (step === 1 && !to.trim()) return
    if (step === 2 && !date) return
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setLoading(true)
    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      date,
    })
    router.push(`/preview?${params.toString()}`)
  }

  const goBack = () => setStep((s) => Math.max(0, s - 1))

  return (
    <GuestLayout bannerVariant="planner">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-3 rounded-full">
            <Sparkles className="size-3" />
            Guest preview
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Start planning</h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few questions — no account needed for the preview
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          {steps.map((label, i) => (
            <div
              key={label}
              className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <Card className="rounded-2xl border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle>{steps[step]}</CardTitle>
            <CardDescription>
              {step === 0 && "Where are you flying from?"}
              {step === 1 && "Where do you want to go?"}
              {step === 2 && "When would you like to travel?"}
              {step === 3 && "Ready to see your trip preview"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-2">
                <Label htmlFor="start-from">From</Label>
                <Input
                  id="start-from"
                  placeholder="New York"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="start-to">To</Label>
                <Input
                  id="start-to"
                  placeholder="Paris"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="start-date">Date</Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg pr-10"
                  />
                  <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-primary" />
                  <span>
                    <strong>{from}</strong> → <strong>{to}</strong>
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {date}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  You&apos;ll see a sample AI itinerary preview. Create a free
                  account to generate your full personalized plan.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg"
                  onClick={goBack}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                className="flex-1 rounded-lg"
                onClick={goNext}
                disabled={
                  loading ||
                  (step === 0 && !from.trim()) ||
                  (step === 1 && !to.trim()) ||
                  (step === 2 && !date)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading preview…
                  </>
                ) : step === 3 ? (
                  <>
                    View preview
                    <ArrowRight className="size-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>

            {step === 3 && (
              <Button variant="link" asChild className="w-full">
                <Link href={`/register?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}>
                  Sign up to generate full itinerary
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </GuestLayout>
  )
}

export default StartPlanningPage

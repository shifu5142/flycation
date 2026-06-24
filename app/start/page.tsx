"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react"

import { AirportSearchInput } from "@/components/AirportSearchInput"
import { FlightDateRangePicker } from "@/components/FlightDateRangePicker"
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
import { findCountryLocation } from "@/lib/countries"
import { formatFlightDate } from "@/components/FlightDateRangePicker"

const stepKeys = ["from", "to", "date", "preview"] as const

function formatLocation(value: string) {
  return findCountryLocation(value)?.country ?? value
}

function StartPlanningPage() {
  const router = useRouter()
  const t = useTranslations("start")
  const tCommon = useTranslations("common")
  const [step, setStep] = useState(0)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)

  const goNext = () => {
    if (step === 0 && !from.trim()) return
    if (step === 1 && !to.trim()) return
    if (step === 2 && !date) return
    if (step < stepKeys.length - 1) {
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
            {tCommon("backToHome")}
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-3 rounded-full">
            <Sparkles className="size-3" />
            {t("badge")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few questions — no account needed for the preview
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          {stepKeys.map((labelKey, i) => (
            <div
              key={labelKey}
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

        <Card className="overflow-visible rounded-2xl border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle>{tCommon(stepKeys[step])}</CardTitle>
            <CardDescription>
              {step === 0 && t("fromPrompt")}
              {step === 1 && t("toPrompt")}
              {step === 2 && t("datePrompt")}
              {step === 3 && t("readyPrompt")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 overflow-visible">
            {step === 0 && (
              <AirportSearchInput
                id="start-from"
                label={tCommon("from")}
                value={from}
                onChange={setFrom}
                placeholder={t("selectOrigin")}
                size="lg"
                className="rounded-lg"
              />
            )}

            {step === 1 && (
              <AirportSearchInput
                id="start-to"
                label={tCommon("to")}
                value={to}
                onChange={setTo}
                placeholder={t("selectDestination")}
                size="lg"
                className="rounded-lg"
              />
            )}

            {step === 2 && (
              <FlightDateRangePicker
                tripType="oneway"
                departure={date}
                returnDate=""
                onDepartureChange={setDate}
                onReturnChange={() => {}}
                label={tCommon("date")}
              />
            )}

            {step === 3 && (
              <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-primary" />
                  <span>
                    <strong>{formatLocation(from)}</strong> →{" "}
                    <strong>{formatLocation(to)}</strong>
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {formatFlightDate(date)}
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
                  {tCommon("back")}
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
                    {t("loadingPreview")}
                  </>
                ) : step === 3 ? (
                  <>
                    {t("viewPreview")}
                    <ArrowRight className="size-4" />
                  </>
                ) : (
                  <>
                    {tCommon("continue")}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>

            {step === 3 && (
              <Button variant="link" asChild className="w-full">
                <Link
                  href={`/register?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`}
                >
                  {t("signUpGenerate")}
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

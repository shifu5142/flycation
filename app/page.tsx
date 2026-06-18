"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowRight,
  Map,
  Plane,
  Sparkles,
  Wallet,
  Wand2,
} from "lucide-react"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AirportSearchInput } from "@/components/AirportSearchInput"
import { FlightDateRangePicker } from "@/components/FlightDateRangePicker"
import { ExampleTripCard } from "@/components/ExampleTripCard"
import { AppImage } from "@/components/AppImage"
import { useToast } from "@/components/ToastProvider"
import { Link, useRouter } from "@/i18n/navigation"
import { mockTrips } from "@/lib/mockTrips"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const HERO_IMAGE = "/hero-travel.png"

type TripType = "oneway" | "roundtrip"

const featureConfig = [
  { key: "ai" as const, icon: Wand2 },
  { key: "flights" as const, icon: Plane },
  { key: "itineraries" as const, icon: Map },
]

function LandingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("home")
  const tCommon = useTranslations("common")
  const tDashboard = useTranslations("dashboard")
  const [tripType, setTripType] = useState<TripType>("roundtrip")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")

  const handleGenerate = () => {
    if (!from || !to) {
      toast(t("fillFromTo"), "info")
      return
    }
    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      ...(departure && { departure }),
      ...(returnDate && { returnDate }),
    })
    router.push(`/preview?${params.toString()}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 min-h-full">
          <AppImage
            src={HERO_IMAGE}
            alt={t("heroImageAlt")}
            fill
            fetchPriority="high"
            loading="eager"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-1.5 text-sm text-white shadow-sm backdrop-blur-sm [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
              <Sparkles className="size-3.5" />
              {t("badge")}
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] sm:text-lg">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="rounded-lg px-6">
                <Link href="/register">
                  {t("startPlanning")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-lg border-border/80 bg-white/90 px-6 backdrop-blur-sm"
              >
                <Link href="/login">{t("viewDashboard")}</Link>
              </Button>
            </div>
          </div>

          <Card className="mx-auto mt-12 max-w-3xl overflow-visible rounded-2xl border-border/60 bg-white shadow-xl sm:mt-14">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl">{t("searchTitle")}</CardTitle>
                  <CardDescription>{t("searchDescription")}</CardDescription>
                </div>
                <Tabs
                  value={tripType}
                  onValueChange={(value) => {
                    const next = value as TripType
                    setTripType(next)
                    if (next === "oneway") setReturnDate("")
                  }}
                >
                  <TabsList className="h-10 rounded-xl bg-muted/70 p-1">
                    <TabsTrigger value="oneway" className="rounded-lg px-3 text-sm">
                      {tDashboard("direct")}
                    </TabsTrigger>
                    <TabsTrigger value="roundtrip" className="rounded-lg px-3 text-sm">
                      {tDashboard("roundTrip")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="overflow-visible">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AirportSearchInput
                  id="home-from"
                  label={tCommon("from")}
                  value={from}
                  onChange={setFrom}
                  placeholder="Select origin"
                  size="lg"
                  className="rounded-lg bg-white"
                />
                <AirportSearchInput
                  id="home-to"
                  label={tCommon("to")}
                  value={to}
                  onChange={setTo}
                  placeholder="Select destination"
                  size="lg"
                  className="rounded-lg bg-white"
                />
                <div className={tripType === "roundtrip" ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <FlightDateRangePicker
                    tripType={tripType}
                    departure={departure}
                    returnDate={returnDate}
                    onDepartureChange={setDeparture}
                    onReturnChange={setReturnDate}
                    label={tCommon("date")}
                  />
                </div>
              </div>
              <Button
                className="mt-6 w-full rounded-lg"
                size="lg"
                onClick={handleGenerate}
              >
                <>
                  <Sparkles className="size-4" />
                  {t("generateTrip")}
                </>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {t("featuresTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("featuresSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {featureConfig.map(({ key, icon: Icon }) => (
              <Card
                key={key}
                className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">
                    {t(`features.${key}.title`)}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {t(`features.${key}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="trips"
        className="border-y border-border/60 bg-muted/20 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("examplesTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("examplesSubtitle")}</p>
            </div>
            <Link
              href="/examples"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              {t("seeAllTrips")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockTrips.map((trip) => (
              <ExampleTripCard key={trip.id} trip={trip} guest />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-16 sm:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <Wallet className="size-7 text-primary-foreground" />
            </span>
            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-primary-foreground/80">
              {t("ctaSubtitle")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="mt-8 rounded-lg px-8"
            >
              <Link href="/register">{t("createFreeAccount")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

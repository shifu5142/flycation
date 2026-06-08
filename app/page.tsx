"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Map,
  Plane,
  Sparkles,
  Wallet,
  Wand2,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ExampleTripCard } from "@/components/ExampleTripCard"
import { useToast } from "@/components/ToastProvider"
import { mockTrips } from "@/lib/mockTrips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const HERO_IMAGE = "/hero-travel.png"

const features = [
  {
    icon: Wand2,
    title: "AI trip planning",
    description:
      "Describe your dream trip and let AI build a complete itinerary in seconds.",
  },
  {
    icon: Plane,
    title: "Cheap flights",
    description:
      "Compare flight options across airlines and find the best deals for your budget.",
  },
  {
    icon: Map,
    title: "Smart itineraries",
    description:
      "Day-by-day plans with activities, restaurants, and local highlights.",
  },
]

function LandingPage() {
  const { toast } = useToast()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    if (!from || !to) {
      toast("Please fill in the From and To fields", "info")
      return
    }
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      toast("Trip generated! Your itinerary is ready.")
    }, 2500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero — background matches full.png mockup */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 min-h-full">
          <Image
            src={HERO_IMAGE}
            alt="Aerial view of tropical coastline from airplane"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              AI travel planner
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Plan your <span className="text-primary">Flycation</span> in seconds
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us where you want to go. We&apos;ll handle flights, hotels, and
              day-by-day itineraries — all powered by AI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="rounded-lg px-6">
                <Link href="/register">
                  Start planning
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-lg border-border/80 bg-white/90 px-6 backdrop-blur-sm"
              >
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Search card */}
          <Card className="mx-auto mt-12 max-w-3xl rounded-2xl border-border/60 bg-white shadow-xl sm:mt-14">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Where to next?</CardTitle>
              <CardDescription>
                Enter your trip details and generate a personalized plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="New York"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Paris"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="rounded-lg bg-white pr-10"
                    />
                    <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <Button
                className="mt-6 w-full rounded-lg"
                size="lg"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    AI generating trip…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate trip
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to travel smarter
            </h2>
            <p className="mt-3 text-muted-foreground">
              One platform for planning, booking, and exploring
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Example trips */}
      <section id="trips" className="border-y border-border/60 bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Example trips
              </h2>
              <p className="mt-2 text-muted-foreground">
                Get inspired by these AI-generated itineraries
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              See all trips
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockTrips.map((trip) => (
              <ExampleTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-16 sm:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <Wallet className="size-7 text-primary-foreground" />
            </span>
            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready for your next adventure?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-primary-foreground/80">
              Join thousands of travelers planning smarter with Flycation.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="mt-8 rounded-lg px-8"
            >
              <Link href="/register">Create free account</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

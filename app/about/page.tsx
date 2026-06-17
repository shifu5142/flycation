import Link from "next/link"
import { ArrowLeft, Plane, Sparkles, Users } from "lucide-react"

import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const values = [
  {
    icon: Sparkles,
    title: "AI-first planning",
    description:
      "Describe your trip and get a complete itinerary with flights, hotels, and activities.",
  },
  {
    icon: Plane,
    title: "Built for travelers",
    description:
      "Flycation helps you go from idea to itinerary in minutes, not hours of research.",
  },
  {
    icon: Users,
    title: "For every style",
    description:
      "Budget backpackers, luxury seekers, and families — plans adapt to how you travel.",
  },
]

function AboutPage() {
  return (
    <GuestLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>

        <Badge variant="secondary" className="mb-4 rounded-full">
          About Flycation
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Travel planning, reimagined</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Flycation is an AI-powered travel planner that turns your destination
          dreams into actionable itineraries. We combine smart recommendations
          with a simple experience so you can focus on the adventure — not the
          spreadsheets.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="rounded-2xl border-border/60">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-bold">Ready to plan your Flycation?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Try the guest preview or create a free account for the full experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="secondary" asChild className="rounded-lg">
              <Link href="/start">Start planning</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-lg border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/register">Create free account</Link>
            </Button>
          </div>
        </div>
      </div>
    </GuestLayout>
  )
}

export default AboutPage

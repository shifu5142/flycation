import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

import { ExampleTripCard } from "@/components/ExampleTripCard"
import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockTrips } from "@/lib/mockTrips"

function ExamplesPage() {
  return (
    <GuestLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full">
              <BookOpen className="size-3" />
              Read-only
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Example itineraries
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Explore AI-generated sample trips. No login required — preview only.
              Sign up to create and save your own.
            </p>
          </div>
          <Button asChild className="rounded-lg">
            <Link href="/start">Start planning</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockTrips.map((trip) => (
            <ExampleTripCard key={trip.id} trip={trip} guest />
          ))}
        </div>
      </div>
    </GuestLayout>
  )
}

export default ExamplesPage

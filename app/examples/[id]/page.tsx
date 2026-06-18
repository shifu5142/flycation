import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye,
  MapPin,
  Star,
} from "lucide-react"

import { FlightCard } from "@/components/FlightCard"
import { AppImage } from "@/components/AppImage"
import { GuestLayout } from "@/components/GuestLayout"
import { ItineraryDay } from "@/components/ItineraryDay"
import { getFlightsByTripId } from "@/lib/mockFlights"
import { getTripById } from "@/lib/mockTrips"
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

interface GuestExampleTripPageProps {
  params: Promise<{ id: string }>
}

async function GuestExampleTripPage({ params }: GuestExampleTripPageProps) {
  const { id } = await params
  const trip = getTripById(id)

  if (!trip) {
    notFound()
  }

  const flights = getFlightsByTripId(id)

  return (
    <GuestLayout>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/examples">
              <ArrowLeft className="size-4" />
              All examples
            </Link>
          </Button>
          <Badge variant="secondary" className="gap-1 rounded-full">
            <Eye className="size-3" />
            Preview only
          </Badge>
        </div>

        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Sign up to save trips and generate your own personalized
              itineraries.
            </p>
            <Button asChild size="sm" className="shrink-0 rounded-lg">
              <Link href="/register">Create free account</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="relative overflow-hidden rounded-xl">
          <AppImage
            src={trip.image}
            alt={trip.destination}
            className="h-56 w-full object-cover sm:h-72"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <Badge className="mb-3 bg-white/20 text-white backdrop-blur-sm">
              {trip.country}
            </Badge>
            <h1 className="text-3xl font-bold sm:text-4xl">{trip.destination}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {trip.dates}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {trip.country}
              </span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5 text-primary" />
              Budget summary
            </CardTitle>
            <CardDescription>Estimated costs for this sample trip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Flights</p>
                <p className="text-xl font-bold">${trip.budget.flights}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Hotels</p>
                <p className="text-xl font-bold">${trip.budget.hotels}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Activities</p>
                <p className="text-xl font-bold">${trip.budget.activities}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-sm text-primary">Total</p>
                <p className="text-xl font-bold text-primary">${trip.budget.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Flight suggestions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Hotel suggestions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {trip.hotels.map((hotel) => (
              <Card key={hotel.name} className="overflow-hidden">
                <div className="flex">
                  <AppImage
                    src={hotel.image}
                    alt={hotel.name}
                    wrapperClassName="h-32 w-32 shrink-0"
                    className="size-full object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        {hotel.rating}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      ${hotel.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="mb-4 text-xl font-semibold">Day-by-day itinerary</h2>
          <div className="space-y-4">
            {trip.itinerary.map((day) => (
              <ItineraryDay key={day.day} day={day} />
            ))}
          </div>
        </div>
      </div>
    </GuestLayout>
  )
}

export default GuestExampleTripPage

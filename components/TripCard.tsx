import Link from "next/link"
import { Calendar, DollarSign, MapPin } from "lucide-react"

import type { Trip } from "@/lib/mockTrips"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TripCardProps {
  trip: Trip
  showViewButton?: boolean
}

export function TripCard({ trip, showViewButton = true }: TripCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.destination}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm">
          {trip.country}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          {trip.destination}
        </CardTitle>
        <CardDescription>{trip.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          {trip.durationDays} days · {trip.dates}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <DollarSign className="size-3.5" />
          ${trip.pricePerPerson.toLocaleString()} / person
        </div>
      </CardContent>
      {showViewButton && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/trip/${trip.id}`}>View trip</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

import Link from "next/link"
import { Calendar, DollarSign, MapPin } from "lucide-react"

import type { Trip } from "@/lib/mockTrips"
import { AppImage } from "@/components/AppImage"
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
  size?: "default" | "large" | "compact"
}

function TripCard({
  trip,
  showViewButton = true,
  size = "default",
}: TripCardProps) {
  const imageHeight =
    size === "large"
      ? "h-56 sm:h-64 lg:h-72"
      : size === "compact"
        ? "h-32"
        : "h-40"

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className={`relative overflow-hidden ${imageHeight}`}>
        <AppImage
          src={trip.image}
          alt={trip.destination}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-background/90 text-xs text-foreground backdrop-blur-sm">
          {trip.country}
        </Badge>
      </div>
      <CardHeader className={size === "compact" ? "gap-1 p-4 pb-1" : "pb-2"}>
        <CardTitle
          className={`flex items-center gap-1.5 ${size === "compact" ? "text-base" : ""}`}
        >
          <MapPin className="size-3.5 text-primary" />
          {trip.destination}
        </CardTitle>
        {size !== "compact" && (
          <CardDescription className="line-clamp-2">{trip.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={`space-y-1 ${size === "compact" ? "px-4 pb-3 pt-0" : "pb-2"}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Calendar className="size-3.5 shrink-0" />
          <span className="truncate">
            {trip.durationDays} days · {trip.dates}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-primary sm:text-sm">
          <DollarSign className="size-3.5 shrink-0" />
          {trip.pricePerPerson != null
            ? `$${trip.pricePerPerson.toLocaleString()} / person`
            : "Price TBD"}
        </div>
      </CardContent>
      {showViewButton && (
        <CardFooter className={size === "compact" ? "p-4 pt-0" : undefined}>
          <Button asChild className="w-full" size={size === "compact" ? "sm" : "default"}>
            <Link href={`/trip/${trip.id}`}>View trip</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export { TripCard }

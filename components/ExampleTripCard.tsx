"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { MapPin, Star } from "lucide-react"

import type { Trip } from "@/lib/mockTrips"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ExampleTripCardProps {
  trip: Trip
  guest?: boolean
}

function ExampleTripCard({ trip, guest = false }: ExampleTripCardProps) {
  const t = useTranslations("common")
  const href = guest ? `/examples/${trip.id}` : `/trip/${trip.id}`

  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden">
          <img
            src={trip.image}
            alt={`${trip.destination}, ${trip.country}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {guest && (
            <Badge className="absolute top-3 left-3 border-0 bg-background/90 text-foreground backdrop-blur-sm">
              {t("preview")}
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 gap-1 border-0 bg-background/90 text-foreground backdrop-blur-sm">
            <Star className="size-3 fill-foreground text-foreground" />
            {trip.rating}
          </Badge>
        </div>
        <CardContent className="p-4">
          <p className="flex items-center gap-1.5 font-medium">
            <MapPin className="size-3.5 text-muted-foreground" />
            {trip.destination}, {trip.country}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {trip.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {trip.durationDays} {t("days")}
            </span>
            <span>
              <span className="font-semibold">
                ${trip.pricePerPerson.toLocaleString()}
              </span>
              <span className="text-muted-foreground">{t("perPerson")}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export { ExampleTripCard }

import { Clock, Plane } from "lucide-react"

import type { Flight } from "@/lib/mockFlights"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FlightCardProps {
  flight: Flight
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plane className="size-4 text-primary" />
            {flight.airline}
          </CardTitle>
          <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
            {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{flight.departure}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" />
            {flight.duration}
          </span>
          <span className="text-muted-foreground">{flight.arrival}</span>
        </div>
        <p className="text-2xl font-bold text-primary">${flight.price}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Select flight
        </Button>
      </CardFooter>
    </Card>
  )
}

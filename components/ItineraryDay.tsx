import { CalendarDays } from "lucide-react"

import type { ItineraryDay as ItineraryDayType } from "@/lib/mockTrips"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ItineraryDayProps {
  day: ItineraryDayType
}

export function ItineraryDay({ day }: ItineraryDayProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <CalendarDays className="size-3" />
            Day {day.day}
          </Badge>
          <CardTitle className="text-base">{day.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {day.activities.map((activity, index) => (
            <li key={activity}>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {activity}
              </div>
              {index < day.activities.length - 1 && (
                <Separator className="my-2 ml-1" />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

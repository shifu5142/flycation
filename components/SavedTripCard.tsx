"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  Loader2,
  MapPin,
  Plane,
  Trash2,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type SavedTrip = {
  id: string | number
  tripType?: string
  from: string
  to: string
  departure: string
  returnDate?: string | null
  passengers: number
  travelClass: string
  imageUrl?: string | null
}

interface SavedTripCardProps {
  trip: SavedTrip
  onDelete?: (id: string | number) => void
  deleting?: boolean
  viewTripHref?: string
}

function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function SavedTripCard({
  trip,
  onDelete,
  deleting = false,
  viewTripHref,
}: SavedTripCardProps) {
  const [open, setOpen] = useState(false)
  const imageSrc = trip.imageUrl || "/hero-travel.png"

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete?.(trip.id)
  }

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border-border/50 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10",
        open && "ring-2 ring-primary/25 shadow-lg"
      )}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={imageSrc}
          alt={`${trip.from} to ${trip.to}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-transparent"
          aria-hidden
        />
        <Badge className="absolute top-2 right-2 border border-white/25 bg-black/75 px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
          {trip.tripType === "oneway" ? "Direct" : "Round trip"}
        </Badge>
      </div>

      <CardContent className="flex-1 cursor-pointer space-y-3 bg-card/95 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold capitalize tracking-tight">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {formatLabel(trip.from)} → {formatLabel(trip.to)}
              </span>
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Click to {open ? "hide" : "view"} trip details
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </div>

        {open && (
          <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/25 p-3 text-sm">
            <DetailRow
              label="Trip type"
              value={
                trip.tripType === "oneway" ? "Direct flight" : "Round trip"
              }
            />
            <DetailRow label="From" value={formatLabel(trip.from)} />
            <DetailRow label="To" value={formatLabel(trip.to)} />
            <DetailRow label="Departure" value={trip.departure} icon={Calendar} />
            {trip.returnDate && (
              <DetailRow label="Return" value={trip.returnDate} icon={Calendar} />
            )}
            <DetailRow
              label="Passengers"
              value={`${trip.passengers} adult${trip.passengers !== 1 ? "s" : ""}`}
              icon={Users}
            />
            <DetailRow label="Class" value={trip.travelClass} icon={Plane} />

            {onDelete && (
              <div className="flex justify-end border-t border-border/40 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                  {deleting ? "Deleting…" : "Delete"}
                </Button>
              </div>
            )}
          </div>
        )}

        {viewTripHref && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            size="sm"
            asChild
            onClick={(event) => event.stopPropagation()}
          >
            <Link href={viewTripHref}>View trip</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}

export { SavedTripCard }

import { getStaticCountryImagePath } from "@/lib/countryStaticImages"
import type { Booking, BookingStatus, BookingTimelineStep } from "@/lib/mockBookingsPage"

export function isPlaceholderImageUrl(url?: string | null) {
  if (!url?.trim()) return true
  const value = url.trim().toLowerCase()
  return (
    value.includes("example.com") ||
    value.includes("placeholder") ||
    value.includes("via.placeholder")
  )
}

export function resolveTripImage(
  imageUrl: string | null | undefined,
  destination: string
) {
  if (imageUrl?.trim() && !isPlaceholderImageUrl(imageUrl)) {
    return imageUrl.trim()
  }
  return getStaticCountryImagePath(destination)
}

export function resolveBookingImage(booking: Booking) {
  const destination =
    booking.title.split("→")[1]?.trim() ??
    booking.subtitle.split("·")[0]?.trim() ??
    booking.title

  return resolveTripImage(booking.image, destination)
}

export type Trip = {
  id: number
  from: string
  to: string
  departure: string
  returnDate: string | null
  passengers: number | null
  travelClass: string | null
  user_id: string
  imageUrl: string | null
  booking_status: string | null
  booking_number: string | null
}

export function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatTripDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function toBookingStatus(status: string | null): BookingStatus {
  const normalized = status?.toLowerCase() ?? "booking"
  if (normalized === "cancelled") return "cancelled"
  if (normalized === "confirmed" || normalized === "completed") return "confirmed"
  return "pending"
}

export function tripToBooking(trip: Trip): Booking {
  const status = toBookingStatus(trip.booking_status)
  const dates = trip.returnDate
    ? `${formatTripDate(trip.departure)} – ${formatTripDate(trip.returnDate)}`
    : formatTripDate(trip.departure)

  const timeline: BookingTimelineStep[] = [
    { label: "Booked", date: formatTripDate(trip.departure), done: true },
  ]

  if (status === "cancelled") {
    timeline.push({ label: "Cancelled", date: "—", done: true })
  } else {
    timeline.push({
      label: status === "confirmed" ? "Confirmed" : "Awaiting confirmation",
      date: status === "confirmed" ? formatTripDate(trip.departure) : "—",
      done: status === "confirmed",
    })
    timeline.push({
      label: trip.returnDate ? "Return" : "Departure",
      date: trip.returnDate
        ? formatTripDate(trip.returnDate)
        : formatTripDate(trip.departure),
      done: false,
    })
  }

  return {
    id: String(trip.id),
    type: "flight",
    title: `${formatLabel(trip.from)} → ${formatLabel(trip.to)}`,
    subtitle: `${trip.travelClass ?? "Economy"} · ${trip.returnDate ? "Round trip" : "One way"}`,
    reference: trip.booking_number ?? `FC-${trip.id}`,
    dates,
    status,
    image: resolveTripImage(trip.imageUrl, trip.to),
    price: 0,
    travelers: trip.passengers ?? 1,
    timeline,
  }
}

export function isUpcomingTrip(departure: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(departure) >= today
}

export function statusBadgeClass(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
    case "pending":
      return "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400"
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20"
  }
}

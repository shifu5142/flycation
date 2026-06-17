import type { ComponentType } from "react"
import { useEffect, useState } from "react"
import {
  BedDouble,
  Building2,
  CalendarDays,
  CloudSun,
  Crown,
  Download,
  Home,
  Landmark,
  Lightbulb,
  MapPin,
  Moon,
  Palmtree,
  Plane,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  Star,
  Sun,
  Sunset,
  TreePine,
  Utensils,
  Wallet,
  Waves,
  Wine,
} from "lucide-react"

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
import {
  categoryToIcon,
  parsePriceAmount,
  type ActivityIconType,
  type AiGeneratedTripPlan,
} from "@/lib/aiGeneratedTripPlanTypes"
import { fetchCountryImageUrl } from "@/lib/fetchCountryImage"

function ActivityTypeIcon({
  type,
  className,
}: {
  type: ActivityIconType
  className?: string
}) {
  switch (type) {
    case "food":
      return <Utensils className={className} />
    case "nature":
      return <TreePine className={className} />
    case "nightlife":
      return <Wine className={className} />
    default:
      return <Landmark className={className} />
  }
}

function PeriodIcon({ period }: { period: string }) {
  if (period === "Morning") return <Sun className="size-3.5 text-amber-500" />
  if (period === "Afternoon")
    return <Sunset className="size-3.5 text-orange-500" />
  return <Moon className="size-3.5 text-indigo-500" />
}

type HotelData = AiGeneratedTripPlan["hotels"][number]

function getHotelIcon(hotel: HotelData): ComponentType<{ className?: string }> {
  const text = [
    hotel.name,
    hotel.description,
    hotel.priceLevel,
    hotel.location,
    ...(hotel.amenities ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (
    text.includes("luxury") ||
    text.includes("5-star") ||
    text.includes("premium") ||
    text.includes("suite")
  ) {
    return Crown
  }
  if (
    text.includes("resort") ||
    text.includes("beach") ||
    text.includes("coastal") ||
    text.includes("seaside")
  ) {
    return Palmtree
  }
  if (
    text.includes("pool") ||
    text.includes("spa") ||
    text.includes("wellness")
  ) {
    return Waves
  }
  if (
    text.includes("boutique") ||
    text.includes("apartment") ||
    text.includes("villa") ||
    text.includes("guesthouse")
  ) {
    return Home
  }
  if (
    text.includes("hostel") ||
    text.includes("budget") ||
    text.includes("inn") ||
    text.includes("motel")
  ) {
    return BedDouble
  }
  if (text.includes("historic") || text.includes("heritage")) {
    return Landmark
  }

  return Building2
}

function HotelVisual({ hotel }: { hotel: HotelData }) {
  const Icon = getHotelIcon(hotel)

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-primary/10 sm:h-28 sm:w-28">
      <Icon className="size-10 text-primary sm:size-12" />
    </div>
  )
}

function TipsList({
  title,
  icon: Icon,
  tips,
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  tips: string[]
}) {
  if (!tips.length) return null

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="space-y-2 p-5">
          {tips.map((tip, i) => (
            <p key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {tip}
            </p>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}

export function AiTripPlanResults({ plan }: { plan: AiGeneratedTripPlan }) {
  const { hero, budgetBreakdown } = plan
  const [heroImageUrl, setHeroImageUrl] = useState(hero.image)
  const budgetTotal = parsePriceAmount(budgetBreakdown.total)

  useEffect(() => {
    setHeroImageUrl(hero.image)

    const loadCountryImage = async () => {
      if (!hero.country?.trim()) return

      const url = await fetchCountryImageUrl(hero.country, hero.destination)
      if (url) setHeroImageUrl(url)
    }

    loadCountryImage()
  }, [hero.country, hero.destination, hero.image])

  const budgetRows = [
    { label: "Flights", value: budgetBreakdown.flights, icon: Plane },
    { label: "Hotels", value: budgetBreakdown.hotels, icon: Building2 },
    { label: "Food", value: budgetBreakdown.food, icon: Utensils },
    { label: "Activities", value: budgetBreakdown.activities, icon: Sparkles },
    {
      label: "Transportation",
      value: budgetBreakdown.transportation,
      icon: MapPin,
    },
    { label: "Shopping", value: budgetBreakdown.shopping, icon: Wallet },
  ].filter((row) => parsePriceAmount(row.value) > 0 || row.value)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {/* Overview */}
      <Card className="overflow-hidden rounded-2xl border-border/60 shadow-md">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-[220px]">
            <img
              src={heroImageUrl}
              alt={hero.destination}
              className="absolute inset-0 size-full max-h-full max-w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
          </div>
          <CardHeader className="flex flex-col justify-center gap-3 p-6">
            <Badge className="w-fit rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-3" />
              AI-generated plan
            </Badge>
            <CardTitle className="text-2xl">
              {hero.destination}
              <span className="font-normal text-muted-foreground">
                {" "}
                · {hero.country}
              </span>
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {hero.summary}
            </CardDescription>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline">
                <CalendarDays className="size-3" />
                {hero.duration}
              </Badge>
              <Badge variant="outline">
                <Wallet className="size-3" />
                {hero.budget}
              </Badge>
              <Badge variant="secondary">{hero.travelStyle}</Badge>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* Itinerary */}
      {plan.itinerary.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <CalendarDays className="size-5 text-primary" />
            Day-by-day itinerary
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {plan.itinerary.map((day) => {
              const slots = [
                { period: "Morning" as const, activity: day.morning },
                { period: "Afternoon" as const, activity: day.afternoon },
                { period: "Evening" as const, activity: day.evening },
              ].filter((slot) => slot.activity)

              return (
                <Card
                  key={day.day}
                  className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        {day.day}
                      </span>
                      <CardTitle className="text-base">{day.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {slots.map((slot) => (
                      <div
                        key={`${day.day}-${slot.period}`}
                        className="flex gap-3 rounded-xl bg-muted/40 p-3"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                          <ActivityTypeIcon
                            type={categoryToIcon(slot.activity)}
                            className="size-4 text-primary"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <PeriodIcon period={slot.period} />
                            {slot.period}
                          </p>
                          <p className="mt-0.5 text-sm">{slot.activity}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hotels */}
        {plan.hotels.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Building2 className="size-5 text-primary" />
              Hotel suggestions
            </h2>
            <div className="space-y-3">
              {plan.hotels.map((hotel) => (
                <Card
                  key={hotel.name}
                  className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex">
                    <HotelVisual hotel={hotel} />
                    <CardContent className="flex flex-1 flex-col justify-center gap-1 p-4">
                      <p className="font-semibold">{hotel.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {hotel.location}
                      </p>
                      {hotel.description && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {hotel.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                          {hotel.rating}
                        </span>
                        <span className="font-bold text-primary">
                          {hotel.pricePerNight}
                          <span className="text-xs font-normal text-muted-foreground">
                            /night
                          </span>
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-8">
          {/* Flights */}
          {plan.flights.length > 0 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Plane className="size-5 text-primary" />
                Suggested flights
              </h2>
              <div className="space-y-3">
                {plan.flights.map((flight, i) => (
                  <Card
                    key={`${flight.airline}-${i}`}
                    className="rounded-2xl border-border/60 shadow-sm"
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{flight.airline}</p>
                        <Badge variant="outline">{flight.stops}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {flight.departureAirport} → {flight.arrivalAirport}
                      </p>
                      <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 p-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {flight.departureTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Depart
                          </p>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <Plane className="size-4 rotate-90 text-primary" />
                          <p className="text-xs text-muted-foreground">
                            {flight.duration}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {flight.arrivalTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Arrive
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="text-sm text-muted-foreground">
                          Estimated fare
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {flight.price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Budget breakdown */}
          {budgetRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Wallet className="size-5 text-primary" />
                Budget breakdown
              </h2>
              <Card className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="space-y-3 p-5">
                  {budgetRows.map((row) => {
                    const Icon = row.icon
                    const amount = parsePriceAmount(row.value)
                    const pct =
                      budgetTotal > 0
                        ? Math.round((amount / budgetTotal) * 100)
                        : 0
                    return (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Icon className="size-3.5 text-muted-foreground" />
                            {row.label}
                          </span>
                          <span className="font-semibold">{row.value}</span>
                        </div>
                        {budgetTotal > 0 && (
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total estimate</span>
                    <span className="text-lg text-primary">
                      {budgetBreakdown.total}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>

      {/* Activities */}
      {plan.activities.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="size-5 text-primary" />
            Things to do
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {plan.activities.map((activity) => (
              <Card
                key={activity.name}
                className="rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ActivityTypeIcon
                      type={categoryToIcon(activity.category)}
                      className="size-4"
                    />
                  </div>
                  <div>
                    <p className="font-medium leading-snug">{activity.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.duration}
                    </p>
                    {activity.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {activity.price.toLowerCase().includes("free")
                        ? "Free"
                        : activity.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Restaurants */}
      {plan.restaurants.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Utensils className="size-5 text-primary" />
            Restaurant picks
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plan.restaurants.map((restaurant) => (
              <Card
                key={restaurant.name}
                className="rounded-2xl border-border/60 shadow-sm"
              >
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{restaurant.name}</p>
                    <span className="flex shrink-0 items-center gap-1 text-sm">
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {restaurant.cuisine} · {restaurant.priceRange}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Weather & best time */}
      <div className="grid gap-6 lg:grid-cols-2">
        {plan.weather?.season && (
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CloudSun className="size-5 text-primary" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Season:</span>{" "}
                {plan.weather.season}
              </p>
              <p>
                <span className="font-medium">Temperature:</span>{" "}
                {plan.weather.averageTemperature}
              </p>
              <p>
                <span className="font-medium">Conditions:</span>{" "}
                {plan.weather.conditions}
              </p>
              <p className="text-muted-foreground">
                {plan.weather.recommendation}
              </p>
            </CardContent>
          </Card>
        )}

        {plan.bestTimeToVisit?.months?.length > 0 && (
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="size-5 text-primary" />
                Best time to visit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {plan.bestTimeToVisit.months.map((month) => (
                  <Badge key={month} variant="secondary">
                    {month}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.bestTimeToVisit.reason}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Currency */}
      {plan.currencyInfo?.currency && (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="size-5 text-primary" />
              Currency · {plan.currencyInfo.currency} ({plan.currencyInfo.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {plan.currencyInfo.exchangeTip}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Transportation */}
      {plan.transportation.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="size-5 text-primary" />
            Getting around
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plan.transportation.map((item, i) => (
              <Card
                key={`${item.type}-${i}`}
                className="rounded-2xl border-border/60 shadow-sm"
              >
                <CardContent className="space-y-2 p-4">
                  <p className="font-semibold">{item.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {item.estimatedCost}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Map places */}
      {plan.map?.places?.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="size-5 text-primary" />
            Places to explore
            {plan.map.centerDestination && (
              <span className="text-base font-normal text-muted-foreground">
                · {plan.map.centerDestination}
              </span>
            )}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {plan.map.places.map((place) => (
              <div
                key={place.name}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Packing list */}
      {plan.packingList.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="size-5 text-primary" />
            Packing list
          </h2>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {plan.packingList.map((item) => (
                <p key={item} className="flex gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <TipsList title="AI travel tips" icon={Lightbulb} tips={plan.aiTips} />
      <TipsList title="Local tips" icon={MapPin} tips={plan.localTips} />
      <TipsList title="Safety tips" icon={Shield} tips={plan.safetyTips} />

      {/* Actions */}
      <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">Happy with this plan?</p>
            <p className="text-sm text-muted-foreground">
              Save, regenerate, or export your itinerary
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">
              <RefreshCw className="size-4" />
              Regenerate plan
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Download className="size-4" />
              Export PDF
            </Button>
            <Button className="rounded-xl shadow-md shadow-primary/20">
              <Save className="size-4" />
              Save trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

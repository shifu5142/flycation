"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeftRight,
  ChevronDown,
  Minus,
  Plane,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { AirportSearchInput } from "@/components/AirportSearchInput"
import { FlightDateRangePicker } from "@/components/FlightDateRangePicker"
import { SavedTripCard, type SavedTrip } from "@/components/SavedTripCard"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/components/ToastProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCountryImageUrl } from "@/lib/fetchCountryImage"
import { supabase } from "@/app/services/supabase/client"
const TRAVEL_CLASSES = [
  "Economy",
  "Premium Economy",
  "Business",
  "First",
] as const

type TripType = "oneway" | "roundtrip"
type TravelClass = (typeof TRAVEL_CLASSES)[number]

function toSavedTrip(row: Record<string, unknown>): SavedTrip {
  const returnDate = row.returnDate ?? row.return_date

  return {
    id: row.id as string | number,
    tripType: returnDate ? "roundtrip" : "oneway",
    from: String(row.from ?? ""),
    to: String(row.to ?? ""),
    departure: String(row.departure ?? ""),
    returnDate: returnDate ? String(returnDate) : null,
    passengers: Number(row.passengers ?? 1),
    travelClass: String(row.travelClass ?? row.travel_class ?? "Economy"),
    imageUrl: (row.imageUrl ?? row.image_url) as string | null | undefined,
  }
}

function DashboardPage() {
  const t = useTranslations("dashboard")
  const { toast } = useToast()
  const { firstName, loading: authLoading, user } = useAuth()
  const [searching, setSearching] = useState(false)
  const [tripType, setTripType] = useState<TripType>("roundtrip")
  const [from, setFrom] = useState("israel")
  const [to, setTo] = useState("thailand")
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState(1)
  const [travelClass, setTravelClass] = useState<TravelClass>("Economy")
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [deletingTripId, setDeletingTripId] = useState<string | number | null>(null)
  const [countriesImageUrl, setCountriesImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchDestinationImage = async () => {
      if (!to.trim()) return

      try {
        const url = await fetchCountryImageUrl(to)
        if (url) setCountriesImageUrl(url)
      } catch (err) {
        console.error("Image fetch failed:", err)
      }
    }

    fetchDestinationImage()
  }, [to])

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")

      if (error) {
        console.error(error)
        return
      }

      setTrips(
        (data ?? []).map((row: Record<string, unknown>) => toSavedTrip(row))
      )
    }

    fetchTrips()
  }, [])

  const handleDeleteTrip = async (tripId: string | number) => {
    setDeletingTripId(tripId)

    const { error } = await supabase.from("trips").delete().eq("id", tripId)

    if (error) {
      console.error(error)
      setTimeout(() => {
        toast("Failed to delete trip", "info")
        setDeletingTripId(null)
      }, 1000)
    }

    setTrips((prev) => prev.filter((trip) => trip.id !== tripId))
    setTimeout(() => {
      toast("Trip deleted", "success")
      setDeletingTripId(null)
    }, 1000)
  }

  const handleSearchFlights = async () => {
    try {
      setSearching(true);
  
      if (!from.trim() || !to.trim()) {
        toast("Please enter departure and destination airports", "info");
        setSearching(false);
        return;
      }
  
      if (!departure) {
        toast("Please select a departure date", "info");
        setSearching(false);
        return;
      }
  
      if (tripType === "roundtrip" && !returnDate) {
        toast("Please select a return date", "info");
        setSearching(false);
        return;
      }
  
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
  
      if (!supabaseUser) {
        toast("You must be logged in to save a trip", "info");
        setSearching(false);
        return;
      }
  
      // 🔥 IMAGE FETCH (safe local variable)
      let imageUrl: string | null = countriesImageUrl || null;

      try {
        if (!imageUrl) {
          imageUrl = await fetchCountryImageUrl(to)
        }
      } catch (err) {
        console.error("Image fetch failed:", err);
      }
  
      // 🔥 SUPABASE INSERT
      const { data, error } = await supabase
        .from("trips")
        .insert({
          from,
          to,
          departure,
          returnDate: returnDate ? returnDate : null,
          passengers,
          travelClass,
          user_id: supabaseUser.id,
          imageUrl,
        })
        .select()
        .single();
  
      if (error) {
        console.error(error);
        toast("Failed to save trip", "info");
        setSearching(false);
        return;
      }
  
      setTrips((prev) => [
        toSavedTrip(data as Record<string, unknown>),
        ...prev,
      ]);
  
      toast("Flights searched successfully", "success");
    } catch (error: any) {
      console.error(error);
      toast(error.message || "Something went wrong", "info");
    } finally {
      setSearching(false);
    }
  };

  return (
    <DashboardShell>
      <div className="-m-4 flex flex-col sm:-m-6 lg:-m-8">
        {/* Hero: sky background with header + search */}
        <section className="relative h-[70vh] w-full shrink-0 overflow-hidden">
          <img
            src="/backround-dash.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_40%]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-sky-950/30"
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/95 uppercase backdrop-blur-md">
                  <Plane className="size-3.5" />
                  {t("travelHub")}
                </p>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-4xl">
                    {t("welcomeBack", { name: authLoading ? "…" : firstName })}
                  </h1>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 drop-shadow-sm">
                    {trips.length > 0
                      ? t(trips.length === 1 ? "savedTripsOne" : "savedTripsMany", {
                          count: trips.length,
                        })
                      : t("searchBelow")}
                  </p>
                </div>
              </div>
              <div className="hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-md sm:block">
                <p className="text-2xl font-bold tabular-nums text-white">
                  {trips.length}
                </p>
                <p className="text-xs font-medium text-white/75">{t("savedTrips")}</p>
              </div>
            </div>

            {/* Search */}
            <div className="pt-4">
              <Card className="relative overflow-visible rounded-2xl border border-white/35 border-t-2 border-t-primary bg-card/95 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
                <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
                  <Search className="size-4" />
                </span>
                {t("searchFlights")}
              </h2>
              <Tabs
                value={tripType}
                onValueChange={(value) => {
                  const next = value as TripType
                  setTripType(next)
                  if (next === "oneway") setReturnDate("")
                }}
              >
                <TabsList className="h-11 rounded-xl bg-muted/70 p-1 shadow-inner">
                  <TabsTrigger
                    value="oneway"
                    className="rounded-lg px-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {t("direct")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="roundtrip"
                    className="rounded-lg px-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {t("roundTrip")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
              <div className="sm:col-span-2 lg:col-span-2">
                <AirportSearchInput
                  id="from"
                  label="From"
                  value={from}
                  onChange={setFrom}
                  placeholder="Select origin"
                  size="lg"
                />
              </div>

              <div className="flex items-end justify-center sm:col-span-2 lg:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0 rounded-full border-primary/20 bg-primary/5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    const temp = from;
                    setFrom(to);
                    setTo(temp);
                  }}
                  aria-label="Swap airports"
                >
                  <ArrowLeftRight className="size-4" />
                </Button>
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <AirportSearchInput
                  id="to"
                  label="To"
                  value={to}
                  onChange={setTo}
                  placeholder="Select destination"
                  size="lg"
                />
              </div>

              <div
                className={
                  tripType === "roundtrip"
                    ? "sm:col-span-2 lg:col-span-3"
                    : "sm:col-span-2 lg:col-span-2"
                }
              >
                <FlightDateRangePicker
                  tripType={tripType}
                  departure={departure}
                  returnDate={returnDate}
                  onDepartureChange={setDeparture}
                  onReturnChange={setReturnDate}
                />
              </div>

              {tripType === "oneway" ? (
                <div className="hidden lg:col-span-2 lg:block" />
              ) : null}

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-sm font-medium text-muted-foreground">Passengers</Label>
                <div className="flex h-11 items-center gap-1 rounded-xl border border-input/80 bg-muted/30 px-2 shadow-sm">
                  <Users className="size-4 shrink-0 text-primary/70" />
                  <span className="flex-1 text-center text-sm font-semibold tabular-nums">
                    {passengers}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-md hover:bg-primary/10 hover:text-primary"
                    onClick={() => setPassengers((n) => Math.max(1, n - 1))}
                    disabled={passengers <= 1}
                    aria-label="Decrease passengers"
                  >
                    <Minus className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-md hover:bg-primary/10 hover:text-primary"
                    onClick={() => setPassengers((n) => Math.min(9, n + 1))}
                    disabled={passengers >= 9}
                    aria-label="Increase passengers"
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-sm font-medium text-muted-foreground">Class</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-between rounded-xl border-input/80 bg-muted/30 px-3 text-sm font-medium shadow-sm hover:bg-muted/50"
                    >
                      <span className="truncate">{travelClass}</span>
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {TRAVEL_CLASSES.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setTravelClass(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <Button
                  className="h-11 w-full rounded-xl text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25"
                  onClick={handleSearchFlights}
                  disabled={searching}
                >
                  {searching ? (
                    <Plane className="size-4 animate-pulse" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  <span>Search</span>
                </Button>
              </div>
            </div>
          </CardContent>
              </Card>
            </div>
          </div>

          {/* wave into content below */}
          <svg
            className="absolute right-0 bottom-0 left-0 z-10 h-10 w-full text-background sm:h-14"
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0,40 C240,56 480,16 720,36 C960,56 1200,24 1440,40 L1440,56 L0,56 Z"
            />
          </svg>
        </section>

        {/* My Trips — below hero */}
        <section className="relative bg-gradient-to-b from-background via-background to-muted/30 px-4 pt-4 pb-12 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="mx-auto w-full max-w-6xl">
            {countriesImageUrl && (
              <div className="mb-10">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                      Recent
                    </p>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Latest search
                    </h2>
                  </div>
                </div>
                <div className="max-w-sm">
                  <SavedTripCard
                    trip={{
                      id: "latest",
                      tripType,
                      from,
                      to,
                      departure,
                      returnDate,
                      passengers,
                      travelClass,
                      imageUrl: countriesImageUrl,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Your journeys
                </p>
                <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <Sparkles className="size-5 text-primary" />
                  My Trips
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  All flights you&apos;ve saved from search
                </p>
              </div>
              <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm tabular-nums">
                {trips.length} total
              </span>
            </div>

            {trips.length === 0 ? (
              <Card className="overflow-hidden border border-dashed border-border/80 bg-card/60 py-16 text-center shadow-sm">
                <CardContent>
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="size-8 text-primary" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">No trips yet</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Use the search panel above to find flights and save your first
                    trip.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <SavedTripCard
                    key={trip.id}
                    trip={trip}
                    onDelete={handleDeleteTrip}
                    deleting={deletingTripId === trip.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}

export default DashboardPage
"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftRight,
  CalendarDays,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/app/services/supabase/client"
import { cn } from "@/lib/utils"
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
  const [countriesImageUrl, setCountriesImageUrl] = useState<string>("");
  const countriesApiUrl = `https://api.unsplash.com/search/photos?query=${to.toLowerCase()}&per_page=1`

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
      let imageUrl = null;
  
      try {
        const res = await fetch(countriesApiUrl, {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        });
  
        if (res.ok) {
          const countries = await res.json();
          imageUrl = countries.results?.[0]?.urls?.small || null;
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
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {authLoading ? "…" : firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {trips.length} saved trips · plan your next flight below
            </p>
          </div>
        </div>

        {/* Compact flight search */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold">Search flights</h2>
              <Tabs
                value={tripType}
                onValueChange={(value) => setTripType(value as TripType)}
              >
                <TabsList className="h-9">
                  <TabsTrigger value="oneway" className="px-3 text-xs sm:text-sm">
                    Direct
                  </TabsTrigger>
                  <TabsTrigger value="roundtrip" className="px-3 text-xs sm:text-sm">
                    Round trip
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
                />
              </div>

              <div className="flex items-end justify-center sm:col-span-2 lg:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0 rounded-lg"
                  onClick={() => {
                    const temp = from;
                    setFrom(to);
                    setTo(temp);
                  }}
                  aria-label="Swap airports"
                >
                  <ArrowLeftRight className="size-3.5" />
                </Button>
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <AirportSearchInput
                  id="to"
                  label="To"
                  value={to}
                  onChange={setTo}
                  placeholder="Select destination"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <DatePickerField
                  id="departure"
                  label="Departure"
                  value={departure}
                  onChange={setDeparture}
                />
              </div>

              {tripType === "roundtrip" ? (
                <div className="sm:col-span-2 lg:col-span-2">
                  <DatePickerField
                    id="return"
                    label="Return"
                    value={returnDate}
                    min={departure || undefined}
                    onChange={setReturnDate}
                  />
                </div>
              ) : (
                <div className="hidden lg:col-span-2 lg:block" />
              )}

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <Label className="text-xs text-muted-foreground">Passengers</Label>
                <div className="flex h-9 items-center gap-1 rounded-lg border border-input bg-background px-2">
                  <Users className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-center text-xs font-medium">
                    {passengers}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-md"
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
                    className="size-6 rounded-md"
                    onClick={() => setPassengers((n) => Math.min(9, n + 1))}
                    disabled={passengers >= 9}
                    aria-label="Increase passengers"
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <Label className="text-xs text-muted-foreground">Class</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-between rounded-lg px-2 text-xs font-normal"
                    >
                      <span className="truncate">{travelClass}</span>
                      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
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
                  className="h-9 w-full rounded-lg"
                  onClick={handleSearchFlights}
                  disabled={searching}
                >
                  {searching ? (
                    <Plane className="size-3.5 animate-pulse" />
                  ) : (
                    <Search className="size-3.5" />
                  )}
                  <span className="text-sm">Search</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {countriesImageUrl && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Latest search</h2>
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
          </section>
        )}

        <Separator />

        {/* Trips */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Trips</h2>
            <span className="text-sm text-muted-foreground">
              {trips.length} total
            </span>
          </div>

          {trips.length === 0 ? (
            <Card className="py-12 text-center">
              <CardContent>
                <Sparkles className="mx-auto size-10 text-muted-foreground/50" />
                <h3 className="mt-3 font-semibold">No trips yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search flights above to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <SavedTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}

interface DatePickerFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
}

function DatePickerField({ id, label, value, onChange, min }: DatePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    const input = inputRef.current
    if (!input) return
    if (typeof input.showPicker === "function") {
      input.showPicker()
    } else {
      input.focus()
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          aria-label={`Choose ${label.toLowerCase()} date`}
          onClick={openPicker}
          className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <CalendarDays className="size-3.5" />
        </button>
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          className={cn(
            "flex h-9 w-full cursor-pointer rounded-lg border border-input bg-background py-2 pr-3 pl-9 text-sm shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          )}
        />
      </div>
    </div>
  )
}

export default DashboardPage
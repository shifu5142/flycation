"use client"

import { useEffect, useState } from "react"
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
import { TripCard } from "@/components/TripCard"
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
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebaseConfig"

const TRAVEL_CLASSES = [
  "Economy",
  "Premium Economy",
  "Business",
  "First",
] as const

type TripType = "oneway" | "roundtrip"
type TravelClass = (typeof TRAVEL_CLASSES)[number]

function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { firstName, loading: authLoading } = useAuth()
  const [searching, setSearching] = useState(false)
  const [tripType, setTripType] = useState<TripType>("roundtrip")
  const [from, setFrom] = useState("TLV")
  const [to, setTo] = useState("BKK")
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState(1)
  const [travelClass, setTravelClass] = useState<TravelClass>("Economy")
  const [trips, setTrips] = useState<any[]>([]);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setTrips(data);
    };

    fetchTrips();
  }, []);
  const handleSearchFlights = async() => {
    if (!from.trim() || !to.trim()) {
      toast("Please enter departure and destination airports", "info")
      return
    }
    if (!departure) {
      toast("Please select a departure date", "info")
      return
    }
    if (tripType === "roundtrip" && !returnDate) {
      toast("Please select a return date", "info")
      return
    }
    const {error}= await supabase.from("trips").insert({
      from,
      to,
      departure,
      returnDate,
      passengers,
      travelClass,
      user_id: auth.currentUser,
    })
    if (error) {
      toast(error.message)
      return
    }
    toast("Flights searched successfully", "success")
    
    setSearching(true)
    setTimeout(() => {
    }, 1500)
  }
  
  const swapAirports = () => {
    setFrom(to)
    setTo(from)
  }

  useEffect(() => {
    const fetchTrips = async () => {
      const user = auth.currentUser
      if (user?.uid) {
        // user exists and is authenticated
      } else {
        router.push("/not-found")
      }
    }
    fetchTrips()
  }, [router])

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
                  onClick={swapAirports}
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

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <Label htmlFor="departure" className="text-xs text-muted-foreground">
                  Departure
                </Label>
                <Input
                  id="departure"
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="h-9 rounded-lg"
                />
              </div>

              {tripType === "roundtrip" ? (
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                  <Label htmlFor="return" className="text-xs text-muted-foreground">
                    Return
                  </Label>
                  <Input
                    id="return"
                    type="date"
                    value={returnDate}
                    min={departure || undefined}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="h-9 rounded-lg"
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
                <TripCard key={trip.id} trip={trip} size="compact" />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  )
}

export default DashboardPage
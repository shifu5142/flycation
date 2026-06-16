export type AiGeneratedTripPlan = {
  hero: {
    destination: string
    country: string
    image: string
    summary: string
    duration: string
    budget: string
    travelStyle: string
  }
  itinerary: {
    day: number
    title: string
    morning: string
    afternoon: string
    evening: string
  }[]
  hotels: {
    name: string
    image: string
    location: string
    rating: number
    pricePerNight: string
    description?: string
    amenities?: string[]
    priceLevel?: string
    coordinates?: { lat: number; lng: number }
  }[]
  flights: {
    airline: string
    departureAirport: string
    arrivalAirport: string
    departureTime: string
    arrivalTime: string
    duration: string
    stops: string
    cabinClass?: string
    price: string
    currency?: string
    bookingProvider?: string
    baggageIncluded?: boolean
  }[]
  budgetBreakdown: {
    flights: string
    hotels: string
    food: string
    activities: string
    transportation: string
    shopping: string
    total: string
  }
  activities: {
    name: string
    category: string
    duration: string
    price: string
    description?: string
  }[]
  weather: {
    season: string
    averageTemperature: string
    conditions: string
    recommendation: string
  }
  packingList: string[]
  map: {
    centerDestination: string
    places: {
      name: string
      type: string
      coordinates?: { lat: number; lng: number }
    }[]
  }
  transportation: {
    type: string
    description: string
    estimatedCost: string
  }[]
  restaurants: {
    name: string
    cuisine: string
    priceRange: string
    description: string
    rating: number
  }[]
  aiTips: string[]
  bestTimeToVisit: {
    months: string[]
    reason: string
  }
  localTips: string[]
  currencyInfo: {
    currency: string
    symbol: string
    exchangeTip: string
  }
  safetyTips: string[]
}

export type ActivityIconType = "food" | "nature" | "city" | "nightlife"

export function parsePriceAmount(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  if (typeof value === "number") return value
  const digits = value.replace(/[^0-9.]/g, "")
  const parsed = parseFloat(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

export function categoryToIcon(category: string): ActivityIconType {
  const c = category.toLowerCase()
  if (
    c.includes("food") ||
    c.includes("culinary") ||
    c.includes("restaurant") ||
    c.includes("dining")
  ) {
    return "food"
  }
  if (
    c.includes("nature") ||
    c.includes("outdoor") ||
    c.includes("beach") ||
    c.includes("hike") ||
    c.includes("park")
  ) {
    return "nature"
  }
  if (
    c.includes("night") ||
    c.includes("bar") ||
    c.includes("club") ||
    c.includes("wine")
  ) {
    return "nightlife"
  }
  return "city"
}

import type { AiGeneratedTripPlan } from "@/lib/aiGeneratedTripPlanTypes"

export const guestSamplePreview: AiGeneratedTripPlan = {
  hero: {
    destination: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    summary:
      "A balanced Tokyo itinerary mixing iconic districts, local food, and cultural highlights — optimized for first-time visitors.",
    duration: "5 days",
    budget: "~$2,480",
    travelStyle: "Balanced",
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival & Shibuya",
      morning: "Land at Narita, express train to Shinjuku",
      afternoon: "Check in, explore Shibuya Crossing & Hachiko",
      evening: "Ramen dinner in Omoide Yokocho",
    },
    {
      day: 2,
      title: "Culture & Temples",
      morning: "Senso-ji Temple & Asakusa street market",
      afternoon: "Ueno Park walk and museum visit",
      evening: "Golden Gai bars in Shinjuku",
    },
    {
      day: 3,
      title: "Modern Tokyo",
      morning: "TeamLab Planets immersive experience",
      afternoon: "Odaiba waterfront & Rainbow Bridge views",
      evening: "Sushi omakase in Ginza",
    },
  ],
  hotels: [
    {
      name: "Shinjuku Granbell Hotel",
      image: "",
      location: "Shinjuku, Tokyo",
      rating: 4.6,
      pricePerNight: "$145",
      description: "Modern hotel near nightlife and transit.",
    },
    {
      name: "Hotel Gracery Shinjuku",
      image: "",
      location: "Kabukicho, Tokyo",
      rating: 4.4,
      pricePerNight: "$128",
    },
  ],
  flights: [
    {
      airline: "ANA · All Nippon Airways",
      departureAirport: "Tel Aviv (TLV)",
      arrivalAirport: "Tokyo Narita (NRT)",
      departureTime: "14:30",
      arrivalTime: "08:45+1",
      duration: "11h 15m",
      stops: "1 stop",
      price: "$890",
    },
  ],
  budgetBreakdown: {
    flights: "$890",
    hotels: "$580",
    food: "$420",
    activities: "$590",
    transportation: "$120",
    shopping: "$80",
    total: "$2,480",
  },
  activities: [
    {
      name: "Mt. Fuji day trip",
      category: "Nature",
      duration: "Full day",
      price: "$120",
    },
    {
      name: "Tsukiji outer market food tour",
      category: "Food",
      duration: "3 hours",
      price: "$45",
    },
    {
      name: "Akihabara gaming district",
      category: "City",
      duration: "Half day",
      price: "Free",
    },
  ],
  weather: {
    season: "Spring",
    averageTemperature: "18–24°C",
    conditions: "Mild and pleasant with cherry blossoms",
    recommendation: "Pack light layers and comfortable walking shoes.",
  },
  packingList: ["Passport", "Comfortable shoes", "Power adapter", "Light jacket"],
  map: {
    centerDestination: "Tokyo, Japan",
    places: [
      { name: "Shibuya Crossing", type: "Landmark" },
      { name: "Senso-ji Temple", type: "Culture" },
      { name: "Ginza", type: "Shopping" },
    ],
  },
  transportation: [
    {
      type: "Metro",
      description: "Best way to get around the city",
      estimatedCost: "$8/day",
    },
  ],
  restaurants: [
    {
      name: "Ichiran Ramen",
      cuisine: "Japanese",
      priceRange: "$$",
      description: "Famous tonkotsu ramen experience.",
      rating: 4.7,
    },
  ],
  aiTips: [
    "Get a Suica card for easy transit payments.",
    "Visit popular spots early to avoid crowds.",
  ],
  bestTimeToVisit: {
    months: ["March", "April", "October", "November"],
    reason: "Comfortable weather and seasonal highlights.",
  },
  localTips: ["Cash is still common at smaller shops."],
  currencyInfo: {
    currency: "Japanese Yen",
    symbol: "¥",
    exchangeTip: "Withdraw yen at 7-Eleven ATMs.",
  },
  safetyTips: ["Japan is very safe; keep valuables secure in busy areas."],
}

export function buildGuestPreviewPlan(input: {
  from?: string
  to?: string
  date?: string
}): AiGeneratedTripPlan {
  const destination = input.to?.trim() || guestSamplePreview.hero.destination
  const from = input.from?.trim()

  return {
    ...guestSamplePreview,
    hero: {
      ...guestSamplePreview.hero,
      destination,
      summary: from
        ? `Preview itinerary from ${from} to ${destination}. Sign up to generate your personalized full plan with flights, hotels, and day-by-day activities.`
        : guestSamplePreview.hero.summary,
      duration: input.date
        ? `Trip starting ${input.date}`
        : guestSamplePreview.hero.duration,
    },
    flights: guestSamplePreview.flights.map((flight) => ({
      ...flight,
      departureAirport: from ? `${from} (your city)` : flight.departureAirport,
      arrivalAirport: `${destination} (destination)`,
    })),
  }
}

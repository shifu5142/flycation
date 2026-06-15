export const suggestedPrompts = [
  "3 days in Paris romantic trip",
  "Budget Thailand adventure",
  "Luxury Dubai experience",
  "Backpacking Europe 2 weeks",
] as const

export type TravelStyle = "budget" | "balanced" | "luxury" | "adventure"

export type AiTripPlan = {
  destination: string
  country: string
  duration: string
  budgetTotal: number
  travelStyle: TravelStyle
  image: string
  summary: string
  itinerary: {
    day: number
    title: string
    slots: {
      period: "Morning" | "Afternoon" | "Evening"
      activity: string
      icon: "city" | "food" | "nature" | "nightlife"
    }[]
  }[]
  hotels: {
    name: string
    location: string
    pricePerNight: number
    rating: number
    image: string
  }[]
  flight: {
    airline: string
    departure: string
    arrival: string
    duration: string
    price: number
    stops: string
  }
  activities: {
    name: string
    type: "food" | "nature" | "city" | "nightlife"
    duration: string
    price: number
  }[]
  budget: {
    flights: number
    hotels: number
    food: number
    activities: number
  }
}

export const mockAiTripPlan: AiTripPlan = {
  destination: "Tokyo",
  country: "Japan",
  duration: "5 days · 4 nights",
  budgetTotal: 2480,
  travelStyle: "balanced",
  image:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  summary:
    "A balanced Tokyo itinerary mixing iconic districts, local food, and cultural highlights — optimized for first-time visitors with efficient transit routes.",
  itinerary: [
    {
      day: 1,
      title: "Arrival & Shibuya",
      slots: [
        {
          period: "Morning",
          activity: "Land at Narita, express train to Shinjuku",
          icon: "city",
        },
        {
          period: "Afternoon",
          activity: "Check in, explore Shibuya Crossing & Hachiko",
          icon: "city",
        },
        {
          period: "Evening",
          activity: "Ramen dinner in Omoide Yokocho",
          icon: "food",
        },
      ],
    },
    {
      day: 2,
      title: "Culture & Temples",
      slots: [
        {
          period: "Morning",
          activity: "Senso-ji Temple & Asakusa street market",
          icon: "city",
        },
        {
          period: "Afternoon",
          activity: "Ueno Park walk and museum visit",
          icon: "nature",
        },
        {
          period: "Evening",
          activity: "Golden Gai bars in Shinjuku",
          icon: "nightlife",
        },
      ],
    },
    {
      day: 3,
      title: "Modern Tokyo",
      slots: [
        {
          period: "Morning",
          activity: "TeamLab Planets immersive experience",
          icon: "city",
        },
        {
          period: "Afternoon",
          activity: "Odaiba waterfront & Rainbow Bridge views",
          icon: "nature",
        },
        {
          period: "Evening",
          activity: "Sushi omakase in Ginza",
          icon: "food",
        },
      ],
    },
  ],
  hotels: [
    {
      name: "Shinjuku Granbell Hotel",
      location: "Shinjuku, Tokyo",
      pricePerNight: 145,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    },
    {
      name: "Hotel Gracery Shinjuku",
      location: "Kabukicho, Tokyo",
      pricePerNight: 128,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    },
    {
      name: "Asakusa View Hotel",
      location: "Asakusa, Tokyo",
      pricePerNight: 112,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    },
  ],
  flight: {
    airline: "ANA · All Nippon Airways",
    departure: "TLV 14:30",
    arrival: "NRT 08:45+1",
    duration: "11h 15m",
    price: 890,
    stops: "1 stop · IST",
  },
  activities: [
    {
      name: "Mt. Fuji day trip",
      type: "nature",
      duration: "Full day",
      price: 120,
    },
    {
      name: "Tsukiji outer market food tour",
      type: "food",
      duration: "3 hours",
      price: 45,
    },
    {
      name: "Akihabara gaming district",
      type: "city",
      duration: "Half day",
      price: 0,
    },
    {
      name: "Roppongi rooftop nightlife",
      type: "nightlife",
      duration: "Evening",
      price: 60,
    },
  ],
  budget: {
    flights: 890,
    hotels: 580,
    food: 420,
    activities: 590,
  },
}

export const travelStyleLabels: Record<TravelStyle, string> = {
  budget: "Budget",
  balanced: "Balanced",
  luxury: "Luxury",
  adventure: "Adventure",
}

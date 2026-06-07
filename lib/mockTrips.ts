export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface Hotel {
  name: string
  price: number
  rating: number
  image: string
}

export interface Trip {
  id: string
  destination: string
  country: string
  price: number
  pricePerPerson: number
  durationDays: number
  rating: number
  tags: string[]
  dates: string
  startDate: string
  endDate: string
  image: string
  description: string
  budget: {
    flights: number
    hotels: number
    activities: number
    total: number
  }
  itinerary: ItineraryDay[]
  hotels: Hotel[]
}

export const mockTrips: Trip[] = [
  {
    id: "1",
    destination: "Paris",
    country: "France",
    price: 1840,
    pricePerPerson: 1290,
    durationDays: 7,
    rating: 4.9,
    tags: ["Culture", "Food"],
    dates: "Mar 15 – Mar 22, 2026",
    startDate: "2026-03-15",
    endDate: "2026-03-22",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    description: "Romantic week in the City of Light with museums, cafés, and iconic landmarks.",
    budget: { flights: 520, hotels: 980, activities: 340, total: 1840 },
    itinerary: [
      {
        day: 1,
        title: "Arrival + City walk",
        activities: ["Arrive at CDG", "Check in to hotel", "Evening stroll along the Seine", "Dinner in Le Marais"],
      },
      {
        day: 2,
        title: "Museum + Food tour",
        activities: ["Louvre Museum morning visit", "Lunch at a bistro", "Montmartre walking tour", "Sacré-Cœur sunset"],
      },
      {
        day: 3,
        title: "Shopping + Nightlife",
        activities: ["Champs-Élysées shopping", "Lunch at Galeries Lafayette", "Seine river cruise", "Night out in Bastille"],
      },
    ],
    hotels: [
      { name: "Hotel Le Marais", price: 140, rating: 4.5, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
      { name: "Boutique Saint-Germain", price: 195, rating: 4.8, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" },
    ],
  },
  {
    id: "2",
    destination: "Tokyo",
    country: "Japan",
    price: 2650,
    pricePerPerson: 1890,
    durationDays: 8,
    rating: 4.8,
    tags: ["Culture", "Nightlife"],
    dates: "Apr 5 – Apr 12, 2026",
    startDate: "2026-04-05",
    endDate: "2026-04-12",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    description: "Explore neon streets, ancient temples, and world-class cuisine in Japan's capital.",
    budget: { flights: 890, hotels: 1200, activities: 560, total: 2650 },
    itinerary: [
      {
        day: 1,
        title: "Arrival + Shibuya",
        activities: ["Land at Narita", "Check in Shinjuku", "Shibuya Crossing", "Ramen dinner"],
      },
      {
        day: 2,
        title: "Temples + Markets",
        activities: ["Senso-ji Temple", "Asakusa street food", "Akihabara electronics", "Karaoke night"],
      },
      {
        day: 3,
        title: "Culture + Nightlife",
        activities: ["Meiji Shrine", "Harajuku fashion district", "TeamLab Planets", "Golden Gai bars"],
      },
    ],
    hotels: [
      { name: "Shinjuku Grand Hotel", price: 180, rating: 4.6, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80" },
      { name: "Asakusa Ryokan", price: 220, rating: 4.9, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80" },
    ],
  },
  {
    id: "3",
    destination: "Barcelona",
    country: "Spain",
    price: 1520,
    pricePerPerson: 980,
    durationDays: 7,
    rating: 4.7,
    tags: ["Beach", "Architecture"],
    dates: "May 10 – May 17, 2026",
    startDate: "2026-05-10",
    endDate: "2026-05-17",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    description: "Gaudí architecture, Mediterranean beaches, and vibrant tapas culture.",
    budget: { flights: 380, hotels: 840, activities: 300, total: 1520 },
    itinerary: [
      {
        day: 1,
        title: "Arrival + Gothic Quarter",
        activities: ["Arrive at El Prat", "Hotel check-in", "Gothic Quarter walk", "Tapas dinner"],
      },
      {
        day: 2,
        title: "Gaudí + Beach",
        activities: ["Sagrada Família", "Park Güell", "Barceloneta beach", "Seafood paella"],
      },
      {
        day: 3,
        title: "Markets + Nightlife",
        activities: ["La Boqueria market", "Picasso Museum", "El Born district", "Flamenco show"],
      },
    ],
    hotels: [
      { name: "Hotel Gothic", price: 120, rating: 4.4, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" },
      { name: "Barceloneta Beach Resort", price: 165, rating: 4.7, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b938?w=400&q=80" },
    ],
  },
  {
    id: "4",
    destination: "Bali",
    country: "Indonesia",
    price: 1980,
    pricePerPerson: 1150,
    durationDays: 10,
    rating: 4.9,
    tags: ["Nature", "Relaxation"],
    dates: "Jun 1 – Jun 10, 2026",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    description: "Tropical paradise with rice terraces, temples, and stunning beaches.",
    budget: { flights: 720, hotels: 900, activities: 360, total: 1980 },
    itinerary: [
      {
        day: 1,
        title: "Arrival + Ubud",
        activities: ["Arrive in Denpasar", "Transfer to Ubud", "Monkey Forest", "Balinese dinner"],
      },
      {
        day: 2,
        title: "Rice Terraces + Temples",
        activities: ["Tegallalang rice terraces", "Tirta Empul temple", "Coffee plantation", "Spa treatment"],
      },
      {
        day: 3,
        title: "Beach + Sunset",
        activities: ["Seminyak beach day", "Surf lesson", "Beach club lunch", "Uluwatu sunset"],
      },
    ],
    hotels: [
      { name: "Ubud Jungle Retreat", price: 95, rating: 4.8, image: "https://images.unsplash.com/photo-1455587734954-919b08558827?w=400&q=80" },
      { name: "Seminyak Beach Villa", price: 130, rating: 4.6, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80" },
    ],
  },
]

export function getTripById(id: string): Trip | undefined {
  return mockTrips.find((trip) => trip.id === id)
}

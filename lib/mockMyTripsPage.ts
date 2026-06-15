export type TripStatus = "planned" | "ongoing" | "completed" | "draft"

export type UserTrip = {
  id: string
  destination: string
  country: string
  image: string
  dates: string
  startDate: string
  endDate: string
  status: TripStatus
  travelers: number
  weather: { temp: string; condition: string }
  notes: string
}

export const upcomingTrips: UserTrip[] = [
  {
    id: "u1",
    destination: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    dates: "Apr 12 – Apr 20, 2026",
    startDate: "2026-04-12",
    endDate: "2026-04-20",
    status: "planned",
    travelers: 2,
    weather: { temp: "18°C", condition: "Partly cloudy" },
    notes: "Book Shibuya hotel, teamLab tickets, and JR Pass before departure.",
  },
  {
    id: "u2",
    destination: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    dates: "May 3 – May 10, 2026",
    startDate: "2026-05-03",
    endDate: "2026-05-10",
    status: "ongoing",
    travelers: 1,
    weather: { temp: "22°C", condition: "Sunny" },
    notes: "Sagrada Família at 9am. Dinner reservation in El Born on Friday.",
  },
]

export const pastTrips: UserTrip[] = [
  {
    id: "p1",
    destination: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    dates: "Jan 8 – Jan 15, 2026",
    startDate: "2026-01-08",
    endDate: "2026-01-15",
    status: "completed",
    travelers: 2,
    weather: { temp: "6°C", condition: "Light rain" },
    notes: "Amazing trip! Revisit Le Marais bakery and Seine cruise.",
  },
  {
    id: "p2",
    destination: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    dates: "Nov 2 – Nov 12, 2025",
    startDate: "2025-11-02",
    endDate: "2025-11-12",
    status: "completed",
    travelers: 3,
    weather: { temp: "29°C", condition: "Humid, sunny" },
    notes: "Ubud rice terraces were the highlight. Book villa earlier next time.",
  },
]

export const draftTrips: UserTrip[] = [
  {
    id: "d1",
    destination: "Reykjavik",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    dates: "Dates not set",
    startDate: "",
    endDate: "",
    status: "draft",
    travelers: 2,
    weather: { temp: "—", condition: "Not available" },
    notes: "Northern lights tour + Blue Lagoon. Need to pick travel window.",
  },
]

export const statusLabels: Record<TripStatus, string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  draft: "Draft",
}

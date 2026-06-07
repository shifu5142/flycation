export interface Flight {
  id: string
  airline: string
  price: number
  duration: string
  stops: number
  departure: string
  arrival: string
  tripId: string
}

export const mockFlights: Flight[] = [
  {
    id: "f1",
    airline: "Air France",
    price: 520,
    duration: "7h 30m",
    stops: 0,
    departure: "JFK 8:00 AM",
    arrival: "CDG 9:30 PM",
    tripId: "1",
  },
  {
    id: "f2",
    airline: "Delta",
    price: 480,
    duration: "9h 15m",
    stops: 1,
    departure: "JFK 6:30 PM",
    arrival: "CDG 11:45 AM+1",
    tripId: "1",
  },
  {
    id: "f3",
    airline: "Japan Airlines",
    price: 890,
    duration: "14h 20m",
    stops: 0,
    departure: "LAX 11:00 AM",
    arrival: "NRT 3:20 PM+1",
    tripId: "2",
  },
  {
    id: "f4",
    airline: "ANA",
    price: 820,
    duration: "16h 45m",
    stops: 1,
    departure: "SFO 1:00 PM",
    arrival: "HND 6:45 PM+1",
    tripId: "2",
  },
  {
    id: "f5",
    airline: "Iberia",
    price: 380,
    duration: "8h 10m",
    stops: 0,
    departure: "MIA 9:00 PM",
    arrival: "BCN 11:10 AM+1",
    tripId: "3",
  },
  {
    id: "f6",
    airline: "Vueling",
    price: 320,
    duration: "10h 30m",
    stops: 1,
    departure: "ORD 7:00 PM",
    arrival: "BCN 2:30 PM+1",
    tripId: "3",
  },
  {
    id: "f7",
    airline: "Singapore Airlines",
    price: 720,
    duration: "22h 15m",
    stops: 1,
    departure: "LAX 10:30 PM",
    arrival: "DPS 6:45 AM+2",
    tripId: "4",
  },
  {
    id: "f8",
    airline: "Garuda Indonesia",
    price: 680,
    duration: "24h 00m",
    stops: 2,
    departure: "SFO 11:00 AM",
    arrival: "DPS 11:00 AM+2",
    tripId: "4",
  },
]

export function getFlightsByTripId(tripId: string): Flight[] {
  return mockFlights.filter((flight) => flight.tripId === tripId)
}

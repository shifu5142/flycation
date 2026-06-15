export type BookingStatus = "confirmed" | "pending" | "cancelled"

export type BookingType = "flight" | "hotel" | "package"

export type BookingTimelineStep = {
  label: string
  date: string
  done: boolean
}

export type Booking = {
  id: string
  type: BookingType
  title: string
  subtitle: string
  reference: string
  dates: string
  time?: string
  status: BookingStatus
  image: string
  price: number
  travelers: number
  timeline: BookingTimelineStep[]
}

export const upcomingBookings: Booking[] = [
  {
    id: "b1",
    type: "flight",
    title: "TLV → NRT",
    subtitle: "El Al · Economy · Non-stop",
    reference: "FC-8X29K",
    dates: "Apr 12, 2026",
    time: "14:30 – 06:15+1",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    price: 1240,
    travelers: 2,
    timeline: [
      { label: "Booked", date: "Mar 1", done: true },
      { label: "Confirmed", date: "Mar 2", done: true },
      { label: "Check-in opens", date: "Apr 11", done: false },
      { label: "Departure", date: "Apr 12", done: false },
    ],
  },
  {
    id: "b2",
    type: "hotel",
    title: "Shinjuku Grand Hotel",
    subtitle: "Tokyo, Japan · 7 nights",
    reference: "HT-44102",
    dates: "Apr 12 – Apr 19, 2026",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 980,
    travelers: 2,
    timeline: [
      { label: "Booked", date: "Mar 3", done: true },
      { label: "Confirmed", date: "Mar 3", done: true },
      { label: "Check-in", date: "Apr 12", done: false },
      { label: "Check-out", date: "Apr 19", done: false },
    ],
  },
  {
    id: "b3",
    type: "package",
    title: "Barcelona City Break",
    subtitle: "Flight + Hotel · 4 nights",
    reference: "PK-7721M",
    dates: "May 3 – May 7, 2026",
    status: "pending",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    price: 1560,
    travelers: 1,
    timeline: [
      { label: "Booked", date: "Mar 18", done: true },
      { label: "Awaiting confirmation", date: "—", done: false },
      { label: "Documents sent", date: "—", done: false },
      { label: "Trip start", date: "May 3", done: false },
    ],
  },
]

export const pastBookings: Booking[] = [
  {
    id: "b4",
    type: "flight",
    title: "CDG → TLV",
    subtitle: "Air France · Premium Economy",
    reference: "FC-2P88L",
    dates: "Jan 15, 2026",
    time: "11:00 – 17:45",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    price: 620,
    travelers: 2,
    timeline: [
      { label: "Booked", date: "Dec 5", done: true },
      { label: "Confirmed", date: "Dec 5", done: true },
      { label: "Completed", date: "Jan 15", done: true },
    ],
  },
  {
    id: "b5",
    type: "hotel",
    title: "Hotel Le Marais",
    subtitle: "Paris, France · 5 nights",
    reference: "HT-99201",
    dates: "Jan 8 – Jan 13, 2026",
    status: "cancelled",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 0,
    travelers: 2,
    timeline: [
      { label: "Booked", date: "Nov 20", done: true },
      { label: "Cancelled", date: "Dec 1", done: true },
    ],
  },
]

export const statusLabels: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
}

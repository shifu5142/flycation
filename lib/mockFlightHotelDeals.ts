export type FlightHotelDeal = {
  id: string
  hotelName: string
  country: string
  city: string
  price: number
  rating: number
  image: string
  coordinates: { lat: number; lng: number }
  includesFlight: true
}

export const flightHotelDeals: FlightHotelDeal[] = [
  {
    id: "paris-le-marais",
    hotelName: "Hôtel Le Marais Boutique",
    country: "France",
    city: "Paris",
    price: 1249,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    includesFlight: true,
  },
  {
    id: "tokyo-shinjuku",
    hotelName: "Shinjuku Skyline Hotel",
    country: "Japan",
    city: "Tokyo",
    price: 1899,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    includesFlight: true,
  },
  {
    id: "bali-seminyak",
    hotelName: "Seminyak Beach Resort",
    country: "Indonesia",
    city: "Bali",
    price: 1099,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    coordinates: { lat: -8.6919, lng: 115.1683 },
    includesFlight: true,
  },
  {
    id: "nyc-midtown",
    hotelName: "Midtown Manhattan Suites",
    country: "United States",
    city: "New York",
    price: 1599,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    coordinates: { lat: 40.758, lng: -73.9855 },
    includesFlight: true,
  },
  {
    id: "barcelona-gothic",
    hotelName: "Gothic Quarter Hotel",
    country: "Spain",
    city: "Barcelona",
    price: 899,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    coordinates: { lat: 41.3874, lng: 2.1686 },
    includesFlight: true,
  },
  {
    id: "dubai-marina",
    hotelName: "Marina Bay Luxury",
    country: "United Arab Emirates",
    city: "Dubai",
    price: 2149,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    coordinates: { lat: 25.0772, lng: 55.1393 },
    includesFlight: true,
  },
  {
    id: "rome-centro",
    hotelName: "Centro Storico Roma",
    country: "Italy",
    city: "Rome",
    price: 979,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    includesFlight: true,
  },
  {
    id: "london-westminster",
    hotelName: "Westminster Grand",
    country: "United Kingdom",
    city: "London",
    price: 1349,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1618773928123-c1d5f6097412?w=800&q=80",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    includesFlight: true,
  },
  {
    id: "cancun-playa",
    hotelName: "Playa Caribe Resort",
    country: "Mexico",
    city: "Cancún",
    price: 849,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    coordinates: { lat: 21.1619, lng: -86.8515 },
    includesFlight: true,
  },
  {
    id: "sydney-harbour",
    hotelName: "Harbour View Sydney",
    country: "Australia",
    city: "Sydney",
    price: 1749,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    includesFlight: true,
  },
]

export const dealCountries = [
  ...new Set(flightHotelDeals.map((d) => d.country)),
].sort()

export type PriceRangeFilter = "all" | "under1000" | "1000-1500" | "over1500"
export type RatingFilter = "all" | "4" | "4.5"
export type SortOption = "price-asc" | "price-desc" | "rating-desc"

export function filterAndSortDeals(
  deals: FlightHotelDeal[],
  options: {
    country: string
    priceRange: PriceRangeFilter
    rating: RatingFilter
    sort: SortOption
  }
): FlightHotelDeal[] {
  let result = [...deals]

  if (options.country !== "all") {
    result = result.filter((d) => d.country === options.country)
  }

  if (options.priceRange === "under1000") {
    result = result.filter((d) => d.price < 1000)
  } else if (options.priceRange === "1000-1500") {
    result = result.filter((d) => d.price >= 1000 && d.price <= 1500)
  } else if (options.priceRange === "over1500") {
    result = result.filter((d) => d.price > 1500)
  }

  if (options.rating === "4") {
    result = result.filter((d) => d.rating >= 4)
  } else if (options.rating === "4.5") {
    result = result.filter((d) => d.rating >= 4.5)
  }

  result.sort((a, b) => {
    if (options.sort === "price-asc") return a.price - b.price
    if (options.sort === "price-desc") return b.price - a.price
    return b.rating - a.rating
  })

  return result
}

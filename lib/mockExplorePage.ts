export type ExploreDestination = {
  id: string
  name: string
  country: string
  image: string
  rating: number
  reviews: number
  priceFrom: number
  region: string
  season: string
  description: string
  featured?: boolean
  trending?: boolean
}

export const exploreDestinations: ExploreDestination[] = [
  {
    id: "e1",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8dbf0bd?w=800&q=80",
    rating: 4.9,
    reviews: 2840,
    priceFrom: 890,
    region: "Europe",
    season: "Summer",
    description: "Whitewashed villages, caldera views, and Mediterranean sunsets.",
    featured: true,
    trending: true,
  },
  {
    id: "e2",
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    rating: 4.8,
    reviews: 3120,
    priceFrom: 1120,
    region: "Asia",
    season: "Spring",
    description: "Temples, cherry blossoms, and timeless Japanese culture.",
    featured: true,
  },
  {
    id: "e3",
    name: "Cape Town",
    country: "South Africa",
    image: "https://images.unsplash.com/photo-1580060839134-75a5e2a67363?w=800&q=80",
    rating: 4.7,
    reviews: 1560,
    priceFrom: 760,
    region: "Africa",
    season: "Autumn",
    description: "Table Mountain, coastal drives, and vibrant food scene.",
    trending: true,
  },
  {
    id: "e4",
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    rating: 4.6,
    reviews: 4200,
    priceFrom: 980,
    region: "Americas",
    season: "Winter",
    description: "Iconic skyline, Broadway, and world-class museums.",
    featured: true,
    trending: true,
  },
  {
    id: "e5",
    name: "Queenstown",
    country: "New Zealand",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    rating: 4.9,
    reviews: 980,
    priceFrom: 1340,
    region: "Oceania",
    season: "Summer",
    description: "Adventure capital with lakes, peaks, and outdoor thrills.",
  },
  {
    id: "e6",
    name: "Marrakech",
    country: "Morocco",
    image: "https://images.unsplash.com/photo-1517821362941-f7f753107065?w=800&q=80",
    rating: 4.5,
    reviews: 1890,
    priceFrom: 540,
    region: "Africa",
    season: "Spring",
    description: "Souks, riads, and the gateway to the Sahara.",
    trending: true,
  },
]

export const exploreRegions = ["All", "Europe", "Asia", "Africa", "Americas", "Oceania"]
export const exploreSeasons = ["All", "Spring", "Summer", "Autumn", "Winter"]
export const explorePriceRanges = ["Any", "Under $700", "$700–$1000", "$1000+"]

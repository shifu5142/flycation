const STATIC_COUNTRY_SLUGS = new Set([
  "australia",
  "brazil",
  "canada",
  "china",
  "default",
  "egypt",
  "fiji",
  "france",
  "germany",
  "greece",
  "india",
  "indonesia",
  "italy",
  "japan",
  "kenya",
  "mexico",
  "morocco",
  "new-zealand",
  "south-africa",
  "south-korea",
  "spain",
  "thailand",
  "united-kingdom",
  "united-states",
  "usa",
])

const COUNTRY_ALIASES: Record<string, string> = {
  usa: "usa",
  "united states": "united-states",
  "united states of america": "united-states",
  uk: "united-kingdom",
  "united kingdom": "united-kingdom",
  "south korea": "south-korea",
  "republic of korea": "south-korea",
  "new zealand": "new-zealand",
  "south africa": "south-africa",
}

export function countryToSlug(country: string): string {
  return country
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export function getStaticCountryImagePath(country: string): string {
  const normalized = country.trim().toLowerCase()
  const slug = COUNTRY_ALIASES[normalized] ?? countryToSlug(country)

  if (STATIC_COUNTRY_SLUGS.has(slug)) {
    return `/countries/${slug}.jpg`
  }

  return "/countries/default.jpg"
}

export function hasStaticCountryImage(country: string): boolean {
  const normalized = country.trim().toLowerCase()
  const slug = COUNTRY_ALIASES[normalized] ?? countryToSlug(country)
  return STATIC_COUNTRY_SLUGS.has(slug)
}

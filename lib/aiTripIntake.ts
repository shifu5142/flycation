import {
  mockAiTripPlan,
  type AiTripPlan,
  type TravelStyle,
} from "@/lib/mockAiTripPlan"

export const TRAVEL_STYLES = [
  "Relaxing",
  "Adventure",
  "Romantic",
  "Luxury",
  "Backpacking",
  "Family",
] as const

export type UserTravelStyle = (typeof TRAVEL_STYLES)[number]

export const INTERESTS = [
  "Food",
  "Nightlife",
  "Nature",
  "History",
  "Shopping",
  "Culture",
  "Beaches",
] as const

export type TripInterest = (typeof INTERESTS)[number]

export type TravelerType = "solo" | "couple" | "group"

export type TripIntakeData = {
  destination: string | null
  duration: string | null
  budget: string | null
  travelStyle: UserTravelStyle | null
  travelers: { type: TravelerType; count: number } | null
  interests: TripInterest[]
}

export type IntakeField =
  | "destination"
  | "duration"
  | "budget"
  | "travelStyle"
  | "travelers"
  | "interests"

export type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

export const INITIAL_TRIP_INTAKE: TripIntakeData = {
  destination: null,
  duration: null,
  budget: null,
  travelStyle: null,
  travelers: null,
  interests: [],
}

export const DURATION_OPTIONS = ["3 days", "5 days", "1 week", "2 weeks"] as const
export const BUDGET_OPTIONS = ["$1,000", "$2,000", "$3,500", "$5,000+"] as const

const FIELD_ORDER: IntakeField[] = [
  "destination",
  "duration",
  "budget",
  "travelStyle",
  "travelers",
  "interests",
]

export function getNextField(
  data: TripIntakeData | null | undefined
): IntakeField | null {
  if (!data) return "destination"
  for (const field of FIELD_ORDER) {
    if (field === "interests") {
      if (data.interests.length === 0) return "interests"
      continue
    }
    if (data[field] === null) return field
  }
  return null
}

export function isIntakeComplete(data: TripIntakeData): boolean {
  return getNextField(data) === null
}

export function getQuestionForField(
  field: IntakeField,
  travelersStep?: "type" | "count"
): string {
  switch (field) {
    case "destination":
      return "Great! Where do you want to travel?"
    case "duration":
      return "How many days are you planning to travel, or what dates do you have in mind?"
    case "budget":
      return "What's your estimated total budget for this trip?"
    case "travelStyle":
      return "What travel style fits you best?"
    case "travelers":
      if (travelersStep === "count") {
        return "How many people will be in your group?"
      }
      return "Who's traveling with you?"
    case "interests":
      return "What are you most interested in? Pick all that apply, then tap Continue."
    default:
      return ""
  }
}

export function getWelcomeMessage(): string {
  return "Hi! I'm your Flycation travel assistant. I'll ask a few quick questions so I can build a personalized itinerary for you.\n\nWhere do you want to travel?"
}

export function getCompletionMessage(data: TripIntakeData): string {
  return `Perfect — I have everything I need for your ${data.destination} trip! Review your trip summary on the right, then tap **Generate Trip** when you're ready.`
}

export function formatTravelers(data: TripIntakeData): string | null {
  if (!data.travelers) return null
  const { type, count } = data.travelers
  if (type === "solo") return "Solo (1)"
  if (type === "couple") return "Couple (2)"
  return `Group (${count} people)`
}

export function formatInterests(interests: TripInterest[]): string | null {
  if (interests.length === 0) return null
  return interests.join(", ")
}

function mapTravelStyle(style: UserTravelStyle): TravelStyle {
  switch (style) {
    case "Backpacking":
      return "budget"
    case "Luxury":
      return "luxury"
    case "Adventure":
      return "adventure"
    default:
      return "balanced"
  }
}

function parseBudget(budget: string): number {
  const digits = budget.replace(/[^0-9]/g, "")
  const value = Number(digits)
  if (!value) return mockAiTripPlan.budgetTotal
  return value
}

export function buildMockPlanFromIntake(data: TripIntakeData): AiTripPlan {
  const budgetTotal = parseBudget(data.budget ?? "")
  const destination = data.destination ?? mockAiTripPlan.destination
  const style = data.travelStyle
    ? mapTravelStyle(data.travelStyle)
    : mockAiTripPlan.travelStyle
  const interestList = data.interests.join(", ").toLowerCase()
  const travelerLabel = formatTravelers(data) ?? "your party"

  return {
    ...mockAiTripPlan,
    destination,
    country: mockAiTripPlan.country,
    duration: data.duration ?? mockAiTripPlan.duration,
    budgetTotal,
    travelStyle: style,
    summary: `A ${data.travelStyle?.toLowerCase() ?? "personalized"} ${destination} itinerary for ${travelerLabel}, focused on ${interestList || "top highlights"} — tailored from your preferences.`,
    budget: {
      flights: Math.round(budgetTotal * 0.36),
      hotels: Math.round(budgetTotal * 0.23),
      food: Math.round(budgetTotal * 0.17),
      activities: Math.round(budgetTotal * 0.24),
    },
  }
}

export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

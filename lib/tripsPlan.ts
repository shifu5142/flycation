import type { AiGeneratedTripPlan } from "@/lib/aiGeneratedTripPlanTypes"
import { parsePriceAmount } from "@/lib/aiGeneratedTripPlanTypes"
import { guestSamplePreview } from "@/lib/guestPreviewTrip"

export type TripsPlanInsert = {
  user_id: string
  destination: string
  country: string
  image: string
  summary: string
  duration: string
  itinerary: AiGeneratedTripPlan["itinerary"]
  hotels: AiGeneratedTripPlan["hotels"]
  flights: AiGeneratedTripPlan["flights"]
  activities: AiGeneratedTripPlan["activities"]
  restaurants: AiGeneratedTripPlan["restaurants"]
  transportation: AiGeneratedTripPlan["transportation"]
  weather_season: string
  weather_average_temperature: string
  weather_conditions: string
  weather_recommendation: string
  currency: string
  currency_symbol: string
  exchange_tip: string
  best_time_months: string[]
  best_time_reason: string
  budget_flights: string
  budget_hotels: string
  budget_food: string
  budget_activities: string
  budget_transportation: string
  map_center_destination: string
  map_places: AiGeneratedTripPlan["map"]["places"]
  ai_tips: string[]
  local_tips: string[]
  safety_tips: string[]
  packing_list: string[]
}

export type TripsPlanRow = TripsPlanInsert & {
  id: string
  created_at: string
}

export function toTripsPlanInsert(
  plan: AiGeneratedTripPlan,
  userId: string
): TripsPlanInsert {
  return {
    user_id: userId,
    destination: plan.hero.destination,
    country: plan.hero.country,
    image: plan.hero.image,
    summary: plan.hero.summary,
    duration: plan.hero.duration,
    itinerary: plan.itinerary,
    hotels: plan.hotels,
    flights: plan.flights,
    activities: plan.activities,
    restaurants: plan.restaurants,
    transportation: plan.transportation,
    weather_season: plan.weather.season,
    weather_average_temperature: plan.weather.averageTemperature,
    weather_conditions: plan.weather.conditions,
    weather_recommendation: plan.weather.recommendation,
    currency: plan.currencyInfo.currency,
    currency_symbol: plan.currencyInfo.symbol,
    exchange_tip: plan.currencyInfo.exchangeTip,
    best_time_months: plan.bestTimeToVisit.months,
    best_time_reason: plan.bestTimeToVisit.reason,
    budget_flights: plan.budgetBreakdown.flights,
    budget_hotels: plan.budgetBreakdown.hotels,
    budget_food: plan.budgetBreakdown.food,
    budget_activities: plan.budgetBreakdown.activities,
    budget_transportation: plan.budgetBreakdown.transportation,
    map_center_destination: plan.map.centerDestination,
    map_places: plan.map.places,
    ai_tips: plan.aiTips,
    local_tips: plan.localTips,
    safety_tips: plan.safetyTips,
    packing_list: plan.packingList,
  }
}

export function toAiGeneratedTripPlan(row: TripsPlanRow): AiGeneratedTripPlan {
  const budgetParts = [
    row.budget_flights,
    row.budget_hotels,
    row.budget_food,
    row.budget_activities,
    row.budget_transportation,
  ]
  const budgetTotal = budgetParts.reduce(
    (sum, value) => sum + parsePriceAmount(value),
    0
  )
  const currencyPrefix = row.currency_symbol?.trim() || "$"

  return {
    hero: {
      destination: row.destination,
      country: row.country,
      image: row.image,
      summary: row.summary,
      duration: row.duration,
      budget:
        budgetTotal > 0
          ? `${currencyPrefix}${budgetTotal.toLocaleString()}`
          : "—",
      travelStyle: "Saved plan",
    },
    itinerary: row.itinerary ?? [],
    hotels: row.hotels ?? [],
    flights: row.flights ?? [],
    budgetBreakdown: {
      flights: row.budget_flights,
      hotels: row.budget_hotels,
      food: row.budget_food,
      activities: row.budget_activities,
      transportation: row.budget_transportation,
      shopping: "",
      total:
        budgetTotal > 0
          ? `${currencyPrefix}${budgetTotal.toLocaleString()}`
          : "—",
    },
    activities: row.activities ?? [],
    weather: {
      season: row.weather_season,
      averageTemperature: row.weather_average_temperature,
      conditions: row.weather_conditions,
      recommendation: row.weather_recommendation,
    },
    packingList: row.packing_list ?? [],
    map: {
      centerDestination: row.map_center_destination,
      places: row.map_places ?? [],
    },
    transportation: row.transportation ?? [],
    restaurants: row.restaurants ?? [],
    aiTips: row.ai_tips ?? [],
    bestTimeToVisit: {
      months: row.best_time_months ?? [],
      reason: row.best_time_reason,
    },
    localTips: row.local_tips ?? [],
    currencyInfo: {
      currency: row.currency,
      symbol: row.currency_symbol,
      exchangeTip: row.exchange_tip,
    },
    safetyTips: row.safety_tips ?? [],
  }
}

export function createMockTripsPlanRow(id: string): TripsPlanRow {
  return {
    id,
    created_at: new Date().toISOString(),
    ...toTripsPlanInsert(
      guestSamplePreview,
      "00000000-0000-0000-0000-000000000000"
    ),
  }
}

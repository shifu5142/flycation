import { generateText } from "ai"
import { z } from "zod"

const TripSchema = z.object({
  hero: z.object({
    destination: z.string(),
    country: z.string(),
    image: z.string(),
    summary: z.string(),
    duration: z.string(),
    budget: z.string(),
    travelStyle: z.string(),
  }),

  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
    })
  ),

  hotels: z.array(z.any()),
  flights: z.array(z.any()),
  budgetBreakdown: z.any(),
  activities: z.array(z.any()),
  weather: z.any(),
  packingList: z.array(z.string()),
  map: z.any(),
  transportation: z.array(z.any()),
  restaurants: z.array(z.any()),
  aiTips: z.array(z.string()),
  bestTimeToVisit: z.any(),
  localTips: z.array(z.string()),
  currencyInfo: z.any(),
  safetyTips: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const promptAi = `
You are an expert travel planning AI.

Your job is to receive user travel preferences and generate a complete structured vacation plan.

IMPORTANT RULES

- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT explain anything.
- Do NOT include text before or after the JSON.
- Always return ALL sections.
- Never omit properties.
- Use English.
- Generate realistic recommendations.
- The response will be parsed directly by the frontend.
- Always return arrays even if they are empty.
- Prices should include "$".
- Return enough information to build an entire vacation page.

USER PREFERENCES:

${JSON.stringify(body.tripAnswers, null, 2)}

OUTPUT FORMAT

Return EXACTLY this structure:

{
  "hero": {
    "destination": "",
    "country": "",
    "image": "",
    "summary": "",
    "duration": "",
    "budget": "",
    "travelStyle": ""
  },

  "itinerary": [
    {
      "day": 1,
      "title": "",
      "morning": "",
      "afternoon": "",
      "evening": ""
    }
  ],

  "hotels": [
    {
      "name": "",
      "image": "",
      "location": "",
      "rating": 0,
      "pricePerNight": "",
      "description": "",
      "amenities": [],
      "priceLevel": "",
      "coordinates": {
        "lat": 0,
        "lng": 0
      }
    }
  ],

  "flights": [
    {
      "airline": "",
      "departureAirport": "",
      "arrivalAirport": "",
      "departureTime": "",
      "arrivalTime": "",
      "duration": "",
      "stops": "",
      "cabinClass": "",
      "price": "",
      "currency": "USD",
      "bookingProvider": "",
      "baggageIncluded": true
    }
  ],

  "budgetBreakdown": {
    "flights": "",
    "hotels": "",
    "food": "",
    "activities": "",
    "transportation": "",
    "shopping": "",
    "total": ""
  },

  "activities": [
    {
      "name": "",
      "category": "",
      "duration": "",
      "price": "",
      "description": ""
    }
  ],

  "weather": {
    "season": "",
    "averageTemperature": "",
    "conditions": "",
    "recommendation": ""
  },

  "packingList": [],

  "map": {
    "centerDestination": "",
    "places": [
      {
        "name": "",
        "type": "",
        "coordinates": {
          "lat": 0,
          "lng": 0
        }
      }
    ]
  },

  "transportation": [
    {
      "type": "",
      "description": "",
      "estimatedCost": ""
    }
  ],

  "restaurants": [
    {
      "name": "",
      "cuisine": "",
      "priceRange": "",
      "description": "",
      "rating": 0
    }
  ],

  "aiTips": [],

  "bestTimeToVisit": {
    "months": [],
    "reason": ""
  },

  "localTips": [],

  "currencyInfo": {
    "currency": "",
    "symbol": "",
    "exchangeTip": ""
  },

  "safetyTips": []
}

SECTION RULES

- Generate one itinerary object per day.
- Return 3-5 hotels.
- Return 1-5 flight suggestions including prices.
- Return 5-15 activities.
- Return 10-20 packing list items.
- Return 10-20 map locations.
- Return several transportation options.
- Return 5-10 restaurants.
- Return 5-10 AI tips.
- Return 5-10 local tips.
- Return 5-10 safety tips.

FINAL RULE

Return ONLY machine-readable JSON.

No explanations.

No markdown.

No additional text.
`

    const result = await generateText({
      model: "openai/gpt-4.1-mini",
      prompt: promptAi,
    })

    const raw = result.text

    // remove possible ```json wrappers
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const json = JSON.parse(cleaned)

    return Response.json(json)
  } catch (err) {
    return Response.json(
      { error: "Invalid AI response" },
      { status: 500 }
    )
  }
}
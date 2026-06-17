import { generateText } from "ai"

import type { TripIntakeData } from "@/lib/aiTripIntake"
import { isNonEnglishLocale } from "@/i18n/locales"
import {
  shouldTranslateTripAnswers,
  textNeedsEnglishTranslation,
} from "@/lib/tripAnswersEnglish"

export async function translateTextToEnglish(
  text: string,
  force = false
): Promise<string> {
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  if (!force && !textNeedsEnglishTranslation(trimmed)) return trimmed

  const result = await generateText({
    model: "openai/gpt-4.1-mini",
    prompt: `Translate the following travel-related user input to English. Return ONLY the translated text, with no quotes or explanation.

Input:
${trimmed}`,
  })

  return result.text.trim() || trimmed
}

async function translateField(
  value: string | null,
  force: boolean
): Promise<string | null> {
  if (!value?.trim()) return value
  if (!force && !textNeedsEnglishTranslation(value)) return value
  return translateTextToEnglish(value, force)
}

function normalizeTripIntakeData(data: TripIntakeData): TripIntakeData {
  return {
    destination: data.destination ?? null,
    duration: data.duration ?? null,
    budget: data.budget ?? null,
    travelStyle: data.travelStyle ?? null,
    travelers: data.travelers ?? null,
    interests: Array.isArray(data.interests) ? [...data.interests] : [],
  }
}

/** Translate only free-text fields; keep TripIntakeData shape identical. */
export async function ensureEnglishTripAnswers(
  tripAnswers: TripIntakeData,
  locale = "en"
): Promise<TripIntakeData> {
  const normalized = normalizeTripIntakeData(tripAnswers)

  if (!shouldTranslateTripAnswers(normalized, locale)) {
    return normalized
  }

  const forceTranslate = isNonEnglishLocale(locale)

  const [destination, duration, budget] = await Promise.all([
    translateField(normalized.destination, forceTranslate),
    translateField(normalized.duration, forceTranslate),
    translateField(normalized.budget, forceTranslate),
  ])

  return normalizeTripIntakeData({
    destination,
    duration,
    budget,
    travelStyle: normalized.travelStyle,
    travelers: normalized.travelers,
    interests: normalized.interests,
  })
}

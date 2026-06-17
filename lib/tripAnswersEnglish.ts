import type { TripIntakeData } from "@/lib/aiTripIntake"
import { isNonEnglishLocale } from "@/i18n/locales"

const NON_ENGLISH_SCRIPT_PATTERN =
  /[\u0590-\u05FF\u0600-\u06FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF]/

const LATIN_ACCENT_PATTERN = /[àáâãäåæçèéêëìíîïñòóôõöùúûüýÿœæ]/i

export function textNeedsEnglishTranslation(
  text: string | null | undefined
): boolean {
  if (!text?.trim()) return false
  return (
    NON_ENGLISH_SCRIPT_PATTERN.test(text) || LATIN_ACCENT_PATTERN.test(text)
  )
}

export function tripAnswersNeedEnglishTranslation(
  tripAnswers: TripIntakeData
): boolean {
  return (
    textNeedsEnglishTranslation(tripAnswers.destination) ||
    textNeedsEnglishTranslation(tripAnswers.duration) ||
    textNeedsEnglishTranslation(tripAnswers.budget)
  )
}

export function shouldTranslateTripAnswers(
  tripAnswers: TripIntakeData,
  locale = "en"
): boolean {
  if (isNonEnglishLocale(locale)) {
    return !!(
      tripAnswers.destination?.trim() ||
      tripAnswers.duration?.trim() ||
      tripAnswers.budget?.trim()
    )
  }

  return tripAnswersNeedEnglishTranslation(tripAnswers)
}

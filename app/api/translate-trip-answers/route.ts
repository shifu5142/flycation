import { isNonEnglishLocale, resolveAppLocale } from "@/i18n/locales"
import type { TripIntakeData } from "@/lib/aiTripIntake"
import {
  ensureEnglishTripAnswers,
  translateTextToEnglish,
} from "@/lib/translateTripAnswers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const locale = resolveAppLocale(body.locale)

    if (typeof body.text === "string") {
      const text = await translateTextToEnglish(
        body.text,
        isNonEnglishLocale(locale)
      )
      return Response.json({ text })
    }

    if (body.tripAnswers) {
      const tripAnswers = await ensureEnglishTripAnswers(
        body.tripAnswers as TripIntakeData,
        locale
      )
      return Response.json({ tripAnswers })
    }

    return Response.json({ error: "Missing text or tripAnswers" }, { status: 400 })
  } catch (err) {
    console.error("translate-trip-answers error:", err)
    return Response.json({ error: "Translation failed" }, { status: 500 })
  }
}

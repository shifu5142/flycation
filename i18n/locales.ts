import type { AppLocale } from "./routing"
import { routing } from "./routing"

export type LocaleLabelKey =
  | "english"
  | "hebrew"
  | "russian"
  | "chinese"
  | "spanish"
  | "french"

export const localeConfig: {
  code: AppLocale
  labelKey: LocaleLabelKey
  countryCode: string
}[] = [
  { code: "en", labelKey: "english", countryCode: "gb" },
  { code: "he", labelKey: "hebrew", countryCode: "il" },
  { code: "ru", labelKey: "russian", countryCode: "ru" },
  { code: "zh", labelKey: "chinese", countryCode: "cn" },
  { code: "es", labelKey: "spanish", countryCode: "es" },
  { code: "fr", labelKey: "french", countryCode: "fr" },
]

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value)
}

export function resolveAppLocale(value: unknown): AppLocale {
  if (typeof value === "string" && isAppLocale(value)) return value
  return routing.defaultLocale
}

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return locale === "he" ? "rtl" : "ltr"
}

export function isNonEnglishLocale(locale: string): boolean {
  return locale !== routing.defaultLocale
}

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
  flag: string
}[] = [
  { code: "en", labelKey: "english", flag: "🇬🇧" },
  { code: "he", labelKey: "hebrew", flag: "🇮🇱" },
  { code: "ru", labelKey: "russian", flag: "🇷🇺" },
  { code: "zh", labelKey: "chinese", flag: "🇨🇳" },
  { code: "es", labelKey: "spanish", flag: "🇪🇸" },
  { code: "fr", labelKey: "french", flag: "🇫🇷" },
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

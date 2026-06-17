import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "he", "ru", "zh", "es", "fr"],
  defaultLocale: "en",
  localePrefix: "never",
})

export type AppLocale = (typeof routing.locales)[number]

export const LOCALE_COOKIE = "NEXT_LOCALE"

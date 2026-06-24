import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { mergeMessages } from "@/lib/mergeMessages"
import { LOCALE_COOKIE, routing } from "./routing"
import { isAppLocale } from "./locales"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  let locale = cookieStore.get(LOCALE_COOKIE)?.value

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale
  }

  const enMessages = (await import("../messages/en.json")).default
  const localeMessages =
    locale === routing.defaultLocale
      ? enMessages
      : (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages: mergeMessages(enMessages, localeMessages),
  }
})

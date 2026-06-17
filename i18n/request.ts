import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { LOCALE_COOKIE, routing } from "./routing"
import { isAppLocale } from "./locales"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  let locale = cookieStore.get(LOCALE_COOKIE)?.value

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

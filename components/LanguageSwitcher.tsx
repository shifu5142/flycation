"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Globe } from "lucide-react"

import { localeConfig } from "@/i18n/locales"
import { LOCALE_COOKIE, type AppLocale } from "@/i18n/routing"
import { LocaleFlag } from "@/components/LocaleFlag"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return

    document.cookie = `${LOCALE_COOKIE}=${nextLocale};path=/;max-age=31536000;samesite=lax`

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("cursor-pointer rounded-lg", className)}
          aria-label={t("language")}
          disabled={isPending}
        >
          <Globe className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {localeConfig.map(({ code, labelKey, countryCode }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchLocale(code)}
            aria-label={t(labelKey)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3",
              locale === code ? "bg-accent font-medium" : undefined
            )}
          >
            <span className="text-sm font-semibold tracking-wide">
              {code.toUpperCase()}
            </span>
            <LocaleFlag countryCode={countryCode} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSwitcher }

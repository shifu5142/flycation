"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Map,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

function AuthLayout({ children, className }: AuthLayoutProps) {
  const t = useTranslations("auth")
  const tCommon = useTranslations("common")

  const perks = [
    { icon: Sparkles, text: t("perkAi") },
    { icon: Map, text: t("perkItineraries") },
    { icon: ShieldCheck, text: t("perkSecure") },
  ]

  return (
    <div className="relative flex min-h-screen">
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/airplane-view.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 0vw, 45vw"
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 flex items-center justify-between p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white/55 px-3 py-1.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            <ArrowLeft className="size-4" />
            {tCommon("backToHome")}
          </Link>
          <LanguageSwitcher className="bg-white/55 hover:bg-white/70" />
        </div>

        <div className="relative z-10 space-y-8 p-10 pb-14">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/35 backdrop-blur-sm">
              <Plane className="size-4 text-white" />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">{tCommon("appName")}</p>
              <p className="text-sm font-medium text-white/85">{t("travelCompanion")}</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 font-medium text-white/95">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
                  <Icon className="size-3" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center bg-background px-4 py-10",
          className
        )}
      >
        <div className="absolute top-4 end-4 flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
        </div>
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
          {tCommon("backToHome")}
        </Link>
        {children}
      </div>
    </div>
  )
}

export { AuthLayout }

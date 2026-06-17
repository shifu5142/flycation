"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

type GuestConversionBannerProps = {
  variant?: "default" | "planner"
}

function GuestConversionBanner({ variant = "default" }: GuestConversionBannerProps) {
  const t = useTranslations("guest")
  const tNav = useTranslations("nav")
  const isPlanner = variant === "planner"

  return (
    <section className="border-t border-border/60 bg-muted/30 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          {isPlanner ? t("unlockPlanner") : t("signUpSave")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-lg">
            <Link href="/register">
              {t("createFreeAccount")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/login">{tNav("signIn")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export { GuestConversionBanner }

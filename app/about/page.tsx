"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowLeft, Plane, Sparkles, Users } from "lucide-react"

import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const valueKeys = [
  { icon: Sparkles, titleKey: "aiTitle" as const, descKey: "aiDesc" as const },
  {
    icon: Plane,
    titleKey: "travelersTitle" as const,
    descKey: "travelersDesc" as const,
  },
  {
    icon: Users,
    titleKey: "styleTitle" as const,
    descKey: "styleDesc" as const,
  },
]

function AboutPage() {
  const t = useTranslations("about")
  const tCommon = useTranslations("common")

  return (
    <GuestLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            {tCommon("backToHome")}
          </Link>
        </Button>

        <Badge variant="secondary" className="mb-4 rounded-full">
          {t("badge")}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {valueKeys.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.titleKey} className="rounded-2xl border-border/60">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{t(item.titleKey)}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {t(item.descKey)}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="secondary" asChild className="rounded-lg">
              <Link href="/start">{t("startPlanning")}</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-lg border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/register">{t("createAccount")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </GuestLayout>
  )
}

export default AboutPage

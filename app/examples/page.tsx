"use client"

import { useTranslations } from "next-intl"
import { ArrowLeft, BookOpen } from "lucide-react"

import { ExampleTripCard } from "@/components/ExampleTripCard"
import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { mockTrips } from "@/lib/mockTrips"

function ExamplesPage() {
  const t = useTranslations("examples")
  const tCommon = useTranslations("common")

  return (
    <GuestLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            {tCommon("backToHome")}
          </Link>
        </Button>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full">
              <BookOpen className="size-3" />
              {t("readOnly")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Button asChild className="rounded-lg">
            <Link href="/start">{t("startPlanning")}</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockTrips.map((trip) => (
            <ExampleTripCard key={trip.id} trip={trip} guest />
          ))}
        </div>
      </div>
    </GuestLayout>
  )
}

export default ExamplesPage

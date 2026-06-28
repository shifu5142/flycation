"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowUpDown,
  MapPin,
  Plane,
  SlidersHorizontal,
  Star,
  Tag,
} from "lucide-react"

import { AppImage } from "@/components/AppImage"
import { useToast } from "@/components/ToastProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  dealCountries,
  filterAndSortDeals,
  flightHotelDeals,
  type FlightHotelDeal,
  type PriceRangeFilter,
  type RatingFilter,
  type SortOption,
} from "@/lib/mockFlightHotelDeals"
import { cn } from "@/lib/utils"

const DealsMap = dynamic(
  () => import("@/components/DealsMap").then((m) => m.DealsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,520px)] items-center justify-center rounded-2xl border border-border/60 bg-muted/30 lg:h-[calc(100vh-10rem)] lg:min-h-[480px]">
        <p className="text-sm text-muted-foreground">Loading map…</p>
      </div>
    ),
  }
)

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400">
      <Star className="size-3.5 fill-current" />
      {rating.toFixed(1)}
    </span>
  )
}

function DealCard({
  deal,
  active,
  formatPrice,
  flightIncludedLabel,
  viewDealLabel,
  onSelect,
  onHover,
  onLeave,
}: {
  deal: FlightHotelDeal
  active: boolean
  formatPrice: (price: number) => string
  flightIncludedLabel: string
  viewDealLabel: string
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <Card
      id={`deal-card-${deal.id}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
        active &&
          "border-primary/40 shadow-lg shadow-primary/15 ring-2 ring-primary/25"
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-44 shrink-0 sm:h-auto sm:w-52">
          <AppImage
            src={deal.image}
            alt={deal.hotelName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            wrapperClassName="relative h-full min-h-[11rem] w-full sm:min-h-[10.5rem]"
          />
          <Badge className="absolute top-3 left-3 rounded-full border-0 bg-primary/90 text-primary-foreground shadow-md">
            <Plane className="size-3" />
            {flightIncludedLabel}
          </Badge>
        </div>
        <CardContent className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-lg font-semibold leading-tight tracking-tight">
                {deal.hotelName}
              </h3>
              <RatingStars rating={deal.rating} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              {deal.city}, {deal.country}
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Bundle from</p>
              <p className="text-2xl font-bold tracking-tight text-primary">
                {formatPrice(deal.price)}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="rounded-xl shadow-sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              {viewDealLabel}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function FlightHotelDealsSection() {
  const t = useTranslations("deals")
  const { toast } = useToast()

  const [country, setCountry] = useState("all")
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>("all")
  const [rating, setRating] = useState<RatingFilter>("all")
  const [sort, setSort] = useState<SortOption>("price-asc")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price),
    []
  )

  const filteredDeals = useMemo(
    () =>
      filterAndSortDeals(flightHotelDeals, {
        country,
        priceRange,
        rating,
        sort,
      }),
    [country, priceRange, rating, sort]
  )

  const handleSelectDeal = useCallback(
    (id: string) => {
      setSelectedId(id)
      document
        .getElementById(`deal-card-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    },
    []
  )

  const handleViewDeal = useCallback(
    (id: string) => {
      handleSelectDeal(id)
      toast(t("viewDealToast"), "info")
    },
    [handleSelectDeal, t, toast]
  )

  return (
    <section id="deals" className="scroll-mt-24 space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-full">
          <Tag className="size-3" />
          {t("badge")}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          {t("filters")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label>{t("country")}</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="rounded-xl bg-background">
                <SelectValue placeholder={t("allCountries")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" textValue={t("allCountries")}>
                  <SelectItemText>{t("allCountries")}</SelectItemText>
                </SelectItem>
                {dealCountries.map((c) => (
                  <SelectItem key={c} value={c} textValue={c}>
                    <SelectItemText>{c}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("priceRange")}</Label>
            <Select
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as PriceRangeFilter)}
            >
              <SelectTrigger className="rounded-xl bg-background">
                <SelectValue placeholder={t("priceRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" textValue={t("priceAll")}>
                  <SelectItemText>{t("priceAll")}</SelectItemText>
                </SelectItem>
                <SelectItem value="under1000" textValue={t("priceUnder1000")}>
                  <SelectItemText>{t("priceUnder1000")}</SelectItemText>
                </SelectItem>
                <SelectItem value="1000-1500" textValue={t("price1000to1500")}>
                  <SelectItemText>{t("price1000to1500")}</SelectItemText>
                </SelectItem>
                <SelectItem value="over1500" textValue={t("priceOver1500")}>
                  <SelectItemText>{t("priceOver1500")}</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("rating")}</Label>
            <Select
              value={rating}
              onValueChange={(v) => setRating(v as RatingFilter)}
            >
              <SelectTrigger className="rounded-xl bg-background">
                <SelectValue placeholder={t("rating")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" textValue={t("ratingAll")}>
                  <SelectItemText>{t("ratingAll")}</SelectItemText>
                </SelectItem>
                <SelectItem value="4" textValue={t("rating4plus")}>
                  <SelectItemText>{t("rating4plus")}</SelectItemText>
                </SelectItem>
                <SelectItem value="4.5" textValue={t("rating45plus")}>
                  <SelectItemText>{t("rating45plus")}</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ArrowUpDown className="size-3.5" />
              {t("sort")}
            </Label>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="rounded-xl bg-background">
                <SelectValue placeholder={t("sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc" textValue={t("sortPriceLow")}>
                  <SelectItemText>{t("sortPriceLow")}</SelectItemText>
                </SelectItem>
                <SelectItem value="price-desc" textValue={t("sortPriceHigh")}>
                  <SelectItemText>{t("sortPriceHigh")}</SelectItemText>
                </SelectItem>
                <SelectItem value="rating-desc" textValue={t("sortRating")}>
                  <SelectItemText>{t("sortRating")}</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <div className="max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pr-1">
          {filteredDeals.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-border/60 bg-muted/20 p-10 text-center">
              <p className="text-sm font-medium">{t("emptyTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("emptyDescription")}
              </p>
            </Card>
          ) : (
            filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                active={
                  deal.id === selectedId ||
                  deal.id === hoveredId
                }
                formatPrice={formatPrice}
                flightIncludedLabel={t("flightIncluded")}
                viewDealLabel={t("viewDeal")}
                onSelect={() => handleViewDeal(deal.id)}
                onHover={() => setHoveredId(deal.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <DealsMap
            deals={filteredDeals}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelectDeal}
            formatPrice={formatPrice}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("mapHint")}
          </p>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useMemo, useState, useEffect, type ReactNode } from "react"
import {
  Building2,
  Car,
  Coins,
  Compass,
  ExternalLink,
  Filter,
  Globe,
  Hash,
  Landmark,
  Languages,
  Link2,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { AppImage } from "@/components/AppImage"
import { CountryImage } from "@/components/CountryImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  explorePriceRanges,
  exploreRegions,
  exploreSeasons,
  type ExploreDestination,
} from "@/lib/mockExplorePage"
import { getStaticCountryImagePath } from "@/lib/countryStaticImages"
import { getExploreResults } from "@/lib/exploreFilterResults"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ToastProvider"
import { supabase } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"

type ApiMeta = {
  count?: number
  duration?: number
  limit?: number
  more?: boolean
  offset?: number
  request_id?: string
  total?: number
}

type ApiCountry = {
  uuid?: string
  names?: {
    common?: string
    official?: string
    alternates?: string[]
    native?: Record<string, { common?: string; official?: string }>
    translations?: Record<string, { common?: string; official?: string }>
  }
  name?: { common?: string }
  flag?: {
    emoji?: string
    description?: string
    unicode?: string
    url_png?: string
    colors?: Record<string, string>
  }
  flags?: { png?: string }
  region?: string
  subregion?: string
  continents?: string[]
  coordinates?: { lat?: number; lng?: number }
  area?: { kilometers?: number; miles?: number }
  landlocked?: boolean
  borders?: string[]
  capital?: string[]
  capitals?: { name?: string; coordinates?: { lat?: number; lng?: number } }[]
  languages?: Record<string, string> | { name?: string; code?: string }[]
  demonyms?: Record<string, { m?: string; f?: string }>
  currencies?:
    | Record<string, { name?: string; symbol?: string }>
    | { code?: string; symbol?: string; name?: string }[]
  population?: number
  government_type?: string
  leaders?: { name?: string; role?: string }[]
  classification?: Record<string, boolean | string>
  memberships?: Record<string, boolean>
  codes?: {
    alpha_2?: string
    alpha_3?: string
    ccn3?: string
    cioc?: string
    fifa?: string
  }
  calling_codes?: string[]
  tlds?: string[]
  postal_code?: { format?: string; regex?: string }
  timezones?: string[]
  links?: {
    google_maps?: string
    wikipedia?: string
    official?: string
    open_street_maps?: string
  }
  maps?: { googleMaps?: string }
  cars?: { driving_side?: string; signs?: string[] }
  date?: {
    start_of_week?: string
    fiscal_year_start?: Record<string, number>
    academic_year_start?: Record<string, number>
  }
  economy?: { gini_coefficient?: { year?: number; value?: number } }
  number_format?: { decimal_separator?: string; thousands_separator?: string }
  parent?: { alpha_2?: string; alpha_3?: string }
  assets?: unknown[]
  _match?: unknown[]
  _meta?: { lastUpdatedTimestamp?: number }
}

function countryName(country: ApiCountry, unknownLabel = "Unknown") {
  return country.names?.common ?? country.name?.common ?? unknownLabel
}

function formatNumber(value?: number) {
  if (value == null) return "—"
  return value.toLocaleString("en-US")
}

function InfoChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
      {children}
    </span>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe
  label: string
  value?: ReactNode
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute -right-3 -top-3 size-16 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
      <div className="relative flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 text-sm leading-snug font-semibold">{value ?? "—"}</p>
        </div>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value?: ReactNode }) {
  if (value == null || value === "" || value === "—") return null
  return (
    <div className="grid gap-1 border-b border-border/35 px-3 py-2.5 last:border-0 sm:grid-cols-[minmax(7rem,34%)_1fr] sm:items-start sm:gap-4 even:bg-muted/25">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function DataList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <dl className={cn("overflow-hidden rounded-xl border border-border/50 bg-muted/15", className)}>
      {children}
    </dl>
  )
}

function DataCategoryCard({
  title,
  description,
  icon: Icon,
  accent = "primary",
  className,
  children,
}: {
  title: string
  description?: string
  icon: typeof Globe
  accent?: "primary" | "sky" | "emerald" | "amber" | "violet"
  className?: string
  children: ReactNode
}) {
  const accentStyles = {
    primary: "from-primary/80 to-primary/30 border-primary/20",
    sky: "from-sky-500/80 to-sky-500/30 border-sky-500/20",
    emerald: "from-emerald-500/80 to-emerald-500/30 border-emerald-500/20",
    amber: "from-amber-500/80 to-amber-500/30 border-amber-500/20",
    violet: "from-violet-500/80 to-violet-500/30 border-violet-500/20",
  }

  return (
    <Card
      className={cn(
        "h-full overflow-hidden rounded-2xl border-border/60 shadow-sm",
        className
      )}
    >
      <div className={cn("h-1 bg-gradient-to-r", accentStyles[accent])} />
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-primary ring-1 ring-border/60">
            <Icon className="size-4" />
          </span>
          <span>{title}</span>
        </CardTitle>
        {description && (
          <CardDescription className="pl-[2.875rem]">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h4 className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {children}
      </h4>
      <div className="h-px flex-1 bg-border/70" />
    </div>
  )
}

function LinkCard({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: typeof ExternalLink
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border/50 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ExternalLink className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  )
}

function CountryProfileExplorer({
  country,
  imageUrl,
  imageLoading = false,
  onImageReady,
}: {
  country: ApiCountry
  imageUrl?: string
  imageLoading?: boolean
  onImageReady?: () => void
}) {
  const t = useTranslations("explore")
  const name = countryName(country, t("unknown"))
  const languages = Array.isArray(country.languages)
    ? country.languages.map((l) => l.name ?? l.code).filter(Boolean)
    : Object.entries(country.languages ?? {}).map(([code, label]) =>
        typeof label === "string" ? label : code
      )
  const currencies = Array.isArray(country.currencies)
    ? country.currencies
    : Object.entries(country.currencies ?? {}).map(([code, c]) => ({
        code,
        ...c,
      }))
  const activeMemberships = Object.entries(country.memberships ?? {})
    .filter(([, active]) => active)
    .map(([key]) => key.replace(/_/g, " "))
  const classification = country.classification ?? {}
  const links = country.links ?? {}
  const mapUrl = links.google_maps ?? country.maps?.googleMaps

  return (
    <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="relative min-h-[220px] sm:min-h-[260px]">
        {imageUrl?.trim() ? (
          <AppImage
            key={imageUrl}
            src={imageUrl.trim()}
            alt={name}
            fill
            className="object-cover"
            wrapperClassName="absolute inset-0 z-0"
            onLoad={onImageReady}
            onError={onImageReady}
          />
        ) : !imageLoading ? (
          <CountryImage
            country={name}
            alt={name}
            fill
            wrapperClassName="absolute inset-0 z-0"
            className="object-cover"
          />
        ) : null}
        {imageLoading && (
          <Skeleton className="absolute inset-0 z-[1] size-full rounded-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[220px] flex-col justify-between gap-6 p-6 sm:min-h-[260px] sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-white/15 bg-white/10 text-white backdrop-blur-md">
              {country.region}
            </Badge>
            {country.subregion && (
              <Badge className="border-white/15 bg-white/10 text-white backdrop-blur-md">
                {country.subregion}
              </Badge>
            )}
            {country.landlocked && (
              <Badge className="border-amber-300/30 bg-amber-400/15 text-amber-100 backdrop-blur-md">
                {t("landlocked")}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="text-5xl leading-none drop-shadow-lg sm:text-6xl">
                {country.flag?.emoji ?? "🌍"}
              </span>
              <div className="text-white">
                <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                  {country.codes?.alpha_2} · {country.codes?.alpha_3}
                </p>
                <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{name}</h3>
                <p className="mt-1 max-w-xl text-sm text-white/85 sm:text-base">
                  {country.names?.official}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mapUrl && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/95 text-foreground hover:bg-white"
                  asChild
                >
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="size-3.5" />
                    {t("viewMap")}
                  </a>
                </Button>
              )}
              {links.wikipedia && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <a href={links.wikipedia} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    {t("wikipedia")}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-border/60 bg-muted/10 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Users} label={t("population")} value={formatNumber(country.population)} />
        <StatTile
          icon={Building2}
          label={t("capital")}
          value={country.capitals?.[0]?.name ?? country.capital?.[0]}
        />
        <StatTile
          icon={MapPin}
          label={t("area")}
          value={
            country.area?.kilometers
              ? t("areaKm", { value: formatNumber(country.area.kilometers) })
              : undefined
          }
        />
        <StatTile icon={Landmark} label={t("government")} value={country.government_type} />
      </div>

      <div className="space-y-8 p-5 sm:p-6">
        <SectionHeading>{t("identityRegion")}</SectionHeading>
        <div className="grid gap-4 lg:grid-cols-2">
          <DataCategoryCard title={t("overview")} icon={Globe} description={t("overviewDescription")} accent="primary">
            <DataList>
              <DataRow label={t("commonName")} value={country.names?.common ?? name} />
              <DataRow label={t("officialName")} value={country.names?.official} />
              <DataRow label={t("region")} value={country.region} />
              <DataRow label={t("subregion")} value={country.subregion} />
              <DataRow label={t("continents")} value={country.continents?.join(", ")} />
              <DataRow label={t("government")} value={country.government_type} />
            </DataList>
            {country.names?.alternates && country.names.alternates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {country.names.alternates.map((alt) => (
                  <InfoChip key={alt}>{alt}</InfoChip>
                ))}
              </div>
            )}
          </DataCategoryCard>

          <DataCategoryCard title={t("geography")} icon={MapPin} description={t("geographyDescription")} accent="sky">
            <DataList>
              <DataRow
                label={t("coordinates")}
                value={
                  country.coordinates
                    ? `${country.coordinates.lat}°, ${country.coordinates.lng}°`
                    : undefined
                }
              />
              <DataRow
                label={t("area")}
                value={
                  country.area
                    ? t("areaKmMi", {
                        km: formatNumber(country.area.kilometers),
                        mi: formatNumber(country.area.miles),
                      })
                    : undefined
                }
              />
              <DataRow label={t("landlocked")} value={country.landlocked ? t("yes") : t("no")} />
            </DataList>
            {country.capitals && country.capitals.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{t("capitals")}</p>
                {country.capitals.map((cap, i) => (
                  <div
                    key={cap.name ?? i}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{cap.name}</span>
                    {cap.coordinates && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {cap.coordinates.lat}°, {cap.coordinates.lng}°
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {country.borders && country.borders.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t("borders")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {country.borders.map((code) => (
                    <InfoChip key={code}>{code}</InfoChip>
                  ))}
                </div>
              </div>
            )}
            {country.timezones && country.timezones.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t("timezones")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {country.timezones.map((tz) => (
                    <InfoChip key={tz}>{tz}</InfoChip>
                  ))}
                </div>
              </div>
            )}
          </DataCategoryCard>
        </div>

        <SectionHeading>{t("peopleCulture")}</SectionHeading>
        <div className="grid gap-4 lg:grid-cols-2">
          <DataCategoryCard title={t("languagesAndPeople")} icon={Languages} accent="emerald">
            {languages.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <InfoChip key={lang}>{lang}</InfoChip>
                ))}
              </div>
            )}
            <DataList>
              {country.demonyms &&
                Object.entries(country.demonyms).map(([lang, d]) => (
                  <DataRow
                    key={lang}
                    label={t("demonym", { lang })}
                    value={[d.m, d.f].filter(Boolean).join(" / ")}
                  />
                ))}
              {country.names?.native &&
                Object.entries(country.names.native).map(([lang, n]) => (
                  <DataRow
                    key={lang}
                    label={t("nativeName", { lang })}
                    value={n.common ?? n.official}
                  />
                ))}
            </DataList>
            {country.names?.translations && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(country.names.translations)
                  .slice(0, 8)
                  .map(([lang, translation]) => (
                    <div
                      key={lang}
                      className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                    >
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{lang}</p>
                      <p className="text-sm font-medium">{translation.common ?? translation.official}</p>
                    </div>
                  ))}
              </div>
            )}
          </DataCategoryCard>

          <DataCategoryCard title={t("economyAndCurrency")} icon={Coins} accent="amber">
            <div className="mb-3 grid gap-2">
              {currencies.map((c, i) => (
                <div
                  key={c.code ?? i}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                >
                  <div>
                    <p className="font-mono text-xs font-bold text-primary">{c.code ?? "—"}</p>
                    <p className="text-sm font-medium">{c.name}</p>
                  </div>
                  {c.symbol && (
                    <span className="text-lg font-semibold text-muted-foreground">{c.symbol}</span>
                  )}
                </div>
              ))}
            </div>
            <DataList>
              <DataRow
                label={t("giniCoefficient")}
                value={
                  country.economy?.gini_coefficient
                    ? `${country.economy.gini_coefficient.value} (${country.economy.gini_coefficient.year})`
                    : undefined
                }
              />
              <DataRow
                label={t("numberFormat")}
                value={
                  country.number_format
                    ? t("numberFormatValue", {
                        decimal: country.number_format.decimal_separator ?? "",
                        thousands: country.number_format.thousands_separator ?? "",
                      })
                    : undefined
                }
              />
            </DataList>
          </DataCategoryCard>
        </div>

        <SectionHeading>{t("systemsAndReference")}</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DataCategoryCard title={t("countryCodes")} icon={Hash} accent="violet">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t("alpha2"), value: country.codes?.alpha_2 },
                { label: t("alpha3"), value: country.codes?.alpha_3 },
                { label: t("numeric"), value: country.codes?.ccn3 },
                { label: t("ioc"), value: country.codes?.cioc },
                { label: t("fifa"), value: country.codes?.fifa },
              ].map((code) => (
                <div
                  key={code.label}
                  className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-center"
                >
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">{code.label}</p>
                  <p className="mt-0.5 font-mono text-sm font-bold">{code.value ?? "—"}</p>
                </div>
              ))}
            </div>
            <DataList className="mt-3">
              <DataRow
                label={t("callingCodes")}
                value={country.calling_codes?.map((c) => `+${c}`).join(", ")}
              />
              <DataRow label={t("tlds")} value={country.tlds?.join(", ")} />
              <DataRow label={t("postalFormat")} value={country.postal_code?.format} />
            </DataList>
          </DataCategoryCard>

          <DataCategoryCard title={t("transportAndCalendar")} icon={Car} accent="sky">
            <DataList>
              <DataRow label={t("drivingSide")} value={country.cars?.driving_side} />
              <DataRow label={t("roadSigns")} value={country.cars?.signs?.join(", ")} />
              <DataRow label={t("weekStarts")} value={country.date?.start_of_week} />
              {country.date?.fiscal_year_start && (
                <DataRow
                  label={t("fiscalYear")}
                  value={Object.entries(country.date.fiscal_year_start)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                />
              )}
              {country.date?.academic_year_start && (
                <DataRow
                  label={t("academicYear")}
                  value={Object.entries(country.date.academic_year_start)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                />
              )}
            </DataList>
          </DataCategoryCard>

          <DataCategoryCard title={t("classification")} icon={Landmark} accent="primary" className="md:col-span-2 xl:col-span-1">
            <div className="flex flex-wrap gap-2">
              {Object.entries(classification).map(([key, val]) => {
                const isBool = typeof val === "boolean"
                const active = isBool ? val : val !== "" && val !== "none"
                return (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                      active
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        active ? "bg-emerald-500" : "bg-muted-foreground/50"
                      )}
                    />
                    {key.replace(/_/g, " ")}
                    {!isBool && `: ${val}`}
                  </span>
                )
              })}
            </div>
          </DataCategoryCard>
        </div>

        {(country.flag?.description || country.flag?.colors) && (
          <>
            <SectionHeading>{t("nationalSymbol")}</SectionHeading>
            <Card className="overflow-hidden rounded-2xl border-border/60">
              <div className="flex flex-col sm:flex-row">
                {country.flag?.colors && (
                  <div className="flex min-h-24 sm:min-h-0 sm:w-28 sm:flex-col">
                    {Object.values(country.flag.colors).map((color, i) => (
                      <div key={i} className="h-8 flex-1 sm:h-auto" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col justify-center gap-2 p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{country.flag?.emoji}</span>
                    <div>
                      <p className="font-semibold">{t("flagOf", { name })}</p>
                      <p className="font-mono text-xs text-muted-foreground">{country.flag?.unicode}</p>
                    </div>
                  </div>
                  {country.flag?.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {country.flag.description}
                    </p>
                  )}
                </CardContent>
              </div>
            </Card>
          </>
        )}

        <SectionHeading>{t("leadershipAndMemberships")}</SectionHeading>
        <div className="grid gap-4 lg:grid-cols-2">
          <DataCategoryCard title={t("leaders")} icon={Users} accent="primary">
            {country.leaders?.length ? (
              <div className="space-y-2">
                {country.leaders.map((leader, i) => (
                  <div
                    key={leader.name ?? i}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {(leader.name ?? "?").charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{leader.name}</p>
                      <p className="text-xs text-muted-foreground">{leader.role ?? t("leaderRole")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 py-6 text-center text-sm text-muted-foreground">
                {t("noLeaderData")}
              </p>
            )}
          </DataCategoryCard>

          <DataCategoryCard title={t("memberships")} icon={Building2} description={t("membershipsDescription")} accent="emerald">
            {activeMemberships.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeMemberships.map((m) => (
                  <Badge
                    key={m}
                    variant="secondary"
                    className="rounded-full px-3 py-1 capitalize"
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 py-6 text-center text-sm text-muted-foreground">
                {t("noMemberships")}
              </p>
            )}
          </DataCategoryCard>
        </div>

        {(links.wikipedia || links.official || mapUrl || links.open_street_maps) && (
          <>
            <SectionHeading>{t("exploreFurther")}</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {links.wikipedia && (
                <LinkCard href={links.wikipedia} label={t("wikipedia")} icon={Globe} />
              )}
              {links.official && (
                <LinkCard href={links.official} label={t("officialWebsite")} icon={Link2} />
              )}
              {mapUrl && <LinkCard href={mapUrl} label={t("googleMaps")} icon={MapPin} />}
              {links.open_street_maps && (
                <LinkCard href={links.open_street_maps} label={t("openStreetMap")} icon={MapPin} />
              )}
            </div>
          </>
        )}

        {country.uuid && (
          <p className="border-t border-border/50 pt-4 text-center font-mono text-[10px] text-muted-foreground/70">
            {country.uuid}
          </p>
        )}
      </div>
    </article>
  )
}

function DestinationCard({
  destination,
  large,
}: {
  destination: ExploreDestination
  large?: boolean
}) {
  const tCommon = useTranslations("common")
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        large && "sm:col-span-2"
      )}
    >
      <div className={cn("relative overflow-hidden", large ? "h-56" : "h-44")}>
        <CountryImage
          country={destination.country}
          src={getStaticCountryImagePath(destination.country)}
          alt={destination.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="text-white">
            <p className="text-lg font-bold">{destination.name}</p>
            <p className="text-sm text-white/85">{destination.country}</p>
          </div>
          <Badge className="border-white/20 bg-black/40 text-white backdrop-blur-sm">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {destination.rating}
          </Badge>
        </div>
      </div>
      <CardHeader className="gap-1 pb-2">
        <CardDescription className="line-clamp-2 text-sm">
          {destination.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">{tCommon("from")}</p>
          <p className="text-lg font-bold text-primary">
            ${destination.priceFrom}
          </p>
        </div>
        <Button size="sm" className="rounded-xl">
          {tCommon("viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ExplorePage() {
  const t = useTranslations("explore")
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("All")
  const [season, setSeason] = useState("All")
  const [price, setPrice] = useState("Any")
  const [showFilters, setShowFilters] = useState(false)
  const [isExploring, setIsExploring] = useState(false)
  const [apiCountries, setApiCountries] = useState<ApiCountry[]>([])
  const [apiMeta, setApiMeta] = useState<ApiMeta | null>(null)
  const [imgUrl, setimgUrl] = useState<string>("")
  const [heroImageLoading, setHeroImageLoading] = useState(false)
  const filterResults = useMemo(
    () => getExploreResults(region, season, price),
    [region, season, price]
  )

  const filtered = useMemo(() => {
    return filterResults.all.filter((d) => {
      const matchesQuery =
        !query.trim() ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
      return matchesQuery
    })
  }, [filterResults.all, query])

  const { featured, trending, recommended } = filterResults

  const filteredApiCountries = useMemo(() => {
    return apiCountries.filter((country) => {
      const name = country.name?.common ?? country.names?.common ?? ""
      const matchesRegion = region === "All" || country.region === region
      const matchesQuery =
        !query.trim() ||
        name.toLowerCase().includes(query.toLowerCase()) ||
        (country.region ?? "").toLowerCase().includes(query.toLowerCase())
      return matchesRegion && matchesQuery
    })
  }, [apiCountries, region, query])

  const hasApiData = filteredApiCountries.length > 0

  useEffect(() => {
    setApiCountries([])
    setApiMeta(null)
    setimgUrl("")
    setHeroImageLoading(false)
  }, [region, season, price])

  const handleExploreNow = async () => {
    if (isExploring) return
    if (!query.trim() || !region.trim() || !season.trim() || !price.trim()) {
      toast(t("fillAllFields"), "info")
      return
    }
    const requestBody = {
      query,
      region,
      season,
      price,
    }
    setIsExploring(true)
    setHeroImageLoading(true)
    setimgUrl("")
    try {
      const res = await fetch("/api/Explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json()
      const countries =
        data.data?.objects ?? data.objects ?? (Array.isArray(data) ? data : [])
      setApiCountries(countries)
      setApiMeta(data.data?.meta ?? data.meta ?? null)

      const searchTerm = query.trim()
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("imageUrl")
        .ilike("to", `%${searchTerm}%`)
        .not("imageUrl", "is", null)
        .limit(1)
        .maybeSingle()

      let nextImageUrl = tripData?.imageUrl?.trim() ?? ""

      if (tripError || !nextImageUrl) {
        const imageRes = await fetch(
          `/api/country-image?country=${encodeURIComponent(searchTerm.toLowerCase())}`,
          { method: "GET" }
        )
        if (imageRes.ok) {
          const imageData = (await imageRes.json()) as { url?: string }
          nextImageUrl = imageData.url?.trim() ?? ""
        }
      }

      if (nextImageUrl) {
        setimgUrl(nextImageUrl)
      } else {
        setHeroImageLoading(false)
      }
      toast(t("exploreSuccess"), "success")
    } catch (error) {
      console.error(error)
      setHeroImageLoading(false)
    } finally {
      setIsExploring(false)
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-sky-500/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-xl space-y-4">
            <Badge variant="secondary" className="rounded-full">
              <Compass className="size-3" />
              {t("badge")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-11 rounded-xl border-border/80 bg-background/90 pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-xl lg:hidden"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>
          <MapPin className="pointer-events-none absolute -right-4 -bottom-4 size-40 text-primary/10" />
        </section>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Card
            className={cn(
              "h-fit rounded-2xl border-border/60 lg:block",
              showFilters ? "block" : "hidden"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="size-4 text-primary" />
                {t("filters")}
              </CardTitle>
              <CardDescription>
                {region} · {season} · {price}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("region")}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {exploreRegions.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={region === r ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setRegion(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("season")}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {exploreSeasons.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={season === s ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setSeason(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("price")}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {explorePriceRanges.map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={price === p ? "default" : "outline"}
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setPrice(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("rating")}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["4.5+", "4.0+", "Any"].map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-xs"
                    >
                      <Star className="size-3" />
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-10">
            {hasApiData && (
              <section className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-card to-sky-500/8 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                        {t("resultsTitle")}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight">
                        {t("countriesFound", {
                          count: apiMeta?.total ?? filteredApiCountries.length,
                        })}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                      {apiMeta?.duration != null && (
                        <Badge variant="secondary" className="rounded-full">
                          {apiMeta.duration}ms
                        </Badge>
                      )}
                      {apiMeta?.request_id && (
                        <Badge variant="outline" className="rounded-full font-mono text-[10px]">
                          {apiMeta.request_id.slice(0, 8)}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={handleExploreNow}
                      disabled={isExploring}
                      variant="default"
                      className={cn(
                        "w-full rounded-xl sm:ml-auto sm:w-auto",
                        isExploring && "animate-pulse cursor-wait opacity-90"
                      )}
                    >
                      {isExploring ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {t("exploring")}
                        </>
                      ) : (
                        t("exploreAgain")
                      )}
                    </Button>
                  </div>

                  {apiMeta && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {[
                        { label: t("metaTotal"), value: apiMeta.total },
                        { label: t("metaReturned"), value: apiMeta.count },
                        { label: t("metaLimit"), value: apiMeta.limit },
                        { label: t("metaOffset"), value: apiMeta.offset },
                        {
                          label: t("metaMore"),
                          value: apiMeta.more ? t("metaYes") : t("metaNo"),
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-border/50 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm"
                        >
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                            {item.label}
                          </p>
                          <p className="mt-1 text-lg font-bold tabular-nums">{item.value ?? "—"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-10">
                  {filteredApiCountries.map((country, i) => (
                    <CountryProfileExplorer
                      key={country.uuid ?? country.codes?.alpha_2 ?? countryName(country) ?? i}
                      country={country}
                      imageUrl={imgUrl}
                      imageLoading={heroImageLoading}
                      onImageReady={() => setHeroImageLoading(false)}
                    />
                  ))}
                </div>
              </section>
            )}

            {!hasApiData && (
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{t("featured")}</h2>
                <Badge variant="secondary">{t("curated")}</Badge>
                <Badge variant="outline" className="text-xs">
                  {region} · {season} · {price}
                </Badge>
                <Button
                  onClick={handleExploreNow}
                  disabled={isExploring}
                  variant="default"
                  className={cn(
                    "ml-auto bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700",
                    isExploring && "animate-pulse cursor-wait opacity-90"
                  )}
                >
                  {isExploring ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("exploring")}
                    </>
                  ) : (
                    t("exploreNow")
                  )}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.length === 0 ? (
                      <Card className="border-dashed py-8 text-center sm:col-span-2">
                        <CardContent>
                          <p className="font-medium">{t("noFeatured")}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t("noFeaturedHint")}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      featured.map((d, i) => (
                        <DestinationCard key={d.id} destination={d} large={i === 0} />
                      ))
                    )}
              </div>
            </section>
            )}

            {!hasApiData && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">{t("trending")}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trending.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>
            )}

            {!hasApiData && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">{t("recommended")}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>
            )}

            {!hasApiData && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {t("allDestinations")}
                {!hasApiData && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filtered.length})
                </span>
                )}
              </h2>
              {hasApiData ? null : filtered.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent>
                    <p className="font-medium">{t("noMatches")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("noMatchesHint")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              )}
            </section>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default ExplorePage

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUp,
  Check,
  Copy,
  Crown,
  Gift,
  Loader2,
  Sparkles,
  Trophy,
} from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { useToast } from "@/components/ToastProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase/client"
import { buildLoyaltyProfile } from "@/lib/loyaltyFromTrips"
import {
  earnPointsActions,
  formatPoints,
  getTierById,
  loyaltyTiers,
  marketplaceRewards,
  referralProgram,
  type LoyaltyActivity,
  type LoyaltyMember,
  type LoyaltyStat,
  type LoyaltyTierId,
  type AchievementBadge,
} from "@/lib/mockLoyalty"
import type { Trip } from "@/lib/tripBooking"
import { cn } from "@/lib/utils"

function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function HeroRewardsCard({ member }: { member: LoyaltyMember }) {
  const currentTier = getTierById(member.currentTier)
  const nextTier = getTierById(member.nextTier)
  const TierIcon = currentTier.icon
  const atMaxTier = member.currentTier === member.nextTier

  return (
    <Card className="relative overflow-hidden rounded-3xl border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-card to-violet-500/10 shadow-lg shadow-amber-500/10">
      <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-violet-500/15 blur-3xl" />

      <CardContent className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-5">
          <Badge className="rounded-full border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-200">
            <Sparkles className="size-3" />
            Loyalty & Rewards
          </Badge>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30">
              <TierIcon className="size-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current tier
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {currentTier.name} Member
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Your points
              </p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-primary">
                {member.currentPoints.toLocaleString()}
              </p>
            </div>
            <div className="hidden h-14 w-px bg-border/80 sm:block" />
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {atMaxTier ? "Top tier" : "Next tier"}
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                <Crown className="size-5 text-violet-500" />
                {atMaxTier ? currentTier.name : nextTier.name}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {atMaxTier
                  ? "Maximum tier reached"
                  : `Progress to ${nextTier.name}`}
              </span>
              <span className="font-semibold tabular-nums">
                {member.tierProgressPercent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted/80 ring-1 ring-border/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-violet-500 transition-all duration-1000 ease-out"
                style={{ width: `${member.tierProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {member.currentPoints.toLocaleString()} /{" "}
              {member.pointsToNextTier.toLocaleString()} points
              {!atMaxTier && " · 500 pts per trip booked"}
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative flex size-36 items-center justify-center rounded-full border border-amber-500/25 bg-background/40 backdrop-blur-md sm:size-44">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400/20 to-violet-500/20" />
            <Trophy className="relative size-16 text-amber-500 drop-shadow-sm sm:size-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatsOverview({ stats }: { stats: LoyaltyStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.id}
            className="group rounded-2xl border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                  stat.accent
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function tierIndex(id: LoyaltyTierId) {
  return loyaltyTiers.findIndex((t) => t.id === id)
}

function TierSystem({ currentTierId }: { currentTierId: LoyaltyTierId }) {
  const currentIdx = tierIndex(currentTierId)

  return (
    <section className="space-y-6">
      <SectionHeading
        title="Membership tiers"
        description="Earn 500 points for every trip you book. Unlock perks as you level up."
      />

      <div className="relative">
        <div className="absolute top-8 right-4 left-4 hidden h-0.5 bg-border md:block lg:top-10" />
        <div
          className="absolute top-8 left-4 hidden h-0.5 bg-gradient-to-r from-amber-500 to-violet-500 transition-all md:block lg:top-10"
          style={{
            width: `calc(${(currentIdx / (loyaltyTiers.length - 1)) * 100}% - 2rem)`,
            maxWidth: "calc(100% - 2rem)",
          }}
        />

        <div className="grid gap-4 md:grid-cols-4">
          {loyaltyTiers.map((tier, index) => {
            const Icon = tier.icon
            const isCurrent = tier.id === currentTierId
            const isPast = index <= currentIdx

            return (
              <Card
                key={tier.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-border/60 transition-all duration-300",
                  isCurrent &&
                    "scale-[1.02] border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/20",
                  !isCurrent && "hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                {isCurrent && (
                  <Badge className="absolute top-3 right-3 rounded-full bg-primary text-primary-foreground">
                    Current
                  </Badge>
                )}
                <div
                  className={cn(
                    "h-1.5 bg-gradient-to-r",
                    tier.gradient,
                    !isPast && "opacity-30"
                  )}
                />
                <CardHeader className="gap-3 pb-2">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                      tier.gradient,
                      !isPast && "opacity-50 grayscale"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>
                      {tier.pointsRequired === 0
                        ? "Entry level"
                        : `${tier.pointsRequired.toLocaleString()}+ pts`}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {tier.perks.map((perk) => (
                    <p
                      key={perk}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="size-3 shrink-0 text-primary" />
                      {perk}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RewardsMarketplace({
  onRedeem,
  currentPoints,
}: {
  onRedeem: (title: string) => void
  currentPoints: number
}) {
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Rewards marketplace"
        description="Redeem your points for travel perks and exclusive benefits."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {marketplaceRewards.map((reward) => {
          const Icon = reward.icon
          const canAfford = currentPoints >= reward.pointsCost

          return (
            <Card
              key={reward.id}
              className="group flex flex-col overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="gap-3 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      reward.accent
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  {reward.tag && (
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      {reward.tag}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base leading-snug">
                  {reward.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {reward.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 pt-0">
                <p className="text-lg font-bold text-primary tabular-nums">
                  {reward.pointsCost.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    pts
                  </span>
                </p>
                <Button
                  className="w-full rounded-xl shadow-md shadow-primary/15 transition-all hover:shadow-lg"
                  disabled={!canAfford}
                  onClick={() => onRedeem(reward.title)}
                >
                  {canAfford ? "Redeem" : "Not enough points"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function EarnPointsSection() {
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Earn more points"
        description="Every action brings you closer to your next reward."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {earnPointsActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className="group rounded-2xl border-border/60 bg-gradient-to-br from-card to-muted/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  +{action.points.toLocaleString()} pts
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function ReferralProgramCard() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralProgram.link)
      setCopied(true)
      toast("Referral link copied!", "success")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast("Could not copy link", "info")
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-card to-pink-500/10 shadow-lg">
      <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <Gift className="size-5" />
            </div>
            <h2 className="text-xl font-semibold">Referral program</h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground">
            Share Flycation with friends. When they book their first trip, you
            both earn bonus points.
          </p>

          <div className="flex flex-wrap gap-3">
            <Badge className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300">
              You earn {referralProgram.youEarn.toLocaleString()} pts
            </Badge>
            <Badge className="rounded-full border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-sky-700 dark:text-sky-300">
              Friend earns {referralProgram.friendEarns.toLocaleString()} pts
            </Badge>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              readOnly
              value={referralProgram.link}
              className="h-11 rounded-xl bg-background/80 font-mono text-xs sm:text-sm"
            />
            <Button
              variant="outline"
              className="h-11 shrink-0 rounded-xl border-violet-500/30 bg-background/60 backdrop-blur-sm"
              onClick={() => void handleCopy()}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="relative flex size-32 items-center justify-center rounded-full border border-violet-500/20 bg-background/50 backdrop-blur-md">
            <Gift className="size-14 text-violet-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityTimeline({ activity }: { activity: LoyaltyActivity[] }) {
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Recent activity"
        description="Points earned from your booked trips (500 pts each)."
      />

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          {activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No trip activity yet. Book a trip to start earning points.
            </p>
          ) : (
            <div className="space-y-0">
              {activity.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-4 py-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 ring-4 ring-background dark:text-emerald-400">
                        <ArrowUp className="size-4" />
                      </div>
                      {index < activity.length - 1 && (
                        <div className="mt-2 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                          +{formatPoints(item.points)} pts
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  {index < activity.length - 1 && (
                    <Separator className="ml-14" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function AchievementBadgesSection({ badges }: { badges: AchievementBadge[] }) {
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Achievement badges"
        description="Collect badges as you explore the world with Flycation."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <Card
              key={badge.id}
              className={cn(
                "group rounded-2xl border-border/60 transition-all duration-300",
                badge.unlocked
                  ? "hover:-translate-y-0.5 hover:shadow-md"
                  : "opacity-60 grayscale"
              )}
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                    badge.unlocked
                      ? "bg-gradient-to-br from-amber-400/25 to-violet-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{badge.title}</h3>
                    {badge.unlocked && (
                      <Badge
                        variant="outline"
                        className="rounded-full text-[10px]"
                      >
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                  {badge.unlockedDate && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {badge.unlockedDate}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function LoyaltyLoadingView() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading your rewards…</p>
    </div>
  )
}

function LoyaltyPage() {
  const { toast } = useToast()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user.id)

        if (error) {
          console.error(error)
          return
        }

        setTrips((data ?? []) as Trip[])
      } finally {
        setLoaded(true)
      }
    }

    void fetchTrips()
  }, [])

  const profile = useMemo(() => buildLoyaltyProfile(trips), [trips])

  const handleRedeem = (title: string) => {
    toast(`Redeem request queued: ${title} (demo)`, "success")
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10 pb-4">
        {!loaded ? (
          <LoyaltyLoadingView />
        ) : (
          <>
            <HeroRewardsCard member={profile.member} />
            <StatsOverview stats={profile.stats} />
            <TierSystem currentTierId={profile.member.currentTier} />
            <RewardsMarketplace
              onRedeem={handleRedeem}
              currentPoints={profile.member.currentPoints}
            />
            <EarnPointsSection />
            <ReferralProgramCard />
            <ActivityTimeline activity={profile.activity} />
            <AchievementBadgesSection badges={profile.badges} />
          </>
        )}
      </div>
    </DashboardShell>
  )
}

export default LoyaltyPage

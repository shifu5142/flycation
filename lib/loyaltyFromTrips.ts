import {
  Award,
  Crown,
  Gem,
  Gift,
  Globe2,
  Medal,
  Plane,
  Sparkles,
  Star,
  Users,
} from "lucide-react"

import { formatLabel, formatTripDate, type Trip } from "@/lib/tripBooking"
import type {
  AchievementBadge,
  LoyaltyActivity,
  LoyaltyMember,
  LoyaltyStat,
  LoyaltyTierId,
} from "@/lib/mockLoyalty"
import { loyaltyTiers } from "@/lib/mockLoyalty"

export const POINTS_PER_TRIP = 500

export function computeTotalPoints(tripCount: number) {
  return tripCount * POINTS_PER_TRIP
}

export function getCurrentTierId(points: number): LoyaltyTierId {
  let current: LoyaltyTierId = "bronze"
  for (const tier of loyaltyTiers) {
    if (points >= tier.pointsRequired) {
      current = tier.id
    }
  }
  return current
}

export function getNextTierId(currentTier: LoyaltyTierId): LoyaltyTierId {
  const idx = loyaltyTiers.findIndex((t) => t.id === currentTier)
  if (idx < 0 || idx >= loyaltyTiers.length - 1) {
    return loyaltyTiers[loyaltyTiers.length - 1].id
  }
  return loyaltyTiers[idx + 1].id
}

export function buildLoyaltyMember(trips: Trip[]): LoyaltyMember {
  const activeTrips = trips.filter(
    (t) => t.booking_status?.toLowerCase() !== "cancelled"
  )
  const currentPoints = computeTotalPoints(activeTrips.length)
  const currentTier = getCurrentTierId(currentPoints)
  const nextTier = getNextTierId(currentTier)

  const currentTierDef = loyaltyTiers.find((t) => t.id === currentTier)!
  const nextTierDef = loyaltyTiers.find((t) => t.id === nextTier)!

  const tierSpan = nextTierDef.pointsRequired - currentTierDef.pointsRequired
  const progressInTier = currentPoints - currentTierDef.pointsRequired
  const tierProgressPercent =
    currentTier === nextTier
      ? 100
      : tierSpan > 0
        ? Math.min(100, Math.round((progressInTier / tierSpan) * 100))
        : 0

  return {
    currentTier,
    currentPoints,
    nextTier,
    pointsToNextTier: nextTierDef.pointsRequired,
    tierProgressPercent,
  }
}

export function buildLoyaltyStats(trips: Trip[]): LoyaltyStat[] {
  const activeTrips = trips.filter(
    (t) => t.booking_status?.toLowerCase() !== "cancelled"
  )
  const totalPoints = computeTotalPoints(activeTrips.length)

  return [
    {
      id: "points",
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Sparkles,
      accent:
        "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      id: "trips",
      label: "Trips Booked",
      value: String(activeTrips.length),
      icon: Plane,
      accent: "from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      id: "redeemed",
      label: "Rewards Redeemed",
      value: "0",
      icon: Gift,
      accent:
        "from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      id: "referrals",
      label: "Successful Referrals",
      value: "0",
      icon: Users,
      accent:
        "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ]
}

export function buildLoyaltyActivity(trips: Trip[]): LoyaltyActivity[] {
  return [...trips]
    .filter((t) => t.booking_status?.toLowerCase() !== "cancelled")
    .sort(
      (a, b) =>
        new Date(b.departure).getTime() - new Date(a.departure).getTime()
    )
    .map((trip) => {
      const destination = formatLabel(trip.to)
      const origin = formatLabel(trip.from)
      const tripType = trip.returnDate ? "Round trip" : "One way"
      const statusLabel = trip.booking_status
        ? trip.booking_status.charAt(0).toUpperCase() +
          trip.booking_status.slice(1).toLowerCase()
        : "Booked"

      return {
        id: String(trip.id),
        title: `${destination} booking`,
        subtitle: `${origin} → ${destination} · ${tripType} · ${statusLabel}`,
        points: POINTS_PER_TRIP,
        date: formatTripDate(trip.departure),
        type: "earn" as const,
      }
    })
}

function tierRank(id: LoyaltyTierId) {
  return loyaltyTiers.findIndex((t) => t.id === id)
}

export function buildAchievementBadges(
  trips: Trip[],
  member: LoyaltyMember
): AchievementBadge[] {
  const activeTrips = trips.filter(
    (t) => t.booking_status?.toLowerCase() !== "cancelled"
  )
  const uniqueDestinations = new Set(
    activeTrips.map((t) => t.to.trim().toLowerCase())
  )
  const firstTrip = activeTrips[0]
  const currentRank = tierRank(member.currentTier)

  return [
    {
      id: "first-trip",
      title: "First Trip",
      description: "Completed your first booking",
      icon: Plane,
      unlocked: activeTrips.length >= 1,
      unlockedDate:
        activeTrips.length >= 1 && firstTrip
          ? formatTripDate(firstTrip.departure)
          : undefined,
    },
    {
      id: "world-explorer",
      title: "World Explorer",
      description: "Visited 5+ countries",
      icon: Globe2,
      unlocked: uniqueDestinations.size >= 5,
      unlockedDate:
        uniqueDestinations.size >= 5 ? formatTripDate(new Date().toISOString()) : undefined,
    },
    {
      id: "referral-master",
      title: "Referral Master",
      description: "Referred 3 successful members",
      icon: Users,
      unlocked: false,
    },
    {
      id: "silver-status",
      title: "Silver Status",
      description: "Reached Silver membership tier",
      icon: Award,
      unlocked: currentRank >= tierRank("silver"),
      unlockedDate:
        currentRank >= tierRank("silver") ? "Unlocked" : undefined,
    },
    {
      id: "gold-status",
      title: "Gold Status",
      description: "Reached Gold membership tier",
      icon: Crown,
      unlocked: currentRank >= tierRank("gold"),
      unlockedDate: currentRank >= tierRank("gold") ? "Unlocked" : undefined,
    },
    {
      id: "platinum-path",
      title: "Platinum Path",
      description: "Reach Platinum tier",
      icon: Gem,
      unlocked: currentRank >= tierRank("platinum"),
    },
    {
      id: "reviewer",
      title: "Top Reviewer",
      description: "Submit 10 helpful reviews",
      icon: Star,
      unlocked: false,
    },
  ]
}

export function buildLoyaltyProfile(trips: Trip[]) {
  const member = buildLoyaltyMember(trips)
  return {
    member,
    stats: buildLoyaltyStats(trips),
    activity: buildLoyaltyActivity(trips),
    badges: buildAchievementBadges(trips, member),
  }
}

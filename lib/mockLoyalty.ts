import type { LucideIcon } from "lucide-react"
import {
  Award,
  BadgeCheck,
  Crown,
  Gem,
  Gift,
  Globe2,
  Medal,
  Plane,
  Shield,
  Sparkles,
  Star,
  Ticket,
  Users,
} from "lucide-react"

export type LoyaltyTierId = "bronze" | "silver" | "gold" | "platinum"

export type LoyaltyMember = {
  currentTier: LoyaltyTierId
  currentPoints: number
  nextTier: LoyaltyTierId
  pointsToNextTier: number
  tierProgressPercent: number
}

export type LoyaltyStat = {
  id: string
  label: string
  value: string
  icon: LucideIcon
  accent: string
}

export type TierDefinition = {
  id: LoyaltyTierId
  name: string
  pointsRequired: number
  icon: LucideIcon
  perks: string[]
  gradient: string
  ring: string
}

export type MarketplaceReward = {
  id: string
  title: string
  description: string
  pointsCost: number
  icon: LucideIcon
  accent: string
  tag?: string
}

export type EarnPointsAction = {
  id: string
  title: string
  description: string
  points: number
  icon: LucideIcon
}

export type LoyaltyActivity = {
  id: string
  title: string
  subtitle: string
  points: number
  date: string
  type: "earn" | "redeem"
}

export type AchievementBadge = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  unlocked: boolean
  unlockedDate?: string
}

/** Replace with API response when backend is connected */
export const loyaltyMember: LoyaltyMember = {
  currentTier: "gold",
  currentPoints: 7250,
  nextTier: "platinum",
  pointsToNextTier: 10000,
  tierProgressPercent: 72,
}

export const loyaltyStats: LoyaltyStat[] = [
  {
    id: "points",
    label: "Total Points",
    value: "7,250",
    icon: Sparkles,
    accent: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "trips",
    label: "Trips Booked",
    value: "12",
    icon: Plane,
    accent: "from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    id: "redeemed",
    label: "Rewards Redeemed",
    value: "4",
    icon: Gift,
    accent: "from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    id: "referrals",
    label: "Successful Referrals",
    value: "3",
    icon: Users,
    accent: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
]

export const loyaltyTiers: TierDefinition[] = [
  {
    id: "bronze",
    name: "Bronze",
    pointsRequired: 0,
    icon: Medal,
    perks: ["Member pricing", "Birthday bonus"],
    gradient: "from-amber-700/80 to-amber-900/60",
    ring: "ring-amber-600/40",
  },
  {
    id: "silver",
    name: "Silver",
    pointsRequired: 2500,
    icon: Award,
    perks: ["Priority support", "5% hotel credit"],
    gradient: "from-slate-400/80 to-slate-600/60",
    ring: "ring-slate-400/40",
  },
  {
    id: "gold",
    name: "Gold",
    pointsRequired: 5000,
    icon: Crown,
    perks: ["Lounge access", "10% upgrades", "Free seat selection"],
    gradient: "from-amber-400/90 to-yellow-600/70",
    ring: "ring-amber-400/50",
  },
  {
    id: "platinum",
    name: "Platinum",
    pointsRequired: 10000,
    icon: Gem,
    perks: ["Concierge service", "15% off flights", "Companion pass"],
    gradient: "from-violet-500/90 to-indigo-600/70",
    ring: "ring-violet-400/50",
  },
]

export const marketplaceRewards: MarketplaceReward[] = [
  {
    id: "credit-25",
    title: "$25 Travel Credit",
    description: "Apply toward any flight or hotel booking on Flycation.",
    pointsCost: 2500,
    icon: Ticket,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    tag: "Popular",
  },
  {
    id: "hotel-10",
    title: "10% Hotel Discount",
    description: "One-time discount on your next hotel reservation.",
    pointsCost: 1800,
    icon: Star,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "lounge",
    title: "Airport Lounge Pass",
    description: "Single-entry pass at participating airport lounges worldwide.",
    pointsCost: 3200,
    icon: Crown,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    id: "insurance",
    title: "Free Travel Insurance",
    description: "Comprehensive coverage for one international trip up to 14 days.",
    pointsCost: 4000,
    icon: Shield,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
]

export const earnPointsActions: EarnPointsAction[] = [
  {
    id: "book",
    title: "Book a Trip",
    description: "Earn points on every flight, hotel, or package you book.",
    points: 500,
    icon: Plane,
  },
  {
    id: "complete",
    title: "Complete a Trip",
    description: "Bonus points when you finish your journey and check in.",
    points: 300,
    icon: BadgeCheck,
  },
  {
    id: "review",
    title: "Leave a Review",
    description: "Share feedback about your destination or stay.",
    points: 100,
    icon: Star,
  },
  {
    id: "refer",
    title: "Refer a Friend",
    description: "Invite friends to join Flycation and travel together.",
    points: 1000,
    icon: Users,
  },
]

export const referralProgram = {
  link: "https://flycation.app/join?ref=FC-GOLD-7X29",
  youEarn: 1000,
  friendEarns: 500,
}

export const loyaltyActivity: LoyaltyActivity[] = [
  {
    id: "a1",
    title: "Thailand booking",
    subtitle: "Round-trip flight · Bangkok",
    points: 500,
    date: "Mar 18, 2026",
    type: "earn",
  },
  {
    id: "a2",
    title: "Review submitted",
    subtitle: "Tokyo Grand Hotel · 5 stars",
    points: 100,
    date: "Mar 12, 2026",
    type: "earn",
  },
  {
    id: "a3",
    title: "Referral bonus",
    subtitle: "Alex M. joined Flycation",
    points: 1000,
    date: "Mar 5, 2026",
    type: "earn",
  },
  {
    id: "a4",
    title: "Travel credit redeemed",
    subtitle: "$25 applied to booking FC-8X29K",
    points: -2500,
    date: "Feb 28, 2026",
    type: "redeem",
  },
]

export const achievementBadges: AchievementBadge[] = [
  {
    id: "first-trip",
    title: "First Trip",
    description: "Completed your first booking",
    icon: Plane,
    unlocked: true,
    unlockedDate: "Jan 2026",
  },
  {
    id: "world-explorer",
    title: "World Explorer",
    description: "Visited 5+ countries",
    icon: Globe2,
    unlocked: true,
    unlockedDate: "Feb 2026",
  },
  {
    id: "referral-master",
    title: "Referral Master",
    description: "Referred 3 successful members",
    icon: Users,
    unlocked: true,
    unlockedDate: "Mar 2026",
  },
  {
    id: "gold-status",
    title: "Gold Status",
    description: "Reached Gold membership tier",
    icon: Crown,
    unlocked: true,
    unlockedDate: "Mar 2026",
  },
  {
    id: "platinum-path",
    title: "Platinum Path",
    description: "Reach Platinum tier",
    icon: Gem,
    unlocked: false,
  },
  {
    id: "reviewer",
    title: "Top Reviewer",
    description: "Submit 10 helpful reviews",
    icon: Star,
    unlocked: false,
  },
]

export function getTierById(id: LoyaltyTierId) {
  return loyaltyTiers.find((tier) => tier.id === id)!
}

export function formatPoints(value: number) {
  return Math.abs(value).toLocaleString()
}

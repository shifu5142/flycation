"use client"

import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  BookOpen,
  Compass,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Map,
  Menu,
  Plane,
  Settings,
  Sparkles,
} from "lucide-react"

import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useAuth } from "@/components/AuthProvider"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {supabase} from "@/app/services/supabase/client"
import { Trip } from "@/lib/tripBooking"
const navItems = [
  { href: "/ai-trip-planner" as const, labelKey: "aiTripPlanner" as const, icon: Sparkles },
  { href: "/my-trips" as const, labelKey: "myTrips" as const, icon: Map },
  { href: "/explore" as const, labelKey: "explore" as const, icon: Compass },
  { href: "/my-bookings" as const, labelKey: "myBookings" as const, icon: BookOpen },
]

function isNavActive(pathname: string, href: (typeof navItems)[number]["href"]) {
  if (pathname === href) return true
  if (href === "/my-trips") {
    return pathname.startsWith("/my-trips") || pathname.startsWith("/trip")
  }
  if (href === "/my-bookings") {
    return pathname.startsWith("/my-bookings")
  }
  return false
}

function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("sidebar")
  const tCommon = useTranslations("common")
  const { displayName, firstName, email, avatar, loading } = useAuth()
  const name = displayName || firstName || email.split("@")[0] || t("traveler")
  const initials = (firstName || name).charAt(0).toUpperCase() || "?"
  const [trips, setTrips] = useState<string[]>([])
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
      .from("trips")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      if (error) {
        console.error(error)
        return
      }
      setTrips(data.map((trip: Trip) => trip))
    }
    loadUserData()
  }, [])
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
        return
      }
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Plane className="size-4" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            {tCommon("appName")}
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isNavActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden h-10 gap-2 rounded-xl px-2 sm:flex"
              >
                <Avatar className="size-8">
                  {avatar && <AvatarImage src={avatar} alt={name} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[8rem] truncate text-sm font-medium lg:inline">
                  {loading ? tCommon("loading") : name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-medium">
                  {loading ? tCommon("loading") : name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {loading ? "…" : email || "—"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/loyalty" className="cursor-pointer">
                  <Gift className="size-4" />
                  {t("loyalty")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support" className="cursor-pointer">
                  <LifeBuoy className="size-4" />
                  {t("support")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="size-4" />
                  {t("settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => void handleLogout()}
              >
                <LogOut className="size-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col p-0">
              <div className="flex items-center gap-2 border-b px-4 py-5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Plane className="size-4" />
                </div>
                <span className="text-lg font-semibold">{tCommon("appName")}</span>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isNavActive(pathname, item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
              </nav>

              <Separator />

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {avatar && <AvatarImage src={avatar} alt={name} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {loading ? tCommon("loading") : name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {loading ? "…" : email || "—"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl"
                  asChild
                >
                  <Link href="/support">
                    <LifeBuoy className="size-4" />
                    {t("support")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="size-4" />
                    {t("settings")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl"
                  onClick={() => void handleLogout()}
                >
                  <LogOut className="size-4" />
                  {t("logout")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}

/** @deprecated Use AppHeader via DashboardShell */
function Sidebar() {
  return null
}

/** @deprecated Header menu replaces mobile sidebar */
function MobileSidebar() {
  return null
}

export { Sidebar, MobileSidebar, DashboardShell, AppHeader }

"use client"

import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  BookOpen,
  Compass,
  LayoutDashboard,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/dashboard" as const, labelKey: "dashboard" as const, icon: LayoutDashboard },
  { href: "/ai-trip-planner" as const, labelKey: "aiTripPlanner" as const, icon: Sparkles },
  { href: "/my-trips" as const, labelKey: "myTrips" as const, icon: Map },
  { href: "/explore" as const, labelKey: "explore" as const, icon: Compass },
  { href: "/my-bookings" as const, labelKey: "myBookings" as const, icon: BookOpen },
  { href: "/settings" as const, labelKey: "settings" as const, icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("sidebar")
  const tCommon = useTranslations("common")
  const { displayName, firstName, email, avatar, loading } = useAuth()
  const name = displayName || firstName || email.split("@")[0] || t("traveler")
  const initials = (firstName || name).charAt(0).toUpperCase() || "?"

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error(error)
        return
      }

      onNavigate?.()
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plane className="size-4" />
          </div>
          <span className="text-lg font-semibold">{tCommon("appName")}</span>
        </div>
        <LanguageSwitcher />
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href === "/my-trips" &&
                (pathname.startsWith("/my-trips") ||
                  pathname.startsWith("/trip")))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
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
      </ScrollArea>

      <Separator />

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {loading ? "Loading…" : name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {loading ? "…" : email || "—"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <SidebarContent />
    </aside>
  )
}

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const tCommon = useTranslations("common")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <MobileSidebar />
          <span className="flex-1 font-semibold">{tCommon("appName")}</span>
          <LanguageSwitcher />
        </div>
        <main className="flex-1 overflow-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export { Sidebar, MobileSidebar, DashboardShell }

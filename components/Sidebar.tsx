"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Compass,
  Settings,
  Plane,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { mockUser } from "@/lib/mockUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard", label: "My Trips", icon: Map },
  { href: "/dashboard", label: "Explore", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Plane className="size-4" />
        </div>
        <span className="text-lg font-semibold">Flycation</span>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.label === "Settings" && pathname === "/settings") ||
              (item.label !== "Settings" && pathname.startsWith("/trip"))

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
          <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{mockUser.name}</p>
          <p className="truncate text-xs text-muted-foreground">{mockUser.email}</p>
        </div>
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
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <MobileSidebar />
          <span className="font-semibold">Flycation</span>
        </div>
        <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export { Sidebar, MobileSidebar, DashboardShell }

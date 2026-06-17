import type { ReactNode } from "react"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GuestConversionBanner } from "@/components/GuestConversionBanner"

type GuestLayoutProps = {
  children: ReactNode
  showBanner?: boolean
  bannerVariant?: "default" | "planner"
}

function GuestLayout({
  children,
  showBanner = true,
  bannerVariant = "default",
}: GuestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showBanner && <GuestConversionBanner variant={bannerVariant} />}
      <Footer />
    </div>
  )
}

export { GuestLayout }

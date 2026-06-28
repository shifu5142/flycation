"use client"

import { DashboardShell } from "@/components/Sidebar"
import { FlightHotelDealsSection } from "@/components/FlightHotelDealsSection"

export default function DealsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <FlightHotelDealsSection />
      </div>
    </DashboardShell>
  )
}

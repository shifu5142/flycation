"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import type { FlightHotelDeal } from "@/lib/mockFlightHotelDeals"
import { cn } from "@/lib/utils"

type DealsMapProps = {
  deals: FlightHotelDeal[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  formatPrice: (price: number) => string
}

function createMarkerIcon(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="deals-map-marker ${active ? "deals-map-marker--active" : ""}"><span class="deals-map-marker__dot"></span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export function DealsMap({
  deals,
  selectedId,
  hoveredId,
  onSelect,
  formatPrice,
}: DealsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([25, 10], 2)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const existing = markersRef.current
    const nextIds = new Set(deals.map((d) => d.id))

    existing.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        marker.remove()
        existing.delete(id)
      }
    })

    deals.forEach((deal) => {
      const active = deal.id === selectedId || deal.id === hoveredId

      let marker = existing.get(deal.id)
      if (marker) {
        marker.setLatLng([deal.coordinates.lat, deal.coordinates.lng])
        marker.setIcon(createMarkerIcon(active))
        marker.setPopupContent(
          `<strong>${deal.hotelName}</strong><br/>${formatPrice(deal.price)}`
        )
        if (deal.id === selectedId) {
          marker.openPopup()
        }
      } else {
        marker = L.marker([deal.coordinates.lat, deal.coordinates.lng], {
          icon: createMarkerIcon(active),
        })
          .addTo(map)
          .bindPopup(`<strong>${deal.hotelName}</strong><br/>${formatPrice(deal.price)}`)

        marker.on("click", () => onSelect(deal.id))
        existing.set(deal.id, marker)
      }
    })

    if (deals.length === 0) return

    if (selectedId) {
      const selected = deals.find((d) => d.id === selectedId)
      if (selected) {
        map.flyTo(
          [selected.coordinates.lat, selected.coordinates.lng],
          Math.max(map.getZoom(), 5),
          { duration: 0.6 }
        )
      }
    } else if (deals.length === 1) {
      map.setView([deals[0].coordinates.lat, deals[0].coordinates.lng], 6)
    } else {
      const bounds = L.latLngBounds(
        deals.map((d) => [d.coordinates.lat, d.coordinates.lng] as [number, number])
      )
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 })
    }
  }, [deals, selectedId, hoveredId, onSelect, formatPrice])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
      )}
    >
      <div ref={containerRef} className="h-[min(70vh,520px)] w-full lg:h-[calc(100vh-10rem)] lg:min-h-[480px]" />
    </div>
  )
}

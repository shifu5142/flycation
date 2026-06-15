"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, MapPin, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  COUNTRY_AIRPORTS,
  filterCountries,
  findCountryLocation,
  toLocationName,
} from "@/lib/countries"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AirportSearchInputProps {
  id: string
  label: string
  value: string
  onChange: (location: string) => void
  placeholder?: string
  className?: string
  size?: "default" | "lg"
}

type DropdownPosition = {
  top: number
  left: number
  width: number
}

function AirportSearchInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Select",
  className,
  size = "default",
}: AirportSearchInputProps) {
  const isLarge = size === "lg"
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  })

  const selected = findCountryLocation(value)
  const results = filterCountries(query)

  const displayValue = selected ? selected.country : value || ""

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 256),
    })
  }, [])

  useEffect(() => {
    if (!open) return

    updatePosition()

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
      setQuery("")
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  const handleSelect = (country: string) => {
    onChange(toLocationName(country))
    setOpen(false)
    setQuery("")
  }

  const dropdown =
    open &&
    createPortal(
      <div
        ref={dropdownRef}
        id={listId}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: position.width,
          zIndex: 200,
        }}
        className="overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
      >
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or airport…"
              className="h-8 rounded-lg pl-8 text-sm"
            />
          </div>
          <p className="mt-1.5 px-1 text-xs text-muted-foreground">
            {results.length} of {COUNTRY_AIRPORTS.length} countries
          </p>
        </div>

        <ScrollArea className="h-56">
          <ul className="p-1">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No countries found
              </li>
            ) : (
              results.map((item) => (
                <li key={`${item.country}-${item.airport}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.country)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                      value === toLocationName(item.country) &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {item.country}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.city}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold">
                      {item.airport}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </div>,
      document.body
    )

  return (
    <div ref={containerRef} className={cn("relative space-y-1.5", className)}>
      <Label htmlFor={id} className={cn("font-medium text-muted-foreground", isLarge ? "text-sm" : "text-xs")}>
        {label}
      </Label>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev
            if (next) updatePosition()
            return next
          })
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-left shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isLarge ? "h-11 text-sm" : "h-9 text-sm",
          !displayValue && "text-muted-foreground"
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <MapPin className={cn("shrink-0 text-primary", isLarge ? "size-4" : "size-3.5")} />
          <span className="truncate">{displayValue || placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {dropdown}
    </div>
  )
}

export { AirportSearchInput }

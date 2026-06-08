"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown, MapPin, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  COUNTRY_AIRPORTS,
  filterCountries,
  findCountryByAirport,
} from "@/lib/countries"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AirportSearchInputProps {
  id: string
  label: string
  value: string
  onChange: (airport: string) => void
  placeholder?: string
  className?: string
}

function AirportSearchInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Select",
  className,
}: AirportSearchInputProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selected = findCountryByAirport(value)
  const results = filterCountries(query)

  const displayValue = selected
    ? `${selected.airport} · ${selected.country}`
    : value || ""

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        setQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  const handleSelect = (airport: string) => {
    onChange(airport)
    setOpen(false)
    setQuery("")
  }

  return (
    <div ref={containerRef} className={cn("relative space-y-1.5", className)}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !displayValue && "text-muted-foreground"
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">
            {displayValue || placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          id={listId}
          className="absolute top-full z-50 mt-1 w-full min-w-[16rem] overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
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
                      onClick={() => handleSelect(item.airport)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        value === item.airport && "bg-primary/10 text-primary"
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
        </div>
      )}
    </div>
  )
}

export { AirportSearchInput }

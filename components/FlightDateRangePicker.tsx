"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { createPortal } from "react-dom"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type TripType = "oneway" | "roundtrip"

interface FlightDateRangePickerProps {
  tripType: TripType
  departure: string
  returnDate: string
  onDepartureChange: (value: string) => void
  onReturnChange: (value: string) => void
  label?: string
}

function parseISO(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function toISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatShort(value: string) {
  if (!value) return ""
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(parseISO(value))
}

function tripDays(departure: string, returnDate: string) {
  const start = parseISO(departure).getTime()
  const end = parseISO(returnDate).getTime()
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)))
}

function buildMonthDays(month: Date) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingEmpty = (firstDay.getDay() + 6) % 7

  const cells: Array<{ iso: string; date: Date } | null> = []
  for (let i = 0; i < leadingEmpty; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day)
    cells.push({ iso: toISO(date), date })
  }
  return cells
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function FlightDateRangePicker({
  tripType,
  departure,
  returnDate,
  onDepartureChange,
  onReturnChange,
  label,
}: FlightDateRangePickerProps) {
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const mounted = useIsClient()
  const [viewMonth, setViewMonth] = useState(() => startOfDay(new Date()))
  const [hoverDate, setHoverDate] = useState<string | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 300 })

  const today = startOfDay(new Date())
  const months = useMemo(
    () =>
      tripType === "roundtrip"
        ? [viewMonth, addMonths(viewMonth, 1)]
        : [viewMonth],
    [viewMonth, tripType]
  )
  const selectedDays =
    tripType === "roundtrip" && departure && returnDate
      ? tripDays(departure, returnDate)
      : null

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const width =
      tripType === "roundtrip"
        ? Math.min(Math.max(rect.width, 520), window.innerWidth - 32)
        : Math.min(Math.max(rect.width, 280), window.innerWidth - 32)
    let left = rect.left

    if (left + width > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - width - 16)
    }

    setPosition({
      top: rect.bottom + 6,
      left,
      width,
    })
  }, [tripType])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open, updatePosition, tripType])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
      setHoverDate(null)
    }

    const handleReposition = () => updatePosition()

    document.addEventListener("click", handleClickOutside, true)
    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)

    return () => {
      document.removeEventListener("click", handleClickOutside, true)
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [open, updatePosition])

  const handleDaySelect = (iso: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const selected = startOfDay(parseISO(iso))
    if (selected < today) return

    if (tripType === "oneway") {
      onDepartureChange(iso)
      onReturnChange("")
      setOpen(false)
      setHoverDate(null)
      return
    }

    if (!departure || (departure && returnDate)) {
      onDepartureChange(iso)
      onReturnChange("")
      setHoverDate(null)
      return
    }

    if (iso <= departure) {
      onDepartureChange(iso)
      onReturnChange("")
      setHoverDate(null)
      return
    }

    onReturnChange(iso)
    setHoverDate(null)
    setOpen(false)
  }

  const getDayState = (iso: string) => {
    const date = parseISO(iso)
    const isPast = startOfDay(date) < today
    const isDeparture = departure === iso
    const isReturn = returnDate === iso
    let inRange = false

    if (tripType === "roundtrip" && departure) {
      const endIso =
        returnDate || (hoverDate && hoverDate > departure ? hoverDate : "")
      if (endIso) {
        const start = parseISO(departure).getTime()
        const end = parseISO(endIso).getTime()
        const current = date.getTime()
        inRange = current > start && current < end
      }
    }

    return { isPast, isDeparture, isReturn, inRange }
  }

  const triggerLabel =
    tripType === "oneway"
      ? departure
        ? formatShort(departure)
        : "Select date"
      : departure && returnDate
        ? `${formatShort(departure)} → ${formatShort(returnDate)}`
        : departure
          ? `${formatShort(departure)} → Return`
          : "Select dates"

  const fieldLabel = label ?? (tripType === "oneway" ? "Departure" : "Dates")

  const dropdown =
    open &&
    mounted &&
    createPortal(
      <div
        ref={dropdownRef}
        id={panelId}
        role="dialog"
        aria-label="Choose travel dates"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: position.width,
          zIndex: 200,
        }}
        className="flex max-h-[min(28rem,calc(100vh-6rem))] flex-col overflow-hidden overscroll-contain rounded-xl border border-border bg-popover shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 shrink-0 border-b border-border bg-popover">
          <p className="px-3 pt-2.5 text-xs font-semibold text-foreground">
            {fieldLabel}
          </p>
          <div className="bg-muted/30 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">
              {tripType === "oneway"
                ? "Select departure"
                : returnDate
                  ? `${selectedDays} day${selectedDays === 1 ? "" : "s"} trip`
                  : departure
                    ? "Select return date"
                    : "Select departure date"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain p-3",
            "grid gap-3",
            tripType === "roundtrip" ? "sm:grid-cols-2" : "grid-cols-1"
          )}
        >
          {months.map((month, monthIndex) => (
            <div key={`${month.getFullYear()}-${month.getMonth()}`}>
              <div className="mb-2 flex items-center justify-between">
                {monthIndex === 0 ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setViewMonth(addMonths(viewMonth, -1))
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                ) : (
                  <span className="size-6" />
                )}
                <p className="text-xs font-semibold">
                  {new Intl.DateTimeFormat("en-GB", {
                    month: "long",
                    year: "numeric",
                  }).format(month)}
                </p>
                {monthIndex === months.length - 1 ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setViewMonth(addMonths(viewMonth, 1))
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <span className="size-6" />
                )}
              </div>

              <div className="mb-1 grid grid-cols-7 gap-0.5">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-0.5 text-center text-[10px] font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {buildMonthDays(month).map((cell, index) => {
                  if (!cell) {
                    return <div key={`empty-${monthIndex}-${index}`} className="h-8" />
                  }

                  const { isPast, isDeparture, isReturn, inRange } = getDayState(
                    cell.iso
                  )
                  const isToday = isSameDay(cell.date, today)

                  return (
                    <button
                      key={`${monthIndex}-${cell.iso}`}
                      type="button"
                      disabled={isPast}
                      onMouseEnter={() => {
                        if (tripType === "roundtrip" && departure && !returnDate) {
                          setHoverDate(cell.iso)
                        }
                      }}
                      onMouseLeave={() => setHoverDate(null)}
                      onClick={(event) => handleDaySelect(cell.iso, event)}
                      className={cn(
                        "h-8 text-xs transition-colors",
                        isDeparture &&
                          "rounded-l-md bg-primary font-semibold text-primary-foreground",
                        isReturn &&
                          "rounded-r-md bg-primary font-semibold text-primary-foreground",
                        inRange && "bg-primary/15 text-primary",
                        !isDeparture &&
                          !isReturn &&
                          !inRange &&
                          "rounded-md hover:bg-muted",
                        isPast &&
                          "cursor-not-allowed text-muted-foreground/40 hover:bg-transparent",
                        isToday &&
                          !isDeparture &&
                          !isReturn &&
                          "font-semibold ring-1 ring-primary/40"
                      )}
                    >
                      {cell.date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    )

  return (
    <div ref={containerRef} className={cn("relative", open && "z-[201]")}>
      <div
        className={cn(
          "space-y-1.5",
          open &&
            "sticky top-4 z-[201] rounded-xl bg-background/95 p-1 backdrop-blur-sm sm:top-16"
        )}
      >
        <Label className="text-sm font-medium text-muted-foreground">
          {fieldLabel}
        </Label>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={(event) => {
            event.stopPropagation()
            if (open) {
              setOpen(false)
              return
            }
            setViewMonth(
              departure
                ? startOfDay(parseISO(departure))
                : startOfDay(new Date())
            )
            updatePosition()
            setOpen(true)
          }}
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-xl border border-input/80 bg-muted/30 px-3 text-left text-sm shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            !departure && "text-muted-foreground"
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate font-medium">{triggerLabel}</span>
          {selectedDays !== null && selectedDays > 0 && (
            <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
              {selectedDays}d
            </span>
          )}
        </button>
      </div>

      {dropdown}
    </div>
  )
}

export { FlightDateRangePicker, formatShort as formatFlightDate }

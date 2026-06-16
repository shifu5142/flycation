"use client"

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"
import {
  Bot,
  CalendarDays,
  Check,
  Heart,
  Loader2,
  MapPin,
  Send,
  Sparkles,
  User,
  Users,
  Wallet,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  BUDGET_OPTIONS,
  createMessageId,
  DURATION_OPTIONS,
  formatInterests,
  formatTravelers,
  getCompletionMessage,
  getNextField,
  getQuestionForField,
  getWelcomeMessage,
  INITIAL_TRIP_INTAKE,
  INTERESTS,
  isIntakeComplete,
  TRAVEL_STYLES,
  type ChatMessage,
  type TripIntakeData,
  type TripInterest,
  type TravelerType,
  type UserTravelStyle,
} from "@/lib/aiTripIntake"
import { cn } from "@/lib/utils"

type TravelersStep = "type" | "count"

type TripIntakeAssistantProps = {
  tripAnswers: TripIntakeData
  setTripAnswers: Dispatch<SetStateAction<TripIntakeData>>
  generating: boolean
  onGenerate: () => void
  onReset?: () => void
}

function SummaryRow({
  label,
  value,
  icon: Icon,
  done,
}: {
  label: string
  value: string | null
  icon: typeof MapPin
  done: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {done ? <Check className="size-4" /> : <Icon className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-sm font-medium",
            value ? "text-foreground" : "text-muted-foreground/70"
          )}
        >
          {value ?? "Not set yet"}
        </p>
      </div>
    </div>
  )
}

function TripSummaryPanel({
  data,
  generating,
  onGenerate,
  onReset,
}: {
  data: TripIntakeData
  generating: boolean
  onGenerate: () => void
  onReset: () => void
}) {
  const complete = isIntakeComplete(data)
  const progress =
    [
      data.destination,
      data.duration,
      data.budget,
      data.travelStyle,
      data.travelers,
      data.interests.length > 0 ? "done" : null,
    ].filter(Boolean).length

  return (
    <Card className="sticky top-4 rounded-2xl border-primary/15 shadow-lg shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Trip summary</CardTitle>
          <Badge variant="secondary" className="rounded-full text-xs">
            {progress}/6
          </Badge>
        </div>
        <CardDescription>Updates as you answer each question</CardDescription>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(progress / 6) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <SummaryRow
          label="Destination"
          value={data.destination}
          icon={MapPin}
          done={!!data.destination}
        />
        <SummaryRow
          label="Duration"
          value={data.duration}
          icon={CalendarDays}
          done={!!data.duration}
        />
        <SummaryRow
          label="Budget"
          value={data.budget}
          icon={Wallet}
          done={!!data.budget}
        />
        <SummaryRow
          label="Travel style"
          value={data.travelStyle}
          icon={Sparkles}
          done={!!data.travelStyle}
        />
        <SummaryRow
          label="Travelers"
          value={formatTravelers(data)}
          icon={Users}
          done={!!data.travelers}
        />
        <SummaryRow
          label="Interests"
          value={formatInterests(data.interests)}
          icon={Heart}
          done={data.interests.length > 0}
        />

        <Separator className="my-4" />

        <Button
          className="w-full rounded-xl font-semibold shadow-md shadow-primary/20"
          size="lg"
          disabled={!complete || generating}
          onClick={onGenerate}
        >
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating trip…
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              Generate trip
            </>
          )}
        </Button>
        {!complete && (
          <p className="text-center text-xs text-muted-foreground">
            Complete all questions to enable generation
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={onReset}
          disabled={generating}
        >
          Start over
        </Button>
      </CardContent>
    </Card>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <Bot className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAssistant
            ? "rounded-tl-md border border-border/60 bg-card"
            : "rounded-tr-md bg-primary text-primary-foreground"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : undefined}>
            {line.replace(/\*\*(.*?)\*\*/g, "$1")}
          </p>
        ))}
      </div>
      {!isAssistant && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="size-4" />
        </div>
      )}
    </div>
  )
}

export function TripIntakeAssistant({
  tripAnswers,
  setTripAnswers,
  generating,
  onGenerate,
  onReset,
}: TripIntakeAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createMessageId(),
      role: "assistant",
      content: getWelcomeMessage(),
    },
  ])
  const [textInput, setTextInput] = useState("")
  const [travelersStep, setTravelersStep] = useState<TravelersStep>("type")
  const [selectedInterests, setSelectedInterests] = useState<TripInterest[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const askTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intakeRef = useRef<TripIntakeData>(tripAnswers)

  const currentField = getNextField(tripAnswers)
  const complete = isIntakeComplete(tripAnswers)

  useEffect(() => {
    intakeRef.current = tripAnswers
  }, [tripAnswers])

  const appendMessages = (...msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs])
  }

  const askNext = (data: TripIntakeData, step: TravelersStep = "type") => {
    if (!data) return
    const next = getNextField(data)
    if (!next) {
      appendMessages({
        id: createMessageId(),
        role: "assistant",
        content: getCompletionMessage(data),
      })
      return
    }
    const question =
      next === "travelers"
        ? getQuestionForField("travelers", step)
        : getQuestionForField(next)
    appendMessages({
      id: createMessageId(),
      role: "assistant",
      content: question,
    })
  }

  const scheduleAskNext = (
    data: TripIntakeData,
    step: TravelersStep = "type"
  ) => {
    if (!data) return
    if (askTimeoutRef.current) {
      clearTimeout(askTimeoutRef.current)
    }
    askTimeoutRef.current = setTimeout(() => {
      askTimeoutRef.current = null
      askNext(data, step)
    }, 300)
  }

  const acknowledgeAndAdvance = (
    userText: string,
    updater: (prev: TripIntakeData) => TripIntakeData,
    nextTravelersStep: TravelersStep = "type"
  ) => {
    const nextData = updater(intakeRef.current)
    intakeRef.current = nextData
    setTripAnswers(nextData)
    appendMessages({
      id: createMessageId(),
      role: "user",
      content: userText,
    })
    setTextInput("")
    setSelectedInterests([])
    scheduleAskNext(nextData, nextTravelersStep)
  }

  useEffect(() => {
    return () => {
      if (askTimeoutRef.current) {
        clearTimeout(askTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, currentField, selectedInterests])

  useEffect(() => {
    if (
      currentField &&
      ["destination", "duration", "budget"].includes(currentField)
    ) {
      inputRef.current?.focus()
    }
  }, [currentField, travelersStep])

  const handleTextSubmit = () => {
    const value = textInput.trim()
    if (!value || generating || complete) return

    if (currentField === "destination") {
      acknowledgeAndAdvance(value, (prev) => ({ ...prev, destination: value }))
    } else if (currentField === "duration") {
      acknowledgeAndAdvance(value, (prev) => ({ ...prev, duration: value }))
    } else if (currentField === "budget") {
      acknowledgeAndAdvance(value, (prev) => ({ ...prev, budget: value }))
    } else if (currentField === "travelers" && travelersStep === "count") {
      const count = Number(value)
      if (!count || count < 3) return
      acknowledgeAndAdvance(
        `${count} people`,
        (prev) => ({
          ...prev,
          travelers: { type: "group", count },
        }),
        "type"
      )
      setTravelersStep("type")
    }
  }

  const selectTravelStyle = (style: UserTravelStyle) => {
    if (generating || currentField !== "travelStyle") return
    acknowledgeAndAdvance(style, (prev) => ({ ...prev, travelStyle: style }))
  }

  const selectTravelerType = (type: TravelerType) => {
    if (generating || currentField !== "travelers") return

    if (type === "group") {
      appendMessages({
        id: createMessageId(),
        role: "user",
        content: "Group",
      })
      setTravelersStep("count")
      appendMessages({
        id: createMessageId(),
        role: "assistant",
        content: getQuestionForField("travelers", "count"),
      })
      return
    }

    const count = type === "solo" ? 1 : 2
    const label = type === "solo" ? "Solo (1)" : "Couple (2)"
    acknowledgeAndAdvance(label, (prev) => ({
      ...prev,
      travelers: { type, count },
    }))
    setTravelersStep("type")
  }

  const toggleInterest = (interest: TripInterest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const confirmInterests = () => {
    if (generating || currentField !== "interests" || selectedInterests.length === 0)
      return
    const label = selectedInterests.join(", ")
    acknowledgeAndAdvance(label, (prev) => ({
      ...prev,
      interests: [...selectedInterests],
    }))
  }

  const handleReset = () => {
    if (askTimeoutRef.current) {
      clearTimeout(askTimeoutRef.current)
      askTimeoutRef.current = null
    }
    intakeRef.current = INITIAL_TRIP_INTAKE
    setTripAnswers(INITIAL_TRIP_INTAKE)
    setMessages([
      {
        id: createMessageId(),
        role: "assistant",
        content: getWelcomeMessage(),
      },
    ])
    setTextInput("")
    setTravelersStep("type")
    setSelectedInterests([])
    onReset?.()
  }

  const showTextInput =
    currentField &&
    !complete &&
    (currentField === "destination" ||
      currentField === "duration" ||
      currentField === "budget" ||
      (currentField === "travelers" && travelersStep === "count"))

  const textPlaceholder = (() => {
    if (currentField === "destination") return "e.g. Tokyo, Japan"
    if (currentField === "duration") return "e.g. 5 days in April"
    if (currentField === "budget") return "e.g. $2,500 total"
    if (currentField === "travelers" && travelersStep === "count")
      return "e.g. 6"
    return "Type your answer…"
  })()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <Card className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border-primary/15 shadow-xl shadow-primary/5">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/[0.06] via-transparent to-violet-500/[0.04] py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Trip planning assistant</CardTitle>
              <CardDescription className="text-xs">
                Answer a few questions — I&apos;ll build your itinerary after
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-0">
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
            style={{ maxHeight: "min(52vh, 480px)" }}
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {generating && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Building your itinerary…
                  </span>
                </div>
              </div>
            )}
          </div>

          {!complete && !generating && (
            <div className="border-t border-border/60 bg-muted/20 p-4 sm:p-5">
              {currentField === "travelStyle" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Choose one
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => selectTravelStyle(style)}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentField === "travelers" && travelersStep === "type" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Select traveler type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { type: "solo" as const, label: "Solo" },
                        { type: "couple" as const, label: "Couple" },
                        { type: "group" as const, label: "Group" },
                      ] as const
                    ).map(({ type, label }) => (
                      <Button
                        key={type}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => selectTravelerType(type)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentField === "interests" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Select all that apply
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          selectedInterests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="rounded-full"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-xl"
                    disabled={selectedInterests.length === 0}
                    onClick={confirmInterests}
                  >
                    Continue with {selectedInterests.length || 0} selected
                  </Button>
                </div>
              )}

              {(currentField === "duration" || currentField === "budget") && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {(currentField === "duration"
                    ? DURATION_OPTIONS
                    : BUDGET_OPTIONS
                  ).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      onClick={() => {
                        if (currentField === "duration") {
                          acknowledgeAndAdvance(option, (prev) => ({
                            ...prev,
                            duration: option,
                          }))
                        } else {
                          acknowledgeAndAdvance(option, (prev) => ({
                            ...prev,
                            budget: option,
                          }))
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {showTextInput && (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleTextSubmit()
                  }}
                >
                  <Input
                    ref={inputRef}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={textPlaceholder}
                    className="h-11 rounded-xl bg-background"
                    disabled={generating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="size-11 shrink-0 rounded-xl"
                    disabled={!textInput.trim()}
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TripSummaryPanel
        data={tripAnswers}
        generating={generating}
        onGenerate={onGenerate}
        onReset={handleReset}
      />
    </div>
  )
}

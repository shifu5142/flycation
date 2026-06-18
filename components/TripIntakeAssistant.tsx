"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { useLocale, useTranslations } from "next-intl"
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
  getNextField,
  INITIAL_TRIP_INTAKE,
  INTERESTS,
  isIntakeComplete,
  TRAVEL_STYLES,
  type ChatMessage,
  type IntakeField,
  type TripIntakeData,
  type TripInterest,
  type TravelerType,
  type UserTravelStyle,
} from "@/lib/aiTripIntake"
import { isNonEnglishLocale } from "@/i18n/locales"
import { textNeedsEnglishTranslation } from "@/lib/tripAnswersEnglish"
import { cn } from "@/lib/utils"

type TravelersStep = "type" | "count"

type TripIntakeAssistantProps = {
  tripAnswers: TripIntakeData
  setTripAnswers: Dispatch<SetStateAction<TripIntakeData>>
  generating: boolean
  generateError?: boolean
  onGenerate: () => void
  onReset?: () => void
}

export type TripIntakeAssistantHandle = {
  startOver: () => void
}

function SummaryRow({
  label,
  value,
  icon: Icon,
  done,
  notSetYet,
}: {
  label: string
  value: string | null
  icon: typeof MapPin
  done: boolean
  notSetYet: string
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
          {value ?? notSetYet}
        </p>
      </div>
    </div>
  )
}

function TripSummaryPanel({
  data,
  generating,
  generateError,
  onGenerate,
  onReset,
}: {
  data: TripIntakeData
  generating: boolean
  generateError?: boolean
  onGenerate: () => void
  onReset: () => void
}) {
  const t = useTranslations("aiTripPlanner")
  const [generatingLabelIndex, setGeneratingLabelIndex] = useState(0)
  const [showAlmostReady, setShowAlmostReady] = useState(false)
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

  const displayDuration =
    data.duration &&
    (DURATION_OPTIONS as readonly string[]).includes(data.duration)
      ? t(`durationOptions.${data.duration}` as "durationOptions.3 days")
      : data.duration

  const displayBudget =
    data.budget && (BUDGET_OPTIONS as readonly string[]).includes(data.budget)
      ? t(`budgetOptions.${data.budget}` as "budgetOptions.$1,000")
      : data.budget

  const displayTravelStyle = data.travelStyle
    ? t(`travelStyles.${data.travelStyle}`)
    : null

  const displayTravelers = data.travelers
    ? data.travelers.type === "solo"
      ? t("formatTravelers.solo")
      : data.travelers.type === "couple"
        ? t("formatTravelers.couple")
        : t("formatTravelers.group", { count: data.travelers.count })
    : null

  const displayInterests =
    data.interests.length > 0
      ? data.interests.map((interest) => t(`interestOptions.${interest}`)).join(", ")
      : null

  useEffect(() => {
    if (!generating) {
      setGeneratingLabelIndex(0)
      setShowAlmostReady(false)
      return
    }

    const almostReadyTimer = setTimeout(() => setShowAlmostReady(true), 20000)

    const interval = setInterval(() => {
      setGeneratingLabelIndex((prev) => prev + 1)
    }, 6000)

    return () => {
      clearTimeout(almostReadyTimer)
      clearInterval(interval)
    }
  }, [generating])

  const generatingLabels = showAlmostReady
    ? [t("generating"), t("generatingSlow"), t("generatingAlmostReady")]
    : [t("generating"), t("generatingSlow")]

  return (
    <Card className="sticky top-4 rounded-2xl border-primary/15 shadow-lg shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{t("summaryTitle")}</CardTitle>
          <Badge variant="secondary" className="rounded-full text-xs">
            {progress}/6
          </Badge>
        </div>
        <CardDescription>{t("summaryDescription")}</CardDescription>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(progress / 6) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <SummaryRow
          label={t("destination")}
          value={data.destination}
          icon={MapPin}
          done={!!data.destination}
          notSetYet={t("notSetYet")}
        />
        <SummaryRow
          label={t("duration")}
          value={displayDuration}
          icon={CalendarDays}
          done={!!data.duration}
          notSetYet={t("notSetYet")}
        />
        <SummaryRow
          label={t("budget")}
          value={displayBudget}
          icon={Wallet}
          done={!!data.budget}
          notSetYet={t("notSetYet")}
        />
        <SummaryRow
          label={t("travelStyle")}
          value={displayTravelStyle}
          icon={Sparkles}
          done={!!data.travelStyle}
          notSetYet={t("notSetYet")}
        />
        <SummaryRow
          label={t("travelers")}
          value={displayTravelers}
          icon={Users}
          done={!!data.travelers}
          notSetYet={t("notSetYet")}
        />
        <SummaryRow
          label={t("interests")}
          value={displayInterests}
          icon={Heart}
          done={data.interests.length > 0}
          notSetYet={t("notSetYet")}
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
              {generatingLabels[generatingLabelIndex % generatingLabels.length]}
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              {t("generateTrip")}
            </>
          )}
        </Button>
        {generateError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive"
          >
            {t("tripGenerationFailed")}
          </div>
        )}
        {!complete && (
          <p className="text-center text-xs text-muted-foreground">
            {t("completeToEnable")}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={onReset}
          disabled={generating}
        >
          {t("startOver")}
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

export const TripIntakeAssistant = forwardRef<
  TripIntakeAssistantHandle,
  TripIntakeAssistantProps
>(function TripIntakeAssistant(
  {
    tripAnswers,
    setTripAnswers,
    generating,
    generateError,
    onGenerate,
    onReset,
  },
  ref
) {
  const t = useTranslations("aiTripPlanner")
  const locale = useLocale()

  const getQuestion = (
    field: IntakeField,
    travelersStep: TravelersStep = "type"
  ) => {
    if (field === "travelers" && travelersStep === "count") {
      return t("questions.travelersCount")
    }
    return t(`questions.${field}`)
  }

  const getCompletion = (data: TripIntakeData) =>
    t("completion", { destination: data.destination ?? "" })

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createMessageId(),
      role: "assistant",
      content: t("welcome"),
    },
  ])
  const [textInput, setTextInput] = useState("")
  const [translating, setTranslating] = useState(false)
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

  const translateToEnglish = async (text: string): Promise<string> => {
    if (!isNonEnglishLocale(locale) && !textNeedsEnglishTranslation(text)) {
      return text
    }

    try {
      const res = await fetch("/api/translate-trip-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale }),
      })
      if (!res.ok) return text
      const data = (await res.json()) as { text?: string }
      return data.text?.trim() || text
    } catch {
      return text
    }
  }

  const askNext = (data: TripIntakeData, step: TravelersStep = "type") => {
    if (!data) return
    const next = getNextField(data)
    if (!next) {
      appendMessages({
        id: createMessageId(),
        role: "assistant",
        content: getCompletion(data),
      })
      return
    }
    appendMessages({
      id: createMessageId(),
      role: "assistant",
      content: getQuestion(next, next === "travelers" ? step : "type"),
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
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ ...prev[0], content: t("welcome") }]
      }
      return prev
    })
  }, [locale, t])

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

  const handleTextSubmit = async () => {
    const value = textInput.trim()
    if (!value || generating || complete || translating) return

    if (currentField === "destination") {
      setTranslating(true)
      const englishValue = await translateToEnglish(value)
      setTranslating(false)
      acknowledgeAndAdvance(value, (prev) => ({
        ...prev,
        destination: englishValue,
      }))
    } else if (currentField === "duration") {
      setTranslating(true)
      const englishValue = await translateToEnglish(value)
      setTranslating(false)
      acknowledgeAndAdvance(value, (prev) => ({
        ...prev,
        duration: englishValue,
      }))
    } else if (currentField === "budget") {
      setTranslating(true)
      const englishValue = await translateToEnglish(value)
      setTranslating(false)
      acknowledgeAndAdvance(value, (prev) => ({
        ...prev,
        budget: englishValue,
      }))
    } else if (currentField === "travelers" && travelersStep === "count") {
      const count = Number(value)
      if (!count || count < 3) return
      acknowledgeAndAdvance(
        t("travelerTypes.groupPeople", { count }),
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
    acknowledgeAndAdvance(t(`travelStyles.${style}`), (prev) => ({
      ...prev,
      travelStyle: style,
    }))
  }

  const selectTravelerType = (type: TravelerType) => {
    if (generating || currentField !== "travelers") return

    if (type === "group") {
      appendMessages({
        id: createMessageId(),
        role: "user",
        content: t("travelerTypes.group"),
      })
      setTravelersStep("count")
      appendMessages({
        id: createMessageId(),
        role: "assistant",
        content: getQuestion("travelers", "count"),
      })
      return
    }

    const count = type === "solo" ? 1 : 2
    const label =
      type === "solo"
        ? t("travelerTypes.soloLabel")
        : t("travelerTypes.coupleLabel")
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
    const label = selectedInterests
      .map((interest) => t(`interestOptions.${interest}`))
      .join(", ")
    acknowledgeAndAdvance(label, (prev) => ({
      ...prev,
      interests: [...selectedInterests],
    }))
  }

  const handleReset = useCallback(() => {
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
        content: t("welcome"),
      },
    ])
    setTextInput("")
    setTravelersStep("type")
    setSelectedInterests([])
    onReset?.()
  }, [onReset, setTripAnswers, t])

  useImperativeHandle(ref, () => ({ startOver: handleReset }), [handleReset])

  const showTextInput =
    currentField &&
    !complete &&
    (currentField === "destination" ||
      currentField === "duration" ||
      currentField === "budget" ||
      (currentField === "travelers" && travelersStep === "count"))

  const textPlaceholder = (() => {
    if (currentField === "destination") return t("placeholders.destination")
    if (currentField === "duration") return t("placeholders.duration")
    if (currentField === "budget") return t("placeholders.budget")
    if (currentField === "travelers" && travelersStep === "count")
      return t("placeholders.travelersCount")
    return t("placeholders.default")
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
              <CardTitle className="text-base">{t("assistantTitle")}</CardTitle>
              <CardDescription className="text-xs">
                {t("assistantSubtitle")}
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
                    {t("buildingItinerary")}
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
                    {t("chooseOne")}
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
                        {t(`travelStyles.${style}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentField === "travelers" && travelersStep === "type" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("selectTravelerType")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { type: "solo" as const, labelKey: "solo" as const },
                        { type: "couple" as const, labelKey: "couple" as const },
                        { type: "group" as const, labelKey: "group" as const },
                      ] as const
                    ).map(({ type, labelKey }) => (
                      <Button
                        key={type}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => selectTravelerType(type)}
                      >
                        {t(`travelerTypes.${labelKey}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentField === "interests" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("selectAllApply")}
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
                        {t(`interestOptions.${interest}`)}
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-xl"
                    disabled={selectedInterests.length === 0}
                    onClick={confirmInterests}
                  >
                    {t("continueWith", { count: selectedInterests.length || 0 })}
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
                          acknowledgeAndAdvance(
                            t(`durationOptions.${option}` as "durationOptions.3 days"),
                            (prev) => ({
                              ...prev,
                              duration: option,
                            })
                          )
                        } else {
                          acknowledgeAndAdvance(
                            t(`budgetOptions.${option}` as "budgetOptions.$1,000"),
                            (prev) => ({
                              ...prev,
                              budget: option,
                            })
                          )
                        }
                      }}
                    >
                      {currentField === "duration"
                        ? t(`durationOptions.${option}` as "durationOptions.3 days")
                        : t(`budgetOptions.${option}` as "budgetOptions.$1,000")}
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
                    disabled={generating || translating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="size-11 shrink-0 rounded-xl"
                    disabled={!textInput.trim() || translating}
                  >
                    {translating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
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
        generateError={generateError}
        onGenerate={onGenerate}
        onReset={handleReset}
      />
    </div>
  )
})

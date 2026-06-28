"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
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
  planReady?: boolean
  onScrollToPlan?: () => void
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

function PlanReadyBubble({
  content,
  actionLabel,
  onScroll,
}: {
  content: string
  actionLabel: string
  onScroll: () => void
}) {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-3 gap-3 duration-500">
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/15 text-primary shadow-sm ring-1 ring-primary/20">
        <Bot className="size-4" />
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
      </div>
      <div className="max-w-[min(85%,28rem)] rounded-2xl rounded-tl-md border border-primary/20 bg-gradient-to-br from-card/95 to-primary/[0.04] px-4 py-3.5 shadow-md shadow-primary/10 backdrop-blur-sm">
        <p className="text-sm leading-relaxed">{content}</p>
        <button
          type="button"
          onClick={onScroll}
          className="group mt-3 flex w-full flex-col items-center gap-0.5 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 text-primary transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
        >
          <span className="text-xs font-semibold tracking-wide">
            {actionLabel}
          </span>
          <span className="relative flex h-7 flex-col items-center justify-start overflow-hidden">
            <ChevronDown className="size-5 animate-[chevron-flow_1.4s_ease-in-out_infinite]" />
            <ChevronDown className="-mt-3 size-5 text-primary/45 animate-[chevron-flow_1.4s_ease-in-out_infinite] [animation-delay:0.35s]" />
          </span>
        </button>
      </div>
    </div>
  )
}

function ChatBubble({
  message,
  onScrollToPlan,
  viewPlanLabel,
}: {
  message: ChatMessage
  onScrollToPlan?: () => void
  viewPlanLabel?: string
}) {
  if (message.kind === "planReady" && onScrollToPlan && viewPlanLabel) {
    return (
      <PlanReadyBubble
        content={message.content}
        actionLabel={viewPlanLabel}
        onScroll={onScrollToPlan}
      />
    )
  }

  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/15 text-primary shadow-sm ring-1 ring-primary/20">
          <Bot className="size-4" />
          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
        </div>
      )}
      <div
        className={cn(
          "group relative max-w-[min(85%,28rem)] px-4 py-3 text-sm leading-relaxed shadow-sm transition-shadow hover:shadow-md",
          isAssistant
            ? "rounded-2xl rounded-tl-md border border-border/50 bg-card/90 backdrop-blur-sm"
            : "rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20"
        )}
      >
        {!isAssistant && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl rounded-tr-md bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        )}
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={cn("relative", i > 0 && "mt-2")}>
            {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        ))}
      </div>
      {!isAssistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/60 text-muted-foreground ring-1 ring-border/60">
          <User className="size-4" />
        </div>
      )}
    </div>
  )
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 gap-3 duration-300">
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/15 text-primary ring-1 ring-primary/20">
        <Bot className="size-4" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-border/50 bg-card/90 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:0ms]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:150ms]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:300ms]" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
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
    planReady = false,
    onScrollToPlan,
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
  const [lastInputField, setLastInputField] = useState<IntakeField | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<TripInterest[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const askTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intakeRef = useRef<TripIntakeData>(tripAnswers)

  const currentField = getNextField(tripAnswers)
  const complete = isIntakeComplete(tripAnswers)
  const activeField = currentField ?? (complete ? lastInputField : null)
  const activeTravelersStep =
    currentField === "travelers" ? travelersStep : "type"
  const inputsLocked = complete || generating
  const showInputArea = Boolean(activeField) && (complete || !generating)
  const displayInterests = complete
    ? tripAnswers.interests
    : selectedInterests

  useEffect(() => {
    if (currentField) {
      setLastInputField(currentField)
    }
  }, [currentField])

  useEffect(() => {
    if (!planReady) {
      setMessages((prev) => prev.filter((m) => m.kind !== "planReady"))
      return
    }

    setMessages((prev) => {
      if (prev.some((m) => m.kind === "planReady")) return prev
      return [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content: t("planReadyMessage"),
          kind: "planReady",
        },
      ]
    })
  }, [planReady, t])

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
    setLastInputField(null)
    setSelectedInterests([])
    onReset?.()
  }, [onReset, setTripAnswers, t])

  useImperativeHandle(ref, () => ({ startOver: handleReset }), [handleReset])

  const showTextInput =
    activeField &&
    (activeField === "destination" ||
      activeField === "duration" ||
      activeField === "budget" ||
      (activeField === "travelers" && activeTravelersStep === "count"))

  const lockedComposerValue = (() => {
    if (!complete || !activeField) return textInput
    if (activeField === "destination") return tripAnswers.destination ?? ""
    if (activeField === "duration") {
      const d = tripAnswers.duration
      return d && (DURATION_OPTIONS as readonly string[]).includes(d)
        ? t(`durationOptions.${d}` as "durationOptions.3 days")
        : d ?? ""
    }
    if (activeField === "budget") {
      const b = tripAnswers.budget
      return b && (BUDGET_OPTIONS as readonly string[]).includes(b)
        ? t(`budgetOptions.${b}` as "budgetOptions.$1,000")
        : b ?? ""
    }
    if (activeField === "travelers" && tripAnswers.travelers?.type === "group") {
      return String(tripAnswers.travelers.count)
    }
    return textInput
  })()

  const textPlaceholder = (() => {
    if (activeField === "destination") return t("placeholders.destination")
    if (activeField === "duration") return t("placeholders.duration")
    if (activeField === "budget") return t("placeholders.budget")
    if (activeField === "travelers" && activeTravelersStep === "count")
      return t("placeholders.travelersCount")
    return t("placeholders.default")
  })()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <Card className="flex min-h-[560px] flex-col overflow-hidden rounded-3xl border-border/60 bg-card/50 shadow-xl shadow-primary/5 ring-1 ring-primary/10 backdrop-blur-sm">
        <CardHeader className="relative border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-background/80 to-violet-500/[0.06] px-5 py-4 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  {t("assistantTitle")}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {t("online")}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {t("assistantSubtitle")}
              </CardDescription>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground/75">
                {t("resultsTimingNote")}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-0">
          <div
            ref={scrollRef}
            className="relative flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-muted/25 via-background to-background px-4 py-6 sm:px-6"
            style={{ maxHeight: "min(56vh, 520px)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:24px_24px]"
              aria-hidden
            />
            <div className="relative space-y-5">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onScrollToPlan={onScrollToPlan}
                viewPlanLabel={t("viewYourPlan")}
              />
            ))}
            {generating && (
              <TypingIndicator label={t("buildingItinerary")} />
            )}
            </div>
          </div>

          {showInputArea && (
            <div
              className={cn(
                "border-t border-border/50 bg-gradient-to-t from-muted/40 to-background/95 p-4 backdrop-blur-sm transition-opacity sm:p-5",
                inputsLocked && "pointer-events-none opacity-45"
              )}
            >
              {activeField === "travelStyle" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {t("chooseOne")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={inputsLocked}
                        className="rounded-full border-border/70 bg-background/80 px-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                        onClick={() => selectTravelStyle(style)}
                      >
                        {t(`travelStyles.${style}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {activeField === "travelers" && activeTravelersStep === "type" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
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
                        disabled={inputsLocked}
                        className="rounded-full border-border/70 bg-background/80 px-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                        onClick={() => selectTravelerType(type)}
                      >
                        {t(`travelerTypes.${labelKey}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {activeField === "interests" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {t("selectAllApply")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          displayInterests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        disabled={inputsLocked}
                        className={cn(
                          "rounded-full px-4 transition-all",
                          displayInterests.includes(interest)
                            ? "shadow-md shadow-primary/20"
                            : "border-border/70 bg-background/80 shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                        )}
                        onClick={() => toggleInterest(interest)}
                      >
                        {t(`interestOptions.${interest}`)}
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-xl shadow-md shadow-primary/15"
                    disabled={inputsLocked || displayInterests.length === 0}
                    onClick={confirmInterests}
                  >
                    {t("continueWith", { count: displayInterests.length || 0 })}
                  </Button>
                </div>
              )}

              {(activeField === "duration" || activeField === "budget") && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {(activeField === "duration"
                    ? DURATION_OPTIONS
                    : BUDGET_OPTIONS
                  ).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={inputsLocked}
                      className="h-9 rounded-full border border-border/50 bg-background/90 px-4 text-xs shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md"
                      onClick={() => {
                        if (activeField === "duration") {
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
                      {activeField === "duration"
                        ? t(`durationOptions.${option}` as "durationOptions.3 days")
                        : t(`budgetOptions.${option}` as "budgetOptions.$1,000")}
                    </Button>
                  ))}
                </div>
              )}

              {showTextInput && (
                <form
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border border-border/60 bg-background/90 p-1.5 shadow-inner ring-primary/20 transition-all focus-within:border-primary/40 focus-within:ring-2",
                    inputsLocked && "focus-within:border-border/60 focus-within:ring-0"
                  )}
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleTextSubmit()
                  }}
                >
                  <Input
                    ref={inputRef}
                    value={lockedComposerValue}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={textPlaceholder}
                    className="h-11 flex-1 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                    disabled={inputsLocked || translating}
                    readOnly={complete}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="size-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/25 transition-all hover:shadow-lg disabled:opacity-50"
                    disabled={inputsLocked || !lockedComposerValue.trim() || translating}
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

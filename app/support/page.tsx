"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Bug,
  CalendarX,
  ChevronDown,
  Clock,
  CreditCard,
  Gift,
  HelpCircle,
  LifeBuoy,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Receipt,
  RotateCcw,
  Send,
  Sparkles,
  Ticket,
  User,
  type LucideIcon,
} from "lucide-react"

import { useAuth } from "@/components/AuthProvider"
import { DashboardShell } from "@/components/Sidebar"
import { useToast } from "@/components/ToastProvider"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"

const SUPPORT_EMAIL = "support@flycation.com"

const SUBJECT_OPTION_KEYS = [
  "bookingIssue",
  "cancelChange",
  "refund",
  "paymentBilling",
  "aiPlanner",
  "accountLogin",
  "receiptInvoice",
  "loyaltyRewards",
  "technicalIssue",
  "feedback",
  "other",
] as const

type SubjectOptionKey = (typeof SUBJECT_OPTION_KEYS)[number]

const SUBJECT_ICONS: Record<SubjectOptionKey, LucideIcon> = {
  bookingIssue: Ticket,
  cancelChange: CalendarX,
  refund: RotateCcw,
  paymentBilling: CreditCard,
  aiPlanner: Sparkles,
  accountLogin: User,
  receiptInvoice: Receipt,
  loyaltyRewards: Gift,
  technicalIssue: Bug,
  feedback: MessageSquare,
  other: MoreHorizontal,
}

const SUBJECT_GROUPS: {
  labelKey:
    | "subjectGroups.bookings"
    | "subjectGroups.accountBilling"
    | "subjectGroups.product"
    | "subjectGroups.other"
  keys: SubjectOptionKey[]
}[] = [
  {
    labelKey: "subjectGroups.bookings",
    keys: ["bookingIssue", "cancelChange", "refund", "receiptInvoice"],
  },
  {
    labelKey: "subjectGroups.accountBilling",
    keys: ["paymentBilling", "accountLogin", "loyaltyRewards"],
  },
  {
    labelKey: "subjectGroups.product",
    keys: ["aiPlanner", "technicalIssue", "feedback"],
  },
  { labelKey: "subjectGroups.other", keys: ["other"] },
]

type FormFields = {
  name: string
  email: string
  subject: SubjectOptionKey | ""
  message: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const EMPTY_FORM: FormFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300",
        isOpen && "border-primary/25 shadow-md shadow-primary/5"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/40 sm:px-5"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium sm:text-base">{question}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactOptionCard({
  icon: Icon,
  title,
  description,
  action,
  badge,
  onClick,
  href,
}: {
  icon: typeof Mail
  title: string
  description: string
  action: string
  badge?: string
  onClick?: () => void
  href?: string
}) {
  const content = (
    <Card className="group h-full rounded-2xl border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
            <Icon className="size-5" />
          </div>
          {badge && (
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {badge}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
          {action}
        </span>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className="h-full w-full text-left">
      {content}
    </button>
  )
}

function SubmitLoadingButton({
  submitting,
  sendingLabel,
  sendLabel,
}: {
  submitting: boolean
  sendingLabel: string
  sendLabel: string
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={submitting}
      aria-busy={submitting}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl shadow-md shadow-primary/20 transition-all sm:min-w-[11.5rem] sm:w-auto",
        submitting && "pointer-events-none opacity-95"
      )}
    >
      {submitting && (
        <>
          <span
            className="absolute inset-0 animate-[submit-pulse_1.6s_ease-in-out_infinite] bg-primary-foreground/10"
            aria-hidden
          />
          <span
            className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
            aria-hidden
          />
        </>
      )}
      <span className="relative flex items-center justify-center gap-2.5">
        {submitting ? (
          <>
            <span className="relative flex size-5 items-center justify-center">
              <span
                className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/25"
                aria-hidden
              />
              <Loader2 className="relative size-4 animate-spin" />
            </span>
            <span>{sendingLabel}</span>
            <span className="inline-flex items-end gap-0.5 pb-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1 animate-bounce rounded-full bg-primary-foreground/90"
                  style={{ animationDelay: `${i * 140}ms` }}
                />
              ))}
            </span>
          </>
        ) : (
          <>
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
            {sendLabel}
          </>
        )}
      </span>
    </Button>
  )
}

export default function SupportPage() {
  const t = useTranslations("support")
  const { toast } = useToast()
  const { displayName, email: userEmail, loading: authLoading } = useAuth()

  const [form, setForm] = useState<FormFields>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqItems = useMemo(
    () => [
      {
        question: t("faq.cancelBooking.question"),
        answer: t("faq.cancelBooking.answer"),
      },
      {
        question: t("faq.downloadReceipt.question"),
        answer: t("faq.downloadReceipt.answer"),
      },
      {
        question: t("faq.aiPlanner.question"),
        answer: t("faq.aiPlanner.answer"),
      },
      {
        question: t("faq.refunds.question"),
        answer: t("faq.refunds.answer"),
      },
    ],
    [t]
  )

  useEffect(() => {
    if (authLoading) return
    setForm((prev) => ({
      ...prev,
      name: prev.name || displayName || "",
      email: prev.email || userEmail || "",
    }))
  }, [authLoading, displayName, userEmail])

  const validate = (values: FormFields): FormErrors => {
    const next: FormErrors = {}

    if (!values.name.trim()) {
      next.name = t("errors.nameRequired")
    } else if (values.name.trim().length < 2) {
      next.name = t("errors.nameMin")
    }

    if (!values.email.trim()) {
      next.email = t("errors.emailRequired")
    } else if (!isValidEmail(values.email.trim())) {
      next.email = t("errors.emailInvalid")
    }

    if (!values.subject) {
      next.subject = t("errors.subjectRequired")
    }

    if (!values.message.trim()) {
      next.message = t("errors.messageRequired")
    } else if (values.message.trim().length < 10) {
      next.message = t("errors.messageMin")
    }

    return next
  }

  const handleChange =
    (field: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setSubmitted(false)
    }

  const handleSubjectChange = (value: SubjectOptionKey) => {
    setForm((prev) => ({ ...prev, subject: value }))
    setErrors((prev) => ({ ...prev, subject: undefined }))
    setSubmitted(false)
  }

  const scrollToFaq = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitted(false)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast(t("errors.notLoggedIn"), "info")
        return
      }

      const { error } = await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          name: form.name,
          email: form.email,
          subject: t(`subjectOptions.${form.subject}`),
          message: form.message,
        })
        .select()
        .single()

      if (error) {
        toast(error.message, "info")
        return
      }

      toast(t("messageSent"), "success")
      setSubmitted(true)
      setForm(EMPTY_FORM)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-10 sm:space-y-12">
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <Badge variant="secondary" className="rounded-full">
              <LifeBuoy className="size-3" />
              {t("badge")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground sm:text-lg">{t("subtitle")}</p>
          </div>
          <Sparkles className="pointer-events-none absolute -right-2 -bottom-2 size-32 text-primary/10" />
        </section>

        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("contactOptions")}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ContactOptionCard
              icon={Mail}
              title={t("emailTitle")}
              description={t("emailDescription")}
              action={SUPPORT_EMAIL}
              href={`mailto:${SUPPORT_EMAIL}`}
            />
            <ContactOptionCard
              icon={MessageCircle}
              title={t("liveChatTitle")}
              description={t("liveChatDescription")}
              action={t("liveChatBadge")}
              badge={t("liveChatBadge")}
              onClick={() => toast(t("liveChatToast"), "info")}
            />
            <ContactOptionCard
              icon={HelpCircle}
              title={t("faqTitle")}
              description={t("faqDescription")}
              action={t("browseFaq")}
              onClick={scrollToFaq}
            />
            <ContactOptionCard
              icon={Clock}
              title={t("responseTitle")}
              description={t("responseDescription")}
              action={t("responseNote")}
            />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Card className="rounded-3xl border-border/60 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">{t("contactForm")}</CardTitle>
              <CardDescription>{t("contactFormDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="support-name">{t("name")}</Label>
                    <Input
                      id="support-name"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder={t("namePlaceholder")}
                      aria-invalid={Boolean(errors.name)}
                      className={cn(errors.name && "border-destructive focus-visible:ring-destructive/30")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">{t("email")}</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder={t("emailPlaceholder")}
                      aria-invalid={Boolean(errors.email)}
                      className={cn(errors.email && "border-destructive focus-visible:ring-destructive/30")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-subject">{t("subject")}</Label>
                  <Select
                    value={form.subject || undefined}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger
                      id="support-subject"
                      aria-invalid={Boolean(errors.subject)}
                      className={cn(
                        "h-11 bg-background/90",
                        errors.subject &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    >
                      <SelectValue placeholder={t("subjectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECT_GROUPS.map((group, groupIndex) => (
                        <SelectGroup key={group.labelKey}>
                          <SelectLabel>{t(group.labelKey)}</SelectLabel>
                          {group.keys.map((key) => {
                            const Icon = SUBJECT_ICONS[key]
                            return (
                              <SelectItem key={key} value={key}>
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <Icon className="size-3.5" />
                                </span>
                                <SelectItemText>
                                  {t(`subjectOptions.${key}`)}
                                </SelectItemText>
                              </SelectItem>
                            )
                          })}
                          {groupIndex < SUBJECT_GROUPS.length - 1 && (
                            <SelectSeparator />
                          )}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-message">{t("message")}</Label>
                  <Textarea
                    id="support-message"
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder={t("messagePlaceholder")}
                    aria-invalid={Boolean(errors.message)}
                    className={cn(
                      "min-h-[140px] resize-y",
                      errors.message && "border-destructive focus-visible:ring-destructive/30"
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <SubmitLoadingButton
                  submitting={submitting}
                  sendingLabel={t("sending")}
                  sendLabel={t("sendMessage")}
                />

                {submitted && (
                  <div
                    role="status"
                    className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
                  >
                    {t("messageSent")}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <section id="faq" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {t("faqSection")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("faqSectionDescription")}
              </p>
            </div>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFaq === index}
                  onToggle={() =>
                    setOpenFaq((prev) => (prev === index ? null : index))
                  }
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

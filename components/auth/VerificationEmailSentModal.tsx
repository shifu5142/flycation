"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight, Check, Loader2, RefreshCw } from "lucide-react"

import { supabase } from "@/app/services/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VerificationEmailSentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onContinue: () => void
}

function VerificationEmailSentModal({
  open,
  onOpenChange,
  email,
  onContinue,
}: VerificationEmailSentModalProps) {
  const t = useTranslations("auth")
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  )

  const handleResend = async () => {
    if (!email.trim()) return

    setResending(true)
    setResendStatus("idle")

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      })
      if (error) throw error
      setResendStatus("success")
    } catch {
      setResendStatus("error")
    } finally {
      setResending(false)
    }
  }

  const handleContinue = () => {
    onOpenChange(false)
    onContinue()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        className={cn(
          "max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-2xl",
          "duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2",
          "sm:max-w-md"
        )}
      >
        <div className="px-6 pt-8 pb-6 text-center sm:px-8 sm:pt-10 sm:pb-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/25 sm:size-[4.5rem]">
            <Check className="size-8 stroke-[2.5] text-white sm:size-9" />
          </div>

          <DialogTitle className="mt-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {t("verificationEmailSentTitle")}
          </DialogTitle>

          <DialogDescription className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {t("verificationEmailSentSubtitle")}
          </DialogDescription>

          <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground/80">
            {t("verificationEmailSpamNote")}
          </p>

          <div className="mt-8 space-y-3">
            <Button
              type="button"
              size="lg"
              onClick={handleContinue}
              className={cn(
                "group h-12 w-full rounded-xl border-0 text-sm font-semibold text-white",
                "bg-gradient-to-r from-blue-600 to-blue-500",
                "shadow-md shadow-blue-500/20 transition-all duration-200",
                "hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/30",
                "active:scale-[0.98]"
              )}
            >
              {t("continueToLogin")}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleResend}
              disabled={resending}
              className="h-11 w-full rounded-xl border-border/80 bg-white text-sm font-medium transition-colors hover:bg-muted/40"
            >
              {resending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("resendingEmail")}
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" />
                  {t("resendEmail")}
                </>
              )}
            </Button>

            {resendStatus === "success" && (
              <p className="text-xs font-medium text-emerald-600">
                {t("resendEmailSuccess")}
              </p>
            )}
            {resendStatus === "error" && (
              <p className="text-xs font-medium text-destructive">
                {t("resendEmailFailed")}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { VerificationEmailSentModal }

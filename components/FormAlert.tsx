import { AlertCircle, CheckCircle2, X } from "lucide-react"

import { cn } from "@/lib/utils"

type FormAlertProps = {
  type: "success" | "error"
  message: string
  onDismiss?: () => void
}

export function FormAlert({ type, message, onDismiss }: FormAlertProps) {
  const isSuccess = type === "success"

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
        isSuccess
          ? "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/60 dark:text-green-100"
          : "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100"
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
      )}
      <p className="flex-1 font-medium leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss message"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

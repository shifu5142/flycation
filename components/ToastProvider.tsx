"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "success" | "info"
type ToastItem = { id: number; message: string; variant: ToastVariant }

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-lg",
              "animate-in slide-in-from-bottom-4 fade-in",
            )}
          >
            {t.variant === "success" ? (
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
            ) : (
              <Info className="size-5 shrink-0 text-muted-foreground" />
            )}
            <span className="flex-1 text-card-foreground">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return ctx
}

export { ToastProvider, useToast }

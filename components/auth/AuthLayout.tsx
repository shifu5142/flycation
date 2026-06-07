import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Map,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

const perks = [
  { icon: Sparkles, text: "AI-powered trip planning" },
  { icon: Map, text: "Smart day-by-day itineraries" },
  { icon: ShieldCheck, text: "Secure account & saved trips" },
]

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      {/* Decorative panel */}
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/airplane-view.jpg"
          alt="Aerial view from airplane window over tropical islands"
          fill
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white/55 px-3 py-1.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>

        <div className="relative z-10 space-y-8 p-10 pb-14">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/35 backdrop-blur-sm">
              <Plane className="size-4 text-white" />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">Flycation</p>
              <p className="text-sm font-medium text-white/85">Your AI travel companion</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 font-medium text-white/95">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
                  <Icon className="size-3" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form side */}
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center bg-background px-4 py-10",
          className
        )}
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        {children}
      </div>
    </div>
  )
}

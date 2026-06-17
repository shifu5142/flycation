import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

type GuestConversionBannerProps = {
  variant?: "default" | "planner"
}

function GuestConversionBanner({ variant = "default" }: GuestConversionBannerProps) {
  const isPlanner = variant === "planner"

  return (
    <section className="border-t border-border/60 bg-muted/30 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          {isPlanner
            ? "Create a free account to unlock the full AI planner"
            : "Sign up to save your trips and unlock every feature"}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-lg">
            <Link href="/register">
              Create free account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export { GuestConversionBanner }

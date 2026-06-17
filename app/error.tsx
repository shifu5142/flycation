"use client"

import Link from "next/link"
import { useEffect } from "react"
import {
  AlertTriangle,
  Compass,
  Home,
  Plane,
  RefreshCw,
  Route,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-destructive/8 via-background to-background" />

      <Compass className="pointer-events-none absolute top-[18%] left-[12%] size-10 text-primary/20 sm:size-14" />
      <Plane className="pointer-events-none absolute top-[22%] right-[14%] size-8 -rotate-12 text-primary/25 sm:size-11" />
      <AlertTriangle className="pointer-events-none absolute bottom-[28%] left-[18%] size-7 text-destructive/20 sm:size-10" />
      <Route className="pointer-events-none absolute right-[10%] bottom-[22%] size-12 text-primary/10 sm:size-16" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-4 text-8xl font-bold tracking-tighter text-destructive/15 sm:text-9xl">
          Oops
        </p>

        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 sm:size-20">
          <AlertTriangle className="size-8 text-destructive sm:size-10" />
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Something went off course
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-muted-foreground">
          We hit unexpected turbulence while loading this page. Head back home or
          try again in a moment.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
            <Link href="/">
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full rounded-xl sm:w-auto"
            onClick={reset}
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>

      <Link
        href="/"
        className="relative mt-16 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plane className="size-4 text-primary" />
        Flycation
      </Link>
    </div>
  )
}

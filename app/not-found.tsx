import Link from "next/link"
import {
  Compass,
  Home,
  LayoutDashboard,
  MapPin,
  Plane,
  Route,
} from "lucide-react"

import { Button } from "@/components/ui/button"

function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />

      {/* Decorative icons */}
      <Compass className="pointer-events-none absolute top-[18%] left-[12%] size-10 text-primary/20 sm:size-14" />
      <Plane className="pointer-events-none absolute top-[22%] right-[14%] size-8 -rotate-12 text-primary/25 sm:size-11" />
      <MapPin className="pointer-events-none absolute bottom-[28%] left-[18%] size-7 text-primary/15 sm:size-10" />
      <Route className="pointer-events-none absolute right-[10%] bottom-[22%] size-12 text-primary/10 sm:size-16" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-4 text-8xl font-bold tracking-tighter text-primary/20 sm:text-9xl">
          404
        </p>

        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 sm:size-20">
          <MapPin className="size-8 text-primary sm:size-10" />
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          This destination isn&apos;t on the map
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-muted-foreground">
          The page you&apos;re looking for took a wrong turn. Let&apos;s get you
          back on course.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
            <Link href="/">
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-xl sm:w-auto"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Go to dashboard
            </Link>
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

export default NotFound

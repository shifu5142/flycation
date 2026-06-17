import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

import { GuestLayout } from "@/components/GuestLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const plans = [
  {
    name: "Guest",
    price: "Free",
    description: "Preview trips without an account",
    features: [
      "Browse example itineraries",
      "Guest planning preview",
      "Read-only trip samples",
    ],
    cta: "Try preview",
    href: "/start",
    highlighted: false,
  },
  {
    name: "Free account",
    price: "Free",
    description: "Everything you need to plan smarter",
    features: [
      "Full AI trip planner",
      "Save and manage trips",
      "Dashboard & bookings",
      "Personalized itineraries",
    ],
    cta: "Get started",
    href: "/register",
    highlighted: true,
  },
]

function PricingPage() {
  return (
    <GuestLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>

        <div className="text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">
            Pricing
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Simple, transparent</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Start as a guest with previews, then create a free account when
            you&apos;re ready for the full AI planner.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`rounded-2xl border-border/60 ${
                plan.highlighted ? "border-primary shadow-lg shadow-primary/10" : ""
              }`}
            >
              <CardHeader>
                {plan.highlighted && (
                  <Badge className="w-fit rounded-full">Recommended</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2 text-3xl font-bold">{plan.price}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full rounded-lg"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GuestLayout>
  )
}

export default PricingPage

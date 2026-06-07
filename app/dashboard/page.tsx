"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Sparkles } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { TripCard } from "@/components/TripCard"
import { useToast } from "@/components/ToastProvider"
import { mockTrips } from "@/lib/mockTrips"
import { mockUser } from "@/lib/mockUser"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreateTrip = () => {
    setLoading(true)
    setDialogOpen(false)
    setTimeout(() => {
      setLoading(false)
      toast("New Flycation created!")
    }, 2000)
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome card */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back, {mockUser.name.split(" ")[0]}! 👋
            </CardTitle>
            <CardDescription className="text-blue-100">
              You have {mockTrips.length} trips planned. Ready for your next adventure?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg">
                  <Plus className="size-4" />
                  Create new Flycation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new Flycation</DialogTitle>
                  <DialogDescription>
                    Tell us where you want to go and AI will plan everything for you.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleCreateTrip}>
                    <Sparkles className="size-4" />
                    Generate with AI
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Use trip planner</Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Trips list */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Trips</h2>
              <p className="text-sm text-muted-foreground">
                Your planned adventures
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : mockTrips.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent>
                <Sparkles className="mx-auto size-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No trips yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first Flycation to get started
                </p>
                <Button className="mt-6" onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4" />
                  Create new Flycation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

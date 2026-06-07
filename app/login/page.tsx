"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Lock,
  LogIn,
  Mail,
  UserPlus,
} from "lucide-react"
import { loginUser } from "@/lib/auth"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { IconInput } from "@/components/auth/IconInput"
import { FormAlert } from "@/components/FormAlert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type FormStatus = {
  type: "success" | "error"
  message: string
} | null

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<FormStatus>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!email.trim()) {
      setStatus({ type: "error", message: "Email is required" })
      return
    }
    if (!password) {
      setStatus({ type: "error", message: "Password is required" })
      return
    }

    setLoading(true)
    try {
      await loginUser(email, password)
      setStatus({ type: "success", message: "Welcome back! Redirecting to dashboard…" })
      setTimeout(() => router.push("/dashboard"), 1200)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password"
      setStatus({ type: "error", message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/10">
            <LogIn className="size-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="mt-1.5">
              Sign in to continue planning your adventures
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <IconInput
              id="email"
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus(null)
              }}
              autoComplete="email"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <Lock className="size-3.5 text-primary" />
                  Password
                </span>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setStatus(null)
                  }}
                  autoComplete="current-password"
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            {status && (
              <FormAlert
                type={status.type}
                message={status.message}
                onDismiss={() => setStatus(null)}
              />
            )}

            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Log in
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              New to Flycation?
            </span>
          </div>
          <Button variant="outline" asChild className="w-full rounded-xl">
            <Link href="/register">
              <UserPlus className="size-4" />
              Create an account
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

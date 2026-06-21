"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { supabase } from "@/app/services/supabase/client"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { IconInput } from "@/components/auth/IconInput"
import { VerificationEmailSentModal } from "@/components/auth/VerificationEmailSentModal"
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
  type: "error"
  message: string
} | null

function RegisterPage() {
  const router = useRouter()
  const t = useTranslations("auth")
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<FormStatus>(null)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!form.first_name.trim()) {
      setStatus({ type: "error", message: t("firstNameRequired") })
      return
    }
    if (!form.last_name.trim()) {
      setStatus({ type: "error", message: t("lastNameRequired") })
      return
    }
    if (!form.email.trim()) {
      setStatus({ type: "error", message: t("emailRequired") })
      return
    }
    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: t("passwordsMismatch") })
      return
    }
    if (form.password.length < 6) {
      setStatus({ type: "error", message: t("passwordMinLength") })
      return
    }

    setLoading(true)
    try {
      const {data, error} = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.first_name,
            last_name: form.last_name,
          },
        },
      })
      if (error) {
        throw error
      }
      if (data.user) {
        setRegisteredEmail(form.email.trim())
        setVerificationOpen(true)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account"
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
            <UserPlus className="size-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t("createAccountTitle")}</CardTitle>
            <CardDescription className="mt-1.5">
              {t("registerSubtitle")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <IconInput
                id="first_name"
                name="first_name"
                label={t("firstName")}
                icon={User}
                placeholder="Alex"
                value={form.first_name}
                onChange={handleChange}
                autoComplete="given-name"
              />
              <IconInput
                id="last_name"
                name="last_name"
                label={t("lastName")}
                icon={User}
                placeholder="Morgan"
                value={form.last_name}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>

            <IconInput
              id="email"
              name="email"
              label={t("email")}
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium">
                <Lock className="size-3.5 text-primary" />
                {t("password")}
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1.5 text-sm font-medium">
                <Lock className="size-3.5 text-primary" />
                {t("confirmPassword")}
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            {status?.type === "error" && (
              <FormAlert
                type="error"
                message={status.message}
                onDismiss={() => setStatus(null)}
              />
            )}

            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("creatingAccount")}
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  {t("register")}
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              {t("alreadyHaveAccount")}
            </span>
          </div>
          <Button variant="outline" asChild className="w-full rounded-xl">
            <Link href="/login">
              <LogIn className="size-4" />
              {t("logIn")}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <VerificationEmailSentModal
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        email={registeredEmail}
        onContinue={() => router.push("/login")}
      />
    </AuthLayout>
  )
}

export default RegisterPage

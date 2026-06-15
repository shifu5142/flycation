"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plane } from "lucide-react"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handle = async () => {
      const supabase = createClient()
      const params = new URLSearchParams(window.location.search)

      const errorDescription = params.get("error_description")
      const oauthError = params.get("error")

      if (errorDescription || oauthError) {
        console.error("[auth/callback] OAuth error:", {
          error: oauthError,
          error_description: errorDescription,
        })
        router.replace(
          `/login?error=${encodeURIComponent(errorDescription ?? oauthError ?? "OAuth sign-in failed")}`
        )
        return
      }

      const code = params.get("code")
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace(`/login?error=${encodeURIComponent(error.message)}`)
          return
        }
      }

      const { data, error } = await supabase.auth.getSession()
      console.log("getSession result:", data, error);
      console.error("[auth/callback] getSession:", {
        hasSession: Boolean(data.session),
        userId: data.session?.user?.id ?? null,
        error: error?.message ?? null,
      })

      if (data.session?.user) {
        router.replace("/dashboard")
        router.refresh()
        return
      }

      router.replace("/login")
    }

    handle()
  }, [router])

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/10">
            <Plane className="size-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Signing you in</CardTitle>
            <CardDescription className="mt-1.5">
              Please wait while we finish logging you in
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-3 pb-8">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Logging you in…</p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default CallbackPage

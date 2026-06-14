"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plane } from "lucide-react"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { supabase } from "@/app/services/supabase/client"
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
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    checkSession()
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

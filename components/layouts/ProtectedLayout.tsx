import { checkSession } from "@/lib/supabase/server"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkSession()

  return <>{children}</>
}

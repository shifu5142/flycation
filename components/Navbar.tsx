"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Menu, X } from "lucide-react"

import { AppLogo } from "@/components/AppLogo"

import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Navbar() {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: t("features"), href: "/#features" as const },
    { label: t("trips"), href: "/examples" as const },
    { label: t("about"), href: "/about" as const },
    { label: t("pricing"), href: "/pricing" as const },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AppLogo />
          <span className="text-lg tracking-tight">{tCommon("appName")}</span>
        </Link>

        <div className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center justify-end gap-1 md:flex">
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/login">{t("signIn")}</Link>
          </Button>
          <Button asChild className="rounded-lg">
            <Link href="/register">{t("getStarted")}</Link>
          </Button>
        </div>

        <div className="col-start-3 flex items-center justify-end gap-1 justify-self-end md:hidden">
          <LanguageSwitcher />
          <button
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("toggleMenu")}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
          "transition-all duration-300"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>
                {t("signIn")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register" onClick={() => setOpen(false)}>
                {t("getStarted")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Navbar }

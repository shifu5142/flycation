"use client"

import { useTranslations } from "next-intl"
import { Plane } from "lucide-react"

import { Link } from "@/i18n/navigation"

function Footer() {
  const t = useTranslations("footer")
  const tCommon = useTranslations("common")

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("features"), href: "/#features" as const },
        { label: t("exampleTrips"), href: "/examples" as const },
        { label: t("pricing"), href: "/pricing" as const },
        { label: t("startPlanning"), href: "/start" as const },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/about" as const },
        { label: t("careers"), href: "/about" as const },
        { label: t("blog"), href: "/about" as const },
        { label: t("press"), href: "/about" as const },
      ],
    },
    {
      title: t("support"),
      links: [
        { label: t("helpCenter"), href: "/about" as const },
        { label: t("contact"), href: "/about" as const },
        { label: t("privacy"), href: "/about" as const },
        { label: t("terms"), href: "/about" as const },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="size-4" />
              </span>
              <span className="text-lg tracking-tight">{tCommon("appName")}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {tCommon("appName")}. {t("rights")}
          </p>
          <p>{t("madeBy")}</p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }

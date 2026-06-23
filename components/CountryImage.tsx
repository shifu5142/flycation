"use client"

import { useEffect, useMemo, useState } from "react"

import { AppImage } from "@/components/AppImage"
import { getStaticCountryImagePath } from "@/lib/countryStaticImages"
import { cn } from "@/lib/utils"

type CountryImageProps = {
  country: string
  src?: string
  alt?: string
  className?: string
  wrapperClassName?: string
  fill?: boolean
}

function CountryImage({
  country,
  src,
  alt = "",
  className,
  wrapperClassName,
  fill = false,
}: CountryImageProps) {
  const staticFallback = useMemo(
    () => getStaticCountryImagePath(country),
    [country]
  )
  const primarySrc = src?.trim() ?? ""
  const [resolvedSrc, setResolvedSrc] = useState(
    () => primarySrc || staticFallback
  )
  const [usingFallback, setUsingFallback] = useState(() => !primarySrc)

  useEffect(() => {
    const nextPrimary = src?.trim() ?? ""
    setUsingFallback(!nextPrimary)
    setResolvedSrc(nextPrimary || staticFallback)
  }, [country, src, staticFallback])

  const handleError = () => {
    if (usingFallback) return
    setUsingFallback(true)
    setResolvedSrc(staticFallback)
  }

  return (
    <AppImage
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      className={cn("size-full object-cover", className)}
      wrapperClassName={wrapperClassName}
      onError={handleError}
    />
  )
}

export { CountryImage }

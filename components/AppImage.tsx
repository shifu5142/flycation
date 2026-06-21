"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type AppImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onLoad" | "onError"
> & {
  wrapperClassName?: string
  skeletonClassName?: string
  fill?: boolean
  onLoad?: React.ReactEventHandler<HTMLImageElement>
  onError?: React.ReactEventHandler<HTMLImageElement>
}

function ImageShimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn("image-skeleton absolute inset-0 z-[1]", className)}
      aria-hidden
    >
      <span className="sr-only">Loading image…</span>
    </div>
  )
}

function AppImage({
  src,
  alt = "",
  className,
  wrapperClassName,
  skeletonClassName,
  fill = false,
  onLoad,
  onError,
  ...props
}: AppImageProps) {
  const imageSrc = src != null && src !== "" ? String(src) : ""
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const markFullyLoaded = () => setLoaded(true)

  useLayoutEffect(() => {
    if (!imageSrc) {
      setLoaded(true)
      return
    }

    setLoaded(false)

    const img = imgRef.current
    if (!img?.complete || img.naturalWidth === 0) return

    if (typeof img.decode === "function") {
      img.decode().then(markFullyLoaded).catch(markFullyLoaded)
      return
    }

    markFullyLoaded()
  }, [imageSrc])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget

    const markLoaded = () => {
      setLoaded(true)
      onLoad?.(event)
    }

    if (typeof img.decode === "function") {
      img.decode().then(markLoaded).catch(markLoaded)
      return
    }

    markLoaded()
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true)
    onError?.(event)
  }

  return (
    <div
      className={cn(
        fill ? "absolute inset-0 overflow-hidden" : "relative h-full w-full min-h-0 overflow-hidden",
        wrapperClassName
      )}
    >
      {!loaded && <ImageShimmer className={skeletonClassName} />}
      {imageSrc ? (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            fill && "absolute inset-0 size-full",
            !fill && "relative w-full",
            "z-[2]",
            loaded ? "opacity-100" : "pointer-events-none opacity-0",
            className
          )}
          {...props}
        />
      ) : null}
    </div>
  )
}

export { AppImage }

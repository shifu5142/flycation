"use client"

import { useCallback, useEffect, useState } from "react"

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

  const markLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleImgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (!imageSrc) {
        setLoaded(true)
        return
      }

      if (!node) {
        setLoaded(false)
        return
      }

      if (node.complete && node.naturalWidth > 0) {
        if (typeof node.decode === "function") {
          void node.decode().then(markLoaded).catch(markLoaded)
        } else {
          markLoaded()
        }
        return
      }

      setLoaded(false)
    },
    [imageSrc, markLoaded]
  )

  useEffect(() => {
    if (!imageSrc) {
      setLoaded(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setLoaded((current) => current || true)
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [imageSrc])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    markLoaded()
    onLoad?.(event)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    markLoaded()
    onError?.(event)
  }

  return (
    <div
      className={cn(
        fill ? "absolute inset-0 overflow-hidden" : "relative h-full w-full min-h-0 overflow-hidden",
        wrapperClassName
      )}
    >
      {!loaded && imageSrc && <ImageShimmer className={skeletonClassName} />}
      {imageSrc ? (
        <img
          ref={handleImgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            fill && "absolute inset-0 size-full",
            !fill && "relative h-full w-full",
            "z-[2]",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      ) : null}
    </div>
  )
}

export { AppImage }

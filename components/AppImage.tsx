"use client"

import { useEffect, useState } from "react"

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
      className={cn(
        "image-skeleton absolute inset-0 scale-105 bg-muted blur-md",
        className
      )}
      aria-hidden
    />
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

  useEffect(() => {
    if (!imageSrc) {
      setLoaded(true)
      return
    }

    setLoaded(false)

    const img = new window.Image()
    img.src = imageSrc

    if (img.complete) {
      setLoaded(true)
      return
    }

    const handleComplete = () => setLoaded(true)
    img.addEventListener("load", handleComplete)
    img.addEventListener("error", handleComplete)

    return () => {
      img.removeEventListener("load", handleComplete)
      img.removeEventListener("error", handleComplete)
    }
  }, [imageSrc])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true)
    onLoad?.(event)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true)
    onError?.(event)
  }

  return (
    <div
      className={cn(
        fill ? "absolute inset-0" : "relative h-full w-full min-h-0",
        wrapperClassName
      )}
    >
      {!loaded && <ImageShimmer className={skeletonClassName} />}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            fill && "absolute inset-0 size-full",
            "transition-opacity duration-500 ease-out",
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

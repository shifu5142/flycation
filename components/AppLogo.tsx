import { cn } from "@/lib/utils"
import { APP_ICON_COLOR, APP_ICON_PLANE_PATH } from "@/lib/brandIcon"

function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={32}
      height={32}
      className={cn("size-8 shrink-0 rounded-lg", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill={APP_ICON_COLOR} />
      <g transform="translate(7 7)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d={APP_ICON_PLANE_PATH}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </g>
    </svg>
  )
}

export { AppLogo }

import { ImageResponse } from "next/og"

import { APP_ICON_COLOR, APP_ICON_PLANE_PATH } from "@/lib/brandIcon"

export const size = {
  width: 192,
  height: 192,
}

export const contentType = "image/png"

function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: APP_ICON_COLOR,
          borderRadius: 48,
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={APP_ICON_PLANE_PATH} />
        </svg>
      </div>
    ),
    { ...size }
  )
}

export default Icon
